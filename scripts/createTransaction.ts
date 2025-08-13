import { prisma } from '@/client'

const EMAIL = 'test2@mail.ru';
const AMOUNT = 5600; 
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

	let transactionAmount = AMOUNT / CURRENT_RATE; //57.373375
	let transactionFee = transactionAmount / 100 * user.payInGambling;
	if ((user.balance - LIMIT) < transactionAmount) {
		console.error(`User with email ${EMAIL} has insufficient operational balance.`);
		return;
	}

	transactionAmount = Math.round(transactionAmount * 1000000) / 1000000; // 57.373375 -> 57.373375
	transactionFee = Math.round(transactionFee * 1000000) / 1000000; // 0.57373375 -> 0.57373375
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
					initiator: 'MERCHANT',
					rate: CURRENT_RATE,
					amountInCurrency: transactionAmount,
					amountInCurrencyFee: transactionFee,
				}
			});

			await tx.user.update({
				where: { id: user.id },
				data: {
					balance: {
						decrement: transactionAmount,
					},
					fundsBlocked: {
						increment: transactionAmount,
					},
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