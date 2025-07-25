import { prisma } from '@/client'

async function main() {
	console.log('Checking for pending transactions...');
	const transactions = await prisma.transaction.findMany({
		select: {
			id: true,
			createdAt: true,
			userId: true,
			transactionHistory: {
				where: {
					transactionStatus: 'PENDING',
				}
			}
		},
		where: {
			status: 'PENDING',
		}
	});

	console.log(`Found ${transactions.length} pending transactions:`);
	for (const transaction of transactions) {
		const { id, createdAt, transactionHistory } = transaction;

		const user = await prisma.user.findUnique({
			where: { id: transaction.userId },
			select: {
				id: true,
				email: true,
				balance: true,
				fundsBlocked: true,
			}
		});

		if (!user) {
			console.error(`User for transaction ${id} not found.`);
			continue;
		}

		const txHistory = transactionHistory[0];
		if (!txHistory) {
			console.log(`Transaction ${id} has no pending history.`);
			return;
		}

		const createdDate = new Date(createdAt);
		const now = new Date();
		const diffMs = now.getTime() - createdDate.getTime();
		const diffMinutes = diffMs / (1000 * 60);
		if (diffMinutes >= 15) {
			try {
				await prisma.$transaction(async (tx) => {

					await tx.transaction.update({
						where: { id: id },
						data: {
							status: 'CANCELED',
							balanceBefore: user.balance,
							balanceAfter: user.balance + txHistory.amountInCurrency,		
						}
					});

					await tx.transactionHistory.create({
						data: {
							transactionId: id,
							transactionStatus: 'CANCELED',
							initiator: 'SYSTEM',
							rate: txHistory.rate,
							amountInCurrency: txHistory.amountInCurrency,
							amountInCurrencyFee: 0,
						}
					});

					await tx.user.update({
						where: { id: user.id },
						data: {
							balance: user.balance + txHistory.amountInCurrency,
							fundsBlocked: user.fundsBlocked - txHistory.amountInCurrency,
						}
					});
				});
			} catch (error) {
				console.error(`Failed to update transaction ${id}:`, error);
				return;
			}

			console.log(`Transaction ID: ${id}, Created At: ${createdAt}, User: ${user.email}`);
		}
	}
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })