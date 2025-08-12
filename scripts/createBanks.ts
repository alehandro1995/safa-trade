import { prisma } from '@/client'

async function main() {
	await prisma.bank_name.deleteMany();
	
	await prisma.bank_name.createMany({
		data: [
			{name: 'Тинькофф'},
			{name: 'Сбербанк'},
			{name: 'Альфа-Банк'},
			{name: 'ВТБ'},
			{name: 'Россельхозбанк'},
			{name: 'Почта Банк'},
			{name: 'Уралсиб'},
			{name: 'Газпромбанк'},
			{name: 'ОТП Банк'},	
			{name: 'БКС Банк'},
			{name: 'Промсвязьбанк'},
			{name: 'Убрир Банк'},
			{name: 'Райффайзенбанк'},
			{name: 'Совкомбанк'},
			{name: 'ЮниКредит Банк'},
			{name: 'Банк Русский Стандарт'},
			{name: 'Банк ВБРР'},
			{name: 'Банк Юнистрим'},
			{name: 'Амонат Банк'},
			{name: 'Душанбе Сити Банк'},
			{name: 'Азиатско-Тихоокеанский Банк'},
			{name: 'НБКО Васл'},
			{name: 'Банк Эсхата'},
			{name: 'Спитамен Банк'},
			{name: 'Alif Bank'},
			{name: 'Kaspi Bank'},
			{name: 'Halyk Bank'},
			{name: 'Ziraat Bank'},
			{name: 'Optima Bank'},
			{name: 'mBank'},
			{name: 'Demir Bank'},
			{name: 'Bekai Bank'},
			{name: 'm10'},
			{name: 'Kapital Bank'},
			{name: 'Leobank'},
			{name: 'Bank of Georgia'},
			{name: 'TBC Bank'},
			{name: 'Credo Bank'},
			{name: 'Liberty Bank'},
			{name: 'Armenian Bank'},
			{name: 'Ineco Bank'},
			{name: 'Uni Bank'},
			{name: 'IDBank'}
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