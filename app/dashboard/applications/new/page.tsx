"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ApplicationForm } from "@/components/application-form"
import { mockFormSchema } from "@/lib/mock-data"
import { ArrowLeft } from "lucide-react"

export default function NewApplicationPage() {
  const router = useRouter()

  const handleSubmit = async (data: any, isDraft: boolean) => {
    try {
      // В реальном приложении здесь будет API-запрос для создания заявления
      console.log("Creating application:", { data, isDraft })

      // Имитация задержки запроса
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Генерируем случайный ID для нового заявления
      const newId = `app-${Date.now()}`

      // Перенаправляем на страницу созданного заявления
      router.push(`/dashboard/applications/${newId}`)
    } catch (error) {
      console.error("Error creating application:", error)
      // Здесь можно добавить обработку ошибок, например, показать уведомление
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard/applications")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Новое заявление</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Создание заявления</CardTitle>
          <CardDescription>
            Заполните форму заявления. Вы можете сохранить черновик или отправить заявление на рассмотрение.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ApplicationForm
            schema={mockFormSchema}
            initialData={{}}
            onSubmit={(data) => handleSubmit(data, false)}
            onSaveDraft={(data) => handleSubmit(data, true)}
          />
        </CardContent>
      </Card>
    </div>
  )
}

