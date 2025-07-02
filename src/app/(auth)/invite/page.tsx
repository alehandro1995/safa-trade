import { FaTelegramPlane } from "react-icons/fa";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

function Page() {
	return ( 
		<form className="flex min-h-screen flex-col items-center justify-between">
			<Card className="w-96 mt-20">
				<CardHeader>
					<CardTitle>Регистрация</CardTitle>
					<CardDescription>Пожалуйста, создайте новый пароль для <b>входа</b>.</CardDescription>
					<CardAction className="cursor-pointer opacity-90 hover:opacity-100 transition-opacity">
						<FaTelegramPlane />
					</CardAction>
				</CardHeader>
				<CardContent>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Новый пароль</Label>
              <Input
                id="password"
                type="password"
								name="password"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Подтвердить пароль</Label>
              <Input 
								id="recover" 
								type="recover"
								name="recover" 
								required 
							/>
            </div>
          </div>
				</CardContent>
				<CardFooter>
					<Button type="submit" className="w-full cursor-pointer">
          	Войти
        	</Button>
				</CardFooter>
			</Card>
		</form>
	);
}

export default Page;