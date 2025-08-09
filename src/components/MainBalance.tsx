"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Skeleton } from "@/components/ui/skeleton";
import { getUser } from "@/actions/userAction";

const LIMIT = parseFloat(process.env.NEXT_PUBLIC_LIMIT || "500");

function MainBalance() {
	const [currentBalance, setCurrentBalance] = useState(0);
	const [insuranceLimit, setInsuranceLimit] = useState(0);
	const [fundsBlocked, setFundsBlocked] = useState(0);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		setIsLoading(true);
		getUser()
			.then((user) => {
				if (!user) {
					// Redirect to login if user is not found
					window.location.href = "/login";
					return;
				}

				console.log("User data: ", user);
				const balance = user.balance || 0;
				if (balance > LIMIT) {
					setCurrentBalance(balance - LIMIT);
					setInsuranceLimit(LIMIT);
				}else{
					setCurrentBalance(0);
					setInsuranceLimit(balance);
				}	
				
				setFundsBlocked(user.fundsBlocked || 0);
			}).catch((error) => {
				console.error("Error fetching user:", error);
				window.location.href = "/login";
			})
			.finally(() => {
				setIsLoading(false);
			});
  }, []);

	return ( 
		<div className="flex items-center gap-x-3">
			<Image src="/tether.png" width={50} height={50} alt="Tether"/>
			<div className='flex flex-col w-full'>
				<div className="text-xl font-semibold">
					{isLoading
						? <Skeleton className="h-8 w-1/2 mb-2" /> 
						: <span>{currentBalance > 0 ? currentBalance.toFixed(6) : '0.00000000'} USDT</span>
					}
				</div>
				<div className="text-sm text-red-500">
					{isLoading
						? <Skeleton className="h-4 w-1/2 mb-2" />
						: <span>Страховой лимит: {insuranceLimit > 0 ? insuranceLimit : '0.00000000'} USDT</span>
					}
				</div>
				<h4 className="text-sm text-blue-600">
					{isLoading
						? <Skeleton className="h-4 w-1/2 mb-2" />
						: <span>Заблокировано: {fundsBlocked.toFixed(6)} USDT</span>
					}
				</h4>
			</div>
		</div>
	);
}

export default MainBalance;