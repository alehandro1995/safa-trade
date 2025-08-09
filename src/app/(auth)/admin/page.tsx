import { columns } from "./columns"
import { DataTable } from "./data-table"
import Link from "next/link";
import {prisma} from "@/client";
import { Button } from "@/components/ui/button";

export default async function AdminPage() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      inviteToken: true,
      role: true,
      status: true,
      balance: true
    }
  });

  if (!users) {
    throw new Error("User not found");
  }
  
  return (
    <div className="container mx-auto flex flex-col">
      <Link href="/admin/create" className="mt-10 self-end">
				<Button>Создать пользователя</Button>
			</Link>
			//TODO: Add pagination and date filter
      <DataTable columns={columns} data={users} />
    </div>
  );
}