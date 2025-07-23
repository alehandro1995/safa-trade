import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
	await prisma.currency.deleteMany();
	
	await prisma.currency.createMany({
		data: [
			{
				name: 'Рубль',
				symbol: 'RUB',
			},
			{
				name: 'Узбекский сум',
				symbol: 'UZS',
			},
			{
				name: 'Казахский тенге',
				symbol: 'KZT',
			},
			{
				name: 'Таджикский сомони',
				symbol: 'TJS',
			},
			{
				name: 'Киргизский сом',
				symbol: 'KGS',
			},
			{
				name: 'Азербайджанский манат',
				symbol: 'AZN',
			},
			{
				name: 'Грузинский лари',
				symbol: 'GEL',
			},
			{
				name: 'Армянский драм',
				symbol: 'AMD',
			},
			{
				name: 'Белорусский рубль',
				symbol: 'BYN',
			},
			{
				name: 'Гривна',
				symbol: 'UAH',
			},
		]
	})
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