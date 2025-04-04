"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ApplicationStatusBadge } from "@/components/application-status-badge"
import { getUserRole } from "@/lib/auth"
import type { UserRole } from "@/types/user"
import type { ApplicationStatus } from "@/types/application"

export default function DashboardPage() {
  const [userRole, setUserRole] = useState<UserRole | null>(null)

  useEffect(() => {
    setUserRole(getUserRole())
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Панель управления</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Новые заявления"
          value={userRole === "applicant" ? 0 : 12}
          description="Ожидают рассмотрения"
          status="not_reviewed"
        />
        <StatCard title="В работе" value={8} description="Заявления в процессе обработки" status="under_review_eo" />
        <StatCard
          title="На доработке"
          value={userRole === "applicant" ? 2 : 5}
          description="Требуют доработки"
          status="for_revision"
        />
        <StatCard title="Одобрено" value={15} description="За последние 30 дней" status="approved" />
        <StatCard title="Отказано" value={3} description="За последние 30 дней" status="rejected" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Последние действия</CardTitle>
          <CardDescription>Недавние изменения в заявлениях</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-0">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  {activity.icon}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{activity.title}</p>
                  <p className="text-sm text-gray-500">{activity.description}</p>
                </div>
                <div className="text-sm text-gray-500">{activity.time}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function StatCard({
  title,
  value,
  description,
  status,
}: {
  title: string
  value: number
  description: string
  status: ApplicationStatus
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <ApplicationStatusBadge status={status} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

const recentActivities = [
  {
    icon: <span className="text-green-500">✓</span>,
    title: "Заявление №2023-156 одобрено",
    description: "Заместитель руководителя подписал документ",
    time: "2 часа назад",
  },
  {
    icon: <span className="text-yellow-500">⟳</span>,
    title: "Заявление №2023-158 отправлено на доработку",
    description: "Требуется дополнительная информация",
    time: "3 часа назад",
  },
  {
    icon: <span className="text-blue-500">→</span>,
    title: "Заявление №2023-160 передано на рассмотрение",
    description: "Начальник отдела назначил ответственного",
    time: "5 часов назад",
  },
  {
    icon: <span className="text-red-500">✕</span>,
    title: "Заявление №2023-155 отклонено",
    description: "Не соответствует требованиям",
    time: "1 день назад",
  },
]

