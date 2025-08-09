import { prisma } from '@/client'

async function main() {
	console.log('Checking for pending transactions...');
	const canceledDate = new Date(Date.now() - 15 * 60 * 1000); // 15 minutes ago
	const pendingTransactions = await prisma.transaction.findMany({
		where: {
			status: 'PENDING',
			createdAt: {
				lte: canceledDate
			}
		},
		select: {
			id: true,
			amountInCurrency: true,
			amountInCurrencyFee: true,
			userId: true,
		}
	});

	if (pendingTransactions.length) {
		console.log(`Found ${pendingTransactions.length} pending transactions.`);
	} else {
		console.log('No pending transactions found.');
	}

	for (const transaction of pendingTransactions) {
		try {
			await prisma.$transaction(async (tx) => {
				await tx.transaction.update({
					where: { id: transaction.id },
					data: {
						status: 'CANCELED',
					}
				});

				await tx.user.update({
					where: { id: transaction.userId },
					data: {
						balance: {
							increment: transaction.amountInCurrency,
						},
						// Decrement fundsBlocked by the amount in currency
						fundsBlocked: {
							decrement: transaction.amountInCurrency,
						},
					}
				});
			});
			console.log(`Transaction ${transaction.id} has been canceled.`);
		} catch (error) {
			console.error(`Failed to cancel transaction ${transaction.id}:`, error);
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