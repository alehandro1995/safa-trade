'use client' // Error boundaries must be Client Components
import { Button } from '@/components/ui/button' 
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
	const router = useRouter()
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])
 
  return (
    <div className='flex justify-center'>
			<Card className="w-[600px] mt-20">
				<CardHeader>
					<CardTitle>Произошла ошибка</CardTitle>
					<CardDescription>
						{error.message}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<p className="text-red-500">Что-то пошло не так!</p>
				</CardContent>
				<CardFooter className="flex justify-between">
					<Button onClick={reset} variant="outline">Попробовать снова</Button>
					<Button onClick={() => router.push("/admin")} variant="outline">Перейти к админке</Button>
				</CardFooter>
			</Card>
    </div>
  )
}