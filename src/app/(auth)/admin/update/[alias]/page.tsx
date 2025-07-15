import { prisma } from "@/client";
import Form from "./form";

async function Page({params}: {params: Promise<{alias: string}>}) {
	const {alias} = await params;
	const user = await prisma.user.findUnique({
		where: {
			inviteToken: alias,
		}
	});

	if (!user) {
		throw new Error("User not found");
	}

	return ( 
		<div className="flex flex-col items-center min-h-screen min-w-[800px]">
			<Form user={user}/>
		</div>
	);
}

export default Page;