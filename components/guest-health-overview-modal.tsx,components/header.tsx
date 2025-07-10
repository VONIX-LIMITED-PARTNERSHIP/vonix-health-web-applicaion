"use client"

\`\`\`typescript
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react"
import { useLanguage } from "@/contexts/language-context" // Updated import

interface GuestHealthOverviewModalProps {
  isOpen: boolean
  onClose: () => void
}

const GuestHealthOverviewModal: React.FC<GuestHealthOverviewModalProps> = ({ isOpen, onClose }) => {
  const { locale } = useLanguage() // Updated usage

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {locale === "th" ? "ภาพรวมสุขภาพสำหรับผู้ใช้งานทั่วไป" : "Guest Health Overview"}
            </ModalHeader>
            <ModalBody>
              <p>
                {locale === "th"
                  ? "คุณสามารถทดลองใช้งานระบบเพื่อดูภาพรวมสุขภาพได้"
                  : "You can try the system to view a health overview."}
              </p>
              <p>
                {locale === "th"
                  ? "ข้อมูลที่แสดงเป็นข้อมูลจำลองเท่านั้น"
                  : "The data displayed is for demonstration purposes only."}
              </p>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                {locale === "th" ? "ปิด" : "Close"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default GuestHealthOverviewModal
\`\`\`

\`\`\`typescript
// components/header.tsx
import type React from "react"
import Link from "next/link"
import { Button } from "@nextui-org/react"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"

const Header: React.FC = () => {
  const { isLoggedIn, logout } = useAuth()
  const { locale, setLocale } = useLanguage()

  return (
    <header className="bg-white shadow-md py-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          Health App
        </Link>

        <nav>
          <ul className="flex items-center space-x-4">
            <li>
              <Link href="/about">About</Link>
            </li>
            {isLoggedIn ? (
              <>
                <li>
                  <Link href="/profile">Profile</Link>
                </li>
                <li>
                  <Button color="primary" onClick={logout}>
                    Logout
                  </Button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href="/guest-login">
                    <Button color="secondary">{locale === "th" ? "ทดลองใช้งาน" : "Try Now"}</Button>
                  </Link>
                </li>
              </>
            )}
            <li>
              <select value={locale} onChange={(e) => setLocale(e.target.value)} className="border rounded p-1">
                <option value="en">English</option>
                <option value="th">ไทย</option>
              </select>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header;
\`\`\`
