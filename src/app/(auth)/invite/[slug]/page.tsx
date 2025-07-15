import { prisma } from "@/client";
import PasswordForm from "@/components/PasswordForm";

async function Page({params}: {params: Promise<{ slug: string }>}) {
  const {slug} = await params;
  const user = await prisma.user.findUnique({
    where: {
      inviteToken: slug
    }
  });

  if (!user) {
    throw new Error("User not found");
  }

  return ( 
    <div className="flex justify-center relative px-2">
      <PasswordForm user={user} />
    </div>
  );
}

export default Page;