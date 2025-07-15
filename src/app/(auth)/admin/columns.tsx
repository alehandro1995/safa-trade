"use client"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { deleteUser } from "@/actions/userAction"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
 
export type User = {
	id: number;
	email: string;
	inviteToken: string;
	role: 'USER' | 'ADMIN';
	status: boolean;
	balance: number;
};

const handleDelete = async (email: string) => {
	try {
		await deleteUser(email);
		toast.success("User deleted successfully");
	} catch (error) {
		toast.error("Failed to delete user");
	}
}
 
export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "inviteToken",
    header: "Token",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
	{
		accessorKey: "status",
		header: "Status",
		cell: ({ row }) => (row.getValue("status") ? "Active" : "Inactive"),
	},
	{
		accessorKey: "balance",
		header: "Balance",
	},
	{
    id: "actions",
    cell: ({ row }) => {
			const email = row.getValue("email") as string;
      const link = row.getValue("inviteToken") as string;
			const url = `${process.env.NEXT_PUBLIC_URL}/invite/${link}`;

      return (
				<AlertDialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(url)}
							className="cursor-pointer hover:underline"
            >
              Copy link
            </DropdownMenuItem>
            <DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={() => window.location.href = `/admin/update/${link}`}
							className="cursor-pointer hover:underline"
						>
							Update
						</DropdownMenuItem>
						<AlertDialogTrigger asChild>
							<DropdownMenuItem className="cursor-pointer hover:underline text-destructive">Delete</DropdownMenuItem>
						</AlertDialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>

					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Are you sure?</AlertDialogTitle>
							<AlertDialogDescription>
								This action cannot be undone. This will permanently delete the user with email <strong>{email}</strong>.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction onClick={() => handleDelete(email)}>
								Delete
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>

				</AlertDialog>
      )
    },
  },
]