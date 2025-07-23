"use client";
import { useMemo } from 'react';
import Image from 'next/image';
import { useUserStore } from '@/store/user';
import { Skeleton } from "@/components/ui/skeleton";

const LIMIT = parseFloat(process.env.NEXT_PUBLIC_LIMIT || "500");

function MainBalance() {
	const user = useUserStore((state) => state.user);

	const currentBalance = useMemo(() => {
		if (!user) return 0;
		const balance = user.balance || 0;
    if (balance !== 0 && balance > LIMIT) {
      return balance - LIMIT;
    }
    return 0;
  }, [user?.balance]);

  const insuranceLimit = useMemo(() => {
		if (!user) return 0;
		const balance = user.balance || 0;
    if (balance > LIMIT) {
      return LIMIT;
    }

    return balance;
  }, [user?.balance]);

	return ( 
		<div className="flex items-center gap-x-3">
			<Image src="/tether.png" width={50} height={50} alt="Tether"/>
			<div className='flex flex-col w-full'>
				<div className="text-xl font-semibold">
					{user 
						? <span>{currentBalance > 0 ? currentBalance.toFixed(8) : '0.00000000'} USDT</span>
						: <Skeleton className="h-4 w-1/2 mb-2" />
					}
				</div>
				<div className="text-sm text-red-500">
					{user 
						? <span>Страховой лимит: {user?.balance > 0 ? insuranceLimit : '0.00000000'} USDT</span>
						: <Skeleton className="h-4 w-1/2 mb-2" />
					}
				</div>
				<h4 className="text-sm text-blue-600">
					{user 
						? <span>Заблокировано: {user.fundsBlocked > 0 ? user.fundsBlocked.toFixed(8) : '0.00000000'} USDT</span>
						: <Skeleton className="h-4 w-1/2" />
					}
				</h4>
			</div>
		</div>
	);
}

export default MainBalance;