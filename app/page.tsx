import { redirect } from "next/navigation"

export default function Home() {
  // Редирект на страницу входа
  redirect("/login")

  return null
}

