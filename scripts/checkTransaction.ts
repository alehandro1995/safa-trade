import { prisma } from '@/client'

async function main() {
	console.log('Checking for pending transactions...');
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