import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FaRegCircleCheck } from "react-icons/fa6";
import { BsExclamationOctagonFill } from "react-icons/bs";

type AlertProps = {
	type: "default" | "destructive";
	title: string;
	description?: string;
}

function DefaultAlert({type, title, description}: AlertProps) {
	return ( 
		<Alert variant={type} className="fixed bottom-4 right-4 w-96 z-50">
			{type === "default" && <FaRegCircleCheck className="text-emerald-500 w-6 h-6" />}
			{type === "destructive" && <BsExclamationOctagonFill className="text-red-500 w-6 h-6" />}
			<AlertTitle>{title}</AlertTitle>
			<AlertDescription>
				{description && "You can add components and dependencies to your app using the cli."}
			</AlertDescription>
		</Alert>
	);
}

export default DefaultAlert;