import { Card } from "@/components/ui/card"
import type { ApplicationHistoryItem } from "@/types/application"

interface ApplicationHistoryProps {
  history: ApplicationHistoryItem[]
}

export function ApplicationHistory({ history }: ApplicationHistoryProps) {
  if (history.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-center text-gray-500">История изменений пуста</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {history.map((item, index) => (
        <Card key={index} className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-medium">{item.action}</p>
              <p className="text-sm text-gray-500">
                {item.user} • {new Date(item.timestamp).toLocaleString()}
              </p>
              {item.comment && <p className="mt-2 text-sm border-l-2 border-gray-200 pl-3">{item.comment}</p>}
            </div>
            <div className="text-sm text-gray-500">
              {item.fromStatus && item.toStatus && (
                <p>
                  {getStatusLabel(item.fromStatus)} → {getStatusLabel(item.toStatus)}
                </p>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

function getStatusLabel(status: string): string {
  const statusLabels: Record<string, string> = {
    draft: "Черновик",
    not_reviewed: "Не рассмотрено",
    under_review_eo: "На рассмотрении (ЕО)",
    under_review_level_1: "На рассмотрении (Уровень 1)",
    under_review_level_2: "На рассмотрении (Уровень 2)",
    in_progress_employee: "В работе",
    for_revision: "На доработке",
    revision_applicant: "Доработка заявителем",
    approved: "Одобрено",
    rejected: "Отказано",
  }

  return statusLabels[status] || status
}

