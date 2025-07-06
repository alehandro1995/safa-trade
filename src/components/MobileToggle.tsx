import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

function MobileToggle() {
	return ( 
		<div className="p-4 bg-emerald-100 w-full flex flex-col gap-y-4">
			<div className="flex items-center space-x-2">
				<Switch id="airplane-mode" />
				<Label htmlFor="airplane-mode">Приём</Label>
			</div>
			<div className="flex items-center space-x-2">
				<Switch id="notifications" />
				<Label htmlFor="notifications">Выплата</Label>
			</div>
		</div>
	);
}

export default MobileToggle;