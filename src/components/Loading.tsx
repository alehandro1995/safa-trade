import { LoaderCircle } from 'lucide-react';

function Loading() {
	return (
		<div className="w-full h-screen flex items-center justify-center bg-green-950/40 absolute top-0 left-0">
			<LoaderCircle size="90px" className="animate-spin text-emerald-300" />
		</div>
	);
}

export default Loading;