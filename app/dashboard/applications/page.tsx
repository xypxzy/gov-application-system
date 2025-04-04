"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { ApplicationTable } from "@/components/application-table"
import { PlusCircle, Search, Filter } from "lucide-react"
import { getUserRole } from "@/lib/auth"
import { mockApplications } from "@/lib/mock-data"
import type { ApplicationStatus } from "@/types/application"

export default function ApplicationsPage() {
  const router = useRouter()
  const userRole = getUserRole()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "all">("all")

  // Фильтрация заявлений
  const filteredApplications = mockApplications.filter((app) => {
    const matchesSearch =
      app.number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || app.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold">Заявления</h1>

        {userRole === "applicant" && (
          <Button onClick={() => router.push("/dashboard/applications/new")}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Новое заявление
          </Button>
        )}
      </div>

      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Поиск по номеру или названию..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as ApplicationStatus | "all")}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Все статусы" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value="draft">Черновик</SelectItem>
                <SelectItem value="not_reviewed">Не рассмотрено</SelectItem>
                <SelectItem value="under_review_eo">На рассмотрении (ЕО)</SelectItem>
                <SelectItem value="under_review_level_1">На рассмотрении (Уровень 1)</SelectItem>
                <SelectItem value="under_review_level_2">На рассмотрении (Уровень 2)</SelectItem>
                <SelectItem value="in_progress_employee">В работе</SelectItem>
                <SelectItem value="for_revision">На доработке</SelectItem>
                <SelectItem value="revision_applicant">Доработка заявителем</SelectItem>
                <SelectItem value="approved">Одобрено</SelectItem>
                <SelectItem value="rejected">Отказано</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <ApplicationTable applications={filteredApplications} userRole={userRole} />
    </div>
  )
}

