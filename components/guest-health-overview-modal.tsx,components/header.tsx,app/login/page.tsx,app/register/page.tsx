"use client"

\`\`\`tsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useLanguage } from "@/contexts/language-context"

interface GuestHealthOverviewModalProps {
  children: React.ReactNode
}

const GuestHealthOverviewModal: React.FC<GuestHealthOverviewModalProps> = ({ children }) => {
  const { locale } = useLanguage()

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {locale === "en" ? "Guest Health Overview" : "Aperçu de la santé des invités"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {locale === "en"
              ? "As a guest, you have limited access to health overview features. To unlock full access, please create an account."
              : "En tant qu'invité, vous avez un accès limité aux fonctionnalités d'aperçu de la santé. Pour déverrouiller l'accès complet, veuillez créer un compte."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{locale === "en" ? "Cancel" : "Annuler"}</AlertDialogCancel>
          <AlertDialogAction>{locale === "en" ? "Continue" : "Continuer"}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default GuestHealthOverviewModal
\`\`\`

\`\`\`tsx
// components/header.tsx
import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  isLoggedIn: boolean
  user?: any // Replace 'any' with the actual type of your user object
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn, user }) => {
  return (
    <header className="bg-gray-100 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          Health App
        </Link>
        <nav>
          {isLoggedIn || user ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Button variant="outline">Logout</Button>
            </>
          ) : (
            <>
              {/* <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/register">
                <Button variant="outline">Register</Button>
              </Link> */}
              <Link href="/guest-login">
                <Button>Guest Mode</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header;
\`\`\`

\`\`\`tsx
// app/login/page.tsx
import { redirect } from "next/navigation"

export default function LoginPage() {
  redirect("/guest-login")
  return (
    <div>
      {/* This page now always redirects */}
    </div>
  );
}
\`\`\`

\`\`\`tsx
// app/register/page.tsx
import { redirect } from "next/navigation"

export default function RegisterPage() {
  redirect("/guest-login")
  return (
    <div>
      {/* This page now always redirects */}
    </div>
  );
}
\`\`\`
