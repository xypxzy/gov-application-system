"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ApplicationStatusBadge } from "@/components/application-status-badge"
import { ApplicationForm } from "@/components/application-form"
import { ApplicationHistory } from "@/components/application-history"
import { ApplicationComments } from "@/components/application-comments"
import { ApplicationActions } from "@/components/application-actions"
import { getUserRole } from "@/lib/auth"
import { mockApplications, mockFormSchema } from "@/lib/mock-data"
import type { Application } from "@/types/application"
import { ArrowLeft, FileText, History, MessageSquare } from "lucide-react"

export default function ApplicationDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const userRole = getUserRole()
  const [application, setApplication] = useState<Application | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Имитация загрузки данных заявления
    const fetchApplication = async () => {
      // В реальном приложении здесь будет API-запрос
      await new Promise((resolve) => setTimeout(resolve, 500))

      const app = mockApplications.find((a) => a.id === params.id) || null
      setApplication(app)
      setLoading(false)
    }

    fetchApplication()
  }, [params.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!application) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-2xl font-bold mb-2">Заявление не найдено</h2>
        <p className="text-gray-500 mb-4">Запрошенное заявление не существует или у вас нет доступа к нему</p>
        <Button onClick={() => router.push("/dashboard/applications")}>Вернуться к списку заявлений</Button>
      </div>
    )
  }

  const canEdit =
    userRole === "applicant" && (application.status === "draft" || application.status === "revision_applicant")

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard/applications")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">
            {application.number ? `Заявление №${application.number}` : "Новое заявление"}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <ApplicationStatusBadge status={application.status} />
          <ApplicationActions
            application={application}
            userRole={userRole}
            onStatusChange={(newStatus) => {
              setApplication({ ...application, status: newStatus })
            }}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{application.title}</CardTitle>
          <CardDescription>
            {application.createdAt && `Создано: ${new Date(application.createdAt).toLocaleDateString()}`}
            {application.updatedAt && ` • Обновлено: ${new Date(application.updatedAt).toLocaleDateString()}`}
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="form">
        <TabsList className="grid grid-cols-3 w-full md:w-[400px]">
          <TabsTrigger value="form" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Форма</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            <span>История</span>
          </TabsTrigger>
          <TabsTrigger value="comments" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span>Комментарии</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="form" className="mt-6">
          <ApplicationForm
            schema={mockFormSchema}
            initialData={application.formData}
            readOnly={!canEdit}
            onSubmit={(data) => {
              // В реальном приложении здесь будет API-запрос
              console.log("Form submitted:", data)
              setApplication({ ...application, formData: data })
            }}
          />
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <ApplicationHistory history={application.history || []} />
        </TabsContent>

        <TabsContent value="comments" className="mt-6">
          <ApplicationComments
            comments={application.comments || []}
            onAddComment={(comment) => {
              const newComments = [
                ...(application.comments || []),
                {
                  id: `comment-${Date.now()}`,
                  author: "Текущий пользователь",
                  text: comment,
                  createdAt: new Date().toISOString(),
                },
              ]
              setApplication({ ...application, comments: newComments })
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

