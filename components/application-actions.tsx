"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import type { Application, ApplicationStatus } from "@/types/application"
import type { UserRole } from "@/types/user"
import { ChevronDown, Send, Save, RotateCcw, Check, X } from "lucide-react"

interface ApplicationActionsProps {
  application: Application
  userRole: UserRole | null
  onStatusChange: (newStatus: ApplicationStatus) => void
}

export function ApplicationActions({ application, userRole, onStatusChange }: ApplicationActionsProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [actionType, setActionType] = useState<string | null>(null)
  const [comment, setComment] = useState("")

  const handleAction = (action: string) => {
    // Действия, требующие комментария
    const actionsRequiringComment = ["send_to_revision", "reject", "reassign"]

    if (actionsRequiringComment.includes(action)) {
      setActionType(action)
      setDialogOpen(true)
      return
    }

    // Действия без комментария
    executeAction(action, "")
  }

  const executeAction = (action: string, commentText: string) => {
    // В реальном приложении здесь будет API-запрос
    console.log(`Executing action: ${action} with comment: ${commentText}`)

    // Определяем новый статус в зависимости от действия и роли
    let newStatus: ApplicationStatus = application.status

    switch (action) {
      case "submit":
        newStatus = "not_reviewed"
        break
      case "take_to_work":
        newStatus = "under_review_eo"
        break
      case "assign_to_level_1":
        newStatus = "under_review_level_1"
        break
      case "assign_to_level_2":
        newStatus = "under_review_level_2"
        break
      case "assign_to_employee":
        newStatus = "in_progress_employee"
        break
      case "send_to_revision":
        newStatus = userRole === "single_window" ? "revision_applicant" : "for_revision"
        break
      case "approve":
        newStatus = "approved"
        break
      case "reject":
        newStatus = "rejected"
        break
      case "save_draft":
        newStatus = "draft"
        break
    }

    onStatusChange(newStatus)
    setDialogOpen(false)
    setComment("")
  }

  const getAvailableActions = () => {
    const actions = []

    if (userRole === "applicant") {
      if (application.status === "draft" || application.status === "revision_applicant") {
        actions.push({ id: "submit", label: "Отправить на рассмотрение", icon: Send })
        actions.push({ id: "save_draft", label: "Сохранить черновик", icon: Save })
      }
    } else if (userRole === "single_window") {
      if (application.status === "not_reviewed") {
        actions.push({ id: "take_to_work", label: "Взять в работу", icon: Check })
      }

      if (application.status === "under_review_eo") {
        actions.push({ id: "assign_to_level_1", label: "Назначить начальника 1 уровня", icon: Send })
        actions.push({ id: "send_to_revision", label: "Отправить на доработку", icon: RotateCcw })
      }

      if (application.status === "for_revision") {
        actions.push({ id: "send_to_revision", label: "Отправить заявителю", icon: Send })
      }
    } else if (userRole === "manager_level_1") {
      if (application.status === "under_review_level_1") {
        actions.push({ id: "assign_to_level_2", label: "Назначить начальника 2 уровня", icon: Send })
        actions.push({ id: "assign_to_employee", label: "Назначить сотрудника", icon: Send })
        actions.push({ id: "send_to_revision", label: "Отправить на доработку", icon: RotateCcw })
        actions.push({ id: "approve", label: "Одобрить", icon: Check })
        actions.push({ id: "reject", label: "Отказать", icon: X })
      }
    } else if (userRole === "manager_level_2") {
      if (application.status === "under_review_level_2") {
        actions.push({ id: "assign_to_employee", label: "Назначить сотрудника", icon: Send })
        actions.push({ id: "send_to_revision", label: "Отправить на доработку", icon: RotateCcw })
        actions.push({ id: "approve", label: "Одобрить", icon: Check })
        actions.push({ id: "reject", label: "Отказать", icon: X })
      }
    } else if (userRole === "deputy_head") {
      if (["under_review_level_1", "under_review_level_2"].includes(application.status)) {
        actions.push({ id: "approve", label: "Подписать", icon: Check })
        actions.push({ id: "send_to_revision", label: "Отправить на доработку", icon: RotateCcw })
      }
    }

    return actions
  }

  const actions = getAvailableActions()

  if (actions.length === 0) {
    return null
  }

  return (
    <>
      {actions.length === 1 ? (
        <Button onClick={() => handleAction(actions[0].id)} className="flex items-center gap-2">
          {/*{actions()[0]?.icon && <actions[0].icon className="h-4 w-4" />}*/}
          {actions[0].label}
        </Button>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="flex items-center gap-2">
              Действия
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            \
            {actions.map((action) => (
              <DropdownMenuItem
                key={action.id}
                onClick={() => handleAction(action.id)}
                className="flex items-center gap-2 cursor-pointer"
              >
                {action.icon && <action.icon className="h-4 w-4" />}
                {action.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "send_to_revision" && "Отправить на доработку"}
              {actionType === "reject" && "Отказать в рассмотрении"}
              {actionType === "reassign" && "Переназначить ответственного"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "send_to_revision" && "Укажите причину отправки на доработку"}
              {actionType === "reject" && "Укажите причину отказа"}
              {actionType === "reassign" && "Укажите причину переназначения"}
            </DialogDescription>
          </DialogHeader>

          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Введите комментарий..."
            className="min-h-[100px]"
          />

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={() => executeAction(actionType!, comment)} disabled={!comment.trim()}>
              Подтвердить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

