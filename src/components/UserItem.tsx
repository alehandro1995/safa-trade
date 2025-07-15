"use client"
import { useState } from "react";
import { FaPencil } from "react-icons/fa6";
import { changeBalance } from "@/actions/changeBalance";
import Link from "next/link";

type User = {
  id: number;
  email: string;
  inviteToken: string;
  role: "USER" | "ADMIN";
  status: boolean;
  balance: number
};

function UserItem({user}: {user:User}) {
  const [balance, setBalance] = useState<number>(user.balance);

  const change = () => {
    const formData = new FormData();
    formData.append("id", user.id.toString())
    formData.append("balance", balance.toString())
    changeBalance("", formData).then((res) => {
      console.log(res);
    })
  }

  return ( 
    <div key={user.id} className="grid grid-cols-6 items-center bg-white p-5 rounded-md shadow-md">
      <div><b>{user.id}.</b> {user.email}</div>
      <span>{user.inviteToken}</span>
      <span>{user.role}</span>
      <input 
        className="border border-gray-700 px-2 w-[200px] rounded-sm"
        onChange={e => setBalance(Number(e.target.value))} 
        onBlur={change}
        value={balance}
        type="number"
      />
      <b className="text-right">{user.status ? "ACTIVE" : "STOP"}</b>
			<Link href={`/admin/update/${user.id}`} className="text-right">
				<FaPencil className="inline-block text-2xl" />
			</Link>
    </div>
   );
}

export default UserItem;