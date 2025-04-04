export type ApplicationStatus =
  | "draft"
  | "not_reviewed"
  | "under_review_eo"
  | "under_review_level_1"
  | "under_review_level_2"
  | "in_progress_employee"
  | "for_revision"
  | "revision_applicant"
  | "approved"
  | "rejected"

export interface ApplicationHistoryItem {
  action: string
  user: string
  timestamp: string
  fromStatus: string | null
  toStatus: string | null
  comment?: string
}

export interface ApplicationComment {
  id: string
  author: string
  text: string
  createdAt: string
}

export interface Application {
  id: string
  number: string | null
  title: string
  status: ApplicationStatus
  createdAt: string
  updatedAt: string
  formData: Record<string, any>
  history?: ApplicationHistoryItem[]
  comments?: ApplicationComment[]
}

