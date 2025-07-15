import { NextResponse } from "next/server";
import { prisma } from "@/client";
import { cookies } from "next/headers";
import { TransactionStatus, TransactionType } from "../../../../generated/prisma";

export async function GET(request: Request) {
  const cookie = await cookies();
	const email = cookie.get("email")?.value;

  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const status = url.searchParams.get("status") as TransactionStatus;
  const type = url.searchParams.get("type") as TransactionType;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 403 });

  const transactions = await prisma.transaction.findMany({
    where: {
      userId: user.id,
      status: status,
			type: type
    },
    include: {
      requisites: {
        include: {
          device: true,
          group: true,
          currency: true,
          bankName: true,
          paymentMethod: true,
        },
      },
    },
    orderBy: {
      num: "asc",
    },
  });

  return NextResponse.json({ transactions });
}