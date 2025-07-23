import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

const EMAIL = 'test@mail.ru';
const AMOUNT = 5120; 
const CURRENCY = 'RUB';
const CURRENT_RATE = 89.24
const LIMIT = parseInt(process.env.NEXT_PUBLIC_LIMIT || '500');

async function main() {
	const user = await prisma.user.findUnique({
		where: { 
			email: EMAIL,
			status: true,
			receiveStatus: true,
		},
	});

	if (!user) {
		console.error(`User with email ${EMAIL} not found.`);
		return;
	}

	const transactionAmount = AMOUNT / CURRENT_RATE;
	if ((user.balance - LIMIT) < transactionAmount) {
		console.error(`User with email ${EMAIL} has insufficient operational balance.`);
		return;
	}

	const requisites = await prisma.requisites.findMany({
		where: { 
			userId: user.id, 
			status: true,
			currency: {
				symbol: CURRENCY,
			} 
		},
		include: {
			currency: true,
		}
	});

	if (!requisites.length) {
		console.error(`No requisites found for user with email`);
		return;
	}
	
	const requisite = requisites[Math.floor(Math.random() * requisites.length)];
	if (!requisite) {
		console.error(`Requisite for user with email not found.`);
		return;
	}

	const randomNumber = Math.floor(Math.random() * 1000) + 1;
	try {
		await prisma.$transaction(async (tx) => {

			await tx.transaction.create({
				data: {
					num: '23' + randomNumber.toString().padStart(3, '0'),
					userId: user.id,
					requisitesId: requisite.id,
					amount: AMOUNT,
					type: 'RECEIVE',
					balanceBefore: user.balance,
					balanceAfter: user.balance - transactionAmount,
					transactionHistory:{ 
						create: {
							transactionStatus: 'PENDING',
							initiator: 'MERCHANT',
							rate: CURRENT_RATE,
							amountInCurrency: transactionAmount,
							amountInCurrencyFee: transactionAmount / 100 * user.payInGambling,
						}
					}
				}
			});

			await tx.user.update({
				where: { id: user.id },
				data: {
					balance: user.balance - transactionAmount,
					fundsBlocked: user.fundsBlocked + transactionAmount
				}
			});
		});
	} catch (error) {
		console.error("Failed to create transaction:", error);
		return;
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