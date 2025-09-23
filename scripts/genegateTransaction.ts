import { prisma } from '@/client'
import { TransactionInitiator, TransactionStatus } from '@/generated/prisma';


// === Настраиваемые параметры ===
const EMAIL = 'test2@mail.ru';
//const CURRENCY = 'RUB';
//const CURRENT_RATE = 80.78;
//const CURRENCY = 'TJS';
//const CURRENT_RATE = 9.36;
//const CURRENCY = 'AMD';
//const CURRENT_RATE = 382;
const CURRENCY = 'GEL';
const CURRENT_RATE = 2.73;
const startDate = new Date(2025, 8, 22, 0, 0, 0);
const transactionCount = 24;                      
const minAmount = 200;

async function main() {
  let currentDate = startDate;
  let currentNum = 50500; // первый номер транзакции
	const user = await prisma.user.findUnique({
		where: { 
			email: EMAIL,
		},
	});
	
	if (!user) {
		console.error(`User with email ${EMAIL} not found.`);
		return;
	}
	
  for (let i = 0; i < transactionCount; i++) {
		let increment = Math.floor(Math.random() * 20) + 2;
		currentNum += increment; // увеличиваем номер транзакции на случайное число от 2 до 20
    // Генерация случайной суммы с двумя десятичными знаками
    const randomValue = Math.ceil(Math.random() * 100) * 10;
		let amount = randomValue < minAmount ? randomValue * 10 : randomValue;
		if (amount < minAmount) {
			console.warn(`Generated amount ${amount} is less than minimum ${minAmount}. With ${randomValue}`);
			continue;
		}
    // Увеличиваем дату на случайное число минут от 5 до 20
    const minutesToAdd = Math.floor(Math.random() * 10) + 1;
    currentDate = new Date(currentDate.getTime() + minutesToAdd * 60000);
    console.log(`${i+1}. Creating transaction #${currentNum} with amount ${amount} at ${currentDate.toLocaleString()}`);
		let transactionAmount = amount / CURRENT_RATE; //57.373375
		let transactionFee = transactionAmount / 100 * user.payInGambling;

		const requisites = await prisma.requisites.findMany({
			where: { 
				userId: user.id, 
				status: true,
				currency: {
					symbol: CURRENCY,
				},
				minOrder: {
					lte: amount,
				},
				maxOrder: {
					gte: amount,
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

		const transactionStatus = i % 3 === 0 ? 'CANCELED' : 'COMPLETED' as TransactionStatus;
		const initiator = transactionStatus === 'CANCELED' ? 'SYSTEM' : 'TREADER' as TransactionInitiator;
		try {
			await prisma.transaction.create({
				data: {
					num: currentNum.toString(),
					userId: user.id,
					requisitesId: requisite.id,
					amount: amount,
					type: 'RECEIVE',
					status: transactionStatus,
					initiator: initiator,
					rate: CURRENT_RATE,
					amountInCurrency: transactionAmount,
					amountInCurrencyFee: transactionFee,
					createdAt: currentDate,
					updatedAt: currentDate,
				}
			})
					
		} catch (error) {
			console.error("Failed to create transaction:", error);
			return;
		}
  }
}

main()
  .catch(e => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });