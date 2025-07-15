import { PrismaClient } from "../generated/prisma"

const prisma = new PrismaClient();

const email = '123@mail.ru';

async function main() {
	const user = await prisma.user.findUnique({
		where: { email },
	});

	if (!user) {
		console.error(`User with email ${email} not found.`);
		return;
	}

	const requisites = await prisma.requisites.findMany({
		where: { userId: user.id },
	});

	if (!requisites.length) {
		console.error(`No requisites found for user with email ${email}.`);
		return;
	}
	
	const requisite = requisites[Math.floor(Math.random() * requisites.length)];
	if (!requisite) {
		console.error(`Requisite for user with email ${email} not found.`);
		return;
	}

	const randomNumber = Math.floor(Math.random() * 1000) + 1;
	
  await prisma.transaction.create({
		data: {
			num: '23' + randomNumber.toString().padStart(3, '0'),
	  	userId: user.id,
			requisitesId: requisite.id,
			amount: 5120,
			type: 'RECEIVE',
			status: 'PENDING',
			description: 'Test transaction',
		}
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