import { useState } from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { changeUserStatus } from "@/actions/userAction";
import type { TransactionType } from "../../generated/prisma";

type MobileToggleProps = {
	paymentStatus: boolean;
	receiveStatus: boolean;
};

function MobileToggle({paymentStatus, receiveStatus}: MobileToggleProps) {
	const [receive, setReceive] = useState(receiveStatus);
	const [payment, setPayment] = useState(paymentStatus);

	const handleSwitchChange = (checked: boolean, data: "receive" | "payment") => {
		const type = data.toUpperCase() as TransactionType;
		console.log(`Switch changed: ${type} is now ${checked}`);
		changeUserStatus(type, checked)
			.then(() => {
				if (data === "receive") {
					setReceive(checked);
					toast.success(`${checked ? "Приём включён" : "Приём выключен"}`)
				} else if (data === "payment") {
					setPayment(checked);
					toast.success(`${checked ? "Выплаты включены" : "Выплаты выключены"}`)
				}
			}).catch((error) => {
				console.error("Error changing user status:", error);
				toast.error("Ошибка при изменении статуса");
			});
	}
	return ( 
		<div className="p-4 bg-emerald-100 w-full flex flex-col gap-y-4">
			<div className="flex items-center space-x-2">
				<Switch 
					id="receive" 
					checked={receive}
					onCheckedChange={(checked) => handleSwitchChange(checked, "receive")} 
				/>
				<Label htmlFor="receive">Приём</Label>
			</div>
			<div className="flex items-center space-x-2">
				<Switch 
					id="payment" 
					checked={payment}
					onCheckedChange={(checked) => handleSwitchChange(checked, "payment")}
				/>
				<Label htmlFor="notifications">Выплата</Label>
			</div>
		</div>
	);
}

export default MobileToggle;