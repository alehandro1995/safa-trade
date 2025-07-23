import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
	await prisma.payment_method.deleteMany();

	await prisma.payment_method.createMany({
		data: [
			{name: 'СПБ'},
			{name: 'СПБ QR'},
			{name: 'Перевод на карту'},
			{name: 'Перевод по номеру счёта'},
			{name: 'Трансграничный перевод'}
		],
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