"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import type { ApplicationComment } from "@/types/application"
import { Send } from "lucide-react"

interface ApplicationCommentsProps {
  comments: ApplicationComment[]
  onAddComment: (comment: string) => void
}

export function ApplicationComments({ comments, onAddComment }: ApplicationCommentsProps) {
  const [newComment, setNewComment] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newComment.trim()) {
      onAddComment(newComment.trim())
      setNewComment("")
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {comments.length === 0 ? (
          <Card className="p-6">
            <p className="text-center text-gray-500">Комментариев пока нет</p>
          </Card>
        ) : (
          comments.map((comment) => (
            <Card key={comment.id} className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  {comment.author.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{comment.author}</p>
                    <p className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</p>
                  </div>
                  <p className="mt-1 text-sm">{comment.text}</p>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <Textarea
          placeholder="Добавить комментарий..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[100px]"
        />
        <Button
          type="submit"
          className="self-end"
          disabled={!newComment.trim()}
          ame="self-end"
          disabled={!newComment.trim()}
        >
          <Send className="mr-2 h-4 w-4" />
          Отправить
        </Button>
      </form>
    </div>
  )
}

