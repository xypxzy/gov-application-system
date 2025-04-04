"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ApplicationStatusBadge } from "@/components/application-status-badge"
import type { Application } from "@/types/application"
import type { UserRole } from "@/types/user"
import { ChevronRight } from "lucide-react"

interface ApplicationTableProps {
  applications: Application[]
  userRole: UserRole | null
}

export function ApplicationTable({ applications, userRole }: ApplicationTableProps) {
  const router = useRouter()
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Application
    direction: "ascending" | "descending"
  }>({
    key: "updatedAt",
    direction: "descending",
  })

  const sortedApplications = [...applications].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1
    }
    return 0
  })

  const requestSort = (key: keyof Application) => {
    let direction: "ascending" | "descending" = "ascending"
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="cursor-pointer" onClick={() => requestSort("number")}>
              Номер
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => requestSort("title")}>
              Название
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => requestSort("status")}>
              Статус
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => requestSort("updatedAt")}>
              Обновлено
            </TableHead>
            <TableHead className="w-[100px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedApplications.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                Заявления не найдены
              </TableCell>
            </TableRow>
          ) : (
            sortedApplications.map((application) => (
              <TableRow
                key={application.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => router.push(`/dashboard/applications/${application.id}`)}
              >
                <TableCell className="font-medium">{application.number || "—"}</TableCell>
                <TableCell>{application.title}</TableCell>
                <TableCell>
                  <ApplicationStatusBadge status={application.status} />
                </TableCell>
                <TableCell>
                  {application.updatedAt ? new Date(application.updatedAt).toLocaleDateString() : "—"}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

