import { Badge } from "@/components/ui/badge"
import type { ApplicationStatus } from "@/types/application"

interface ApplicationStatusBadgeProps {
  status: ApplicationStatus
}

export function ApplicationStatusBadge({ status }: ApplicationStatusBadgeProps) {
  const statusConfig = {
    draft: {
      label: "Черновик",
      variant: "outline" as const,
    },
    not_reviewed: {
      label: "Не рассмотрено",
      variant: "secondary" as const,
    },
    under_review_eo: {
      label: "На рассмотрении (ЕО)",
      variant: "default" as const,
    },
    under_review_level_1: {
      label: "На рассмотрении (Уровень 1)",
      variant: "default" as const,
    },
    under_review_level_2: {
      label: "На рассмотрении (Уровень 2)",
      variant: "default" as const,
    },
    in_progress_employee: {
      label: "В работе",
      variant: "default" as const,
    },
    for_revision: {
      label: "На доработке",
      variant: "warning" as const,
    },
    revision_applicant: {
      label: "Доработка заявителем",
      variant: "warning" as const,
    },
    approved: {
      label: "Одобрено",
      variant: "success" as const,
    },
    rejected: {
      label: "Отказано",
      variant: "destructive" as const,
    },
  }

  const config = statusConfig[status]

  return (
    <Badge
      variant={config.variant}
      className={
        status === "for_revision" || status === "revision_applicant"
          ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
          : status === "approved"
            ? "bg-green-100 text-green-800 hover:bg-green-100"
            : ""
      }
    >
      {config.label}
    </Badge>
  )
}

