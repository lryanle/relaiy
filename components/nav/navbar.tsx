"use client"

import { SignInModal } from "@/components/auth/sign-in-modal"
import { SignUpModal } from "@/components/auth/sign-up-modal"
import { NewChatModal } from "@/components/chat/new-chat-modal"
import { ThemeToggle } from "@/components/theme-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/context/auth-provider"
import { Bell, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../ui/breadcrumb"
import { Button } from "../ui/button"
import { useToast } from "@/hooks/use-toast"

interface BreadcrumbItem {
  label: string
  href?: string
}

export default function Navbar() {
  const pathname = usePathname()

  const getBreadcrumbs = () => {
    const paths = pathname?.split('/').filter(Boolean)
    const urlParams = new URLSearchParams(window.location.search)
    const id = urlParams.get('id')
    
    if (!paths?.length) {
      const breadcrumbs = [
        { label: "Dashboard", href: "/" }
      ]
      
      if (id) {
        breadcrumbs.push({ label: `#${id}`, href: `/?id=${id}` })
      }
      
      return breadcrumbs
    }

    let breadcrumbs: BreadcrumbItem[] = []
    
    if (paths[0] === 'conversation') {
      breadcrumbs.push({ label: "Dashboard", href: "/" })
    }

    paths.forEach((path, index) => {
      const href = `/${paths.slice(0, index + 1).join('/')}`
      const label = path.charAt(0).toUpperCase() + path.slice(1)
      breadcrumbs.push({ label, href })
    })

    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs()
  const { user, signOut } = useAuth();
  const { toast } = useToast()

  return (
    <nav className="px-3 sm:px-6 flex items-center justify-between bg-white dark:bg-[#0F0F12] border-b border-gray-200 dark:border-[#1F1F23] h-full">
      <div className="font-medium text-sm hidden sm:flex items-center truncate">
        <Breadcrumb>
          <BreadcrumbList className="flex-nowrap whitespace-nowrap">
            {breadcrumbs.map((item, index) => (
              <BreadcrumbItem key={item.href} className="flex-shrink-0">
                {index === breadcrumbs.length - 1 ? (
                  <BreadcrumbPage className="truncate">{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink>
                    <Link href={item.href ?? '/'} className="truncate">{item.label}</Link>
                  </BreadcrumbLink>
                )}
                {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
              </BreadcrumbItem>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 ml-auto sm:ml-0">
        {user && <NewChatModal />}
        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            toast({
              title: "Notifications",
              description: "Check the left sidebar :)",
            })
          }}
          className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-[#1F1F23] rounded-full transition-colors"
        >
          <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 dark:text-gray-300" />
        </Button>

        <ThemeToggle />

        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <Avatar>
                <AvatarImage src={user.image ?? undefined} />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              sideOffset={8}
              className="w-[280px] sm:w-80 bg-background border-border rounded-lg shadow-lg"
            >
              <DropdownMenuItem>
                <div className="flex flex-col space-y-1">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => signOut()}>
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-2">
            <SignInModal />
            <SignUpModal />
          </div>
        )}
      </div>
    </nav>
  )
}

