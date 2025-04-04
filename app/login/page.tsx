"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

type FormData = {
  username: string
  password: string
}

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    try {
      setError(null)

      // Здесь будет запрос к API для аутентификации
      // Имитация запроса для демонстрации
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Имитация успешного входа с разными ролями
      const roles = ["applicant", "single_window", "manager_level_1", "manager_level_2", "deputy_head"]
      const randomRole = roles[Math.floor(Math.random() * roles.length)]

      // Сохраняем роль пользователя в localStorage (в реальном приложении лучше использовать безопасные методы хранения)
      localStorage.setItem("userRole", randomRole)

      // Перенаправляем на дашборд
      router.push("/dashboard")
    } catch (err) {
      setError("Ошибка входа. Проверьте логин и пароль.")
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Вход в систему</CardTitle>
          <CardDescription>Введите свои учетные данные для входа в систему управления заявлениями</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="username">Имя пользователя</Label>
              <Input id="username" {...register("username", { required: "Имя пользователя обязательно" })} />
              {errors.username && <p className="text-sm text-red-500">{errors.username.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input id="password" type="password" {...register("password", { required: "Пароль обязателен" })} />
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>
          </CardContent>

          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Вход..." : "Войти"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

