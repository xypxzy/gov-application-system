"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import type { UserRole } from "@/types/user"
import { LayoutDashboard, FileText, ClipboardList, Users, Settings, LogOut, Menu } from "lucide-react"

interface SidebarProps {
  userRole: UserRole | null
}

export function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const routes = [
    {
      label: "Панель управления",
      icon: LayoutDashboard,
      href: "/dashboard",
      roles: ["applicant", "single_window", "manager_level_1", "manager_level_2", "deputy_head"],
    },
    {
      label: "Мои заявления",
      icon: FileText,
      href: "/dashboard/applications",
      roles: ["applicant"],
    },
    {
      label: "Заявления",
      icon: ClipboardList,
      href: "/dashboard/applications",
      roles: ["single_window", "manager_level_1", "manager_level_2", "deputy_head"],
    },
    {
      label: "Сотрудники",
      icon: Users,
      href: "/dashboard/employees",
      roles: ["single_window", "manager_level_1", "manager_level_2"],
    },
    {
      label: "Настройки",
      icon: Settings,
      href: "/dashboard/settings",
      roles: ["applicant", "single_window", "manager_level_1", "manager_level_2", "deputy_head"],
    },
  ]

  const filteredRoutes = routes.filter((route) => userRole && route.roles.includes(userRole))

  const handleLogout = () => {
    // Очищаем данные пользователя и перенаправляем на страницу входа
    localStorage.removeItem("userRole")
    window.location.href = "/login"
  }

  const SidebarContent = (
    <div className="flex flex-col h-full">
      <div className="py-4 px-3 border-b">
        <h2 className="text-lg font-bold">Система заявлений</h2>
        <p className="text-sm text-gray-500">
          {userRole === "applicant" && "Заявитель"}
          {userRole === "single_window" && "Сотрудник ЕО"}
          {userRole === "manager_level_1" && "Начальник 1 уровня"}
          {userRole === "manager_level_2" && "Начальник 2 уровня"}
          {userRole === "deputy_head" && "Заместитель руководителя"}
        </p>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-1">
          {filteredRoutes.map((route) => (
            <Link key={route.href} href={route.href} onClick={() => setOpen(false)}>
              <Button
                variant={pathname === route.href ? "secondary" : "ghost"}
                className={cn("w-full justify-start", pathname === route.href ? "bg-gray-100" : "")}
              >
                <route.icon className="mr-2 h-5 w-5" />
                {route.label}
              </Button>
            </Link>
          ))}
        </div>
      </ScrollArea>

      <div className="mt-auto p-3 border-t">
        <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
          <LogOut className="mr-2 h-5 w-5" />
          Выйти
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* Мобильная версия */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden fixed top-4 left-4 z-10">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          {SidebarContent}
        </SheetContent>
      </Sheet>

      {/* Десктопная версия */}
      <div className="hidden md:flex md:w-64 md:flex-col md:inset-y-0 border-r bg-white">{SidebarContent}</div>
    </>
  )
}

