import Link from "next/link"
import { Mail, MapPin } from "lucide-react"
import { FaFacebookF, FaLinkedinIn, FaInstagram, FaTwitter } from "react-icons/fa6"
import { useTranslation } from "@/hooks/use-translation"
import { VonixLogo } from "@/components/vonix-logo"

export function Footer() {
  const currentYear = new Date().getFullYear()
  const { t } = useTranslation()

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="col-span-1">
            <VonixLogo className="mb-6" />
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6">
              ระบบประเมินสุขภาพออนไลน์ ที่ช่วยให้คุณสุขภาพได้ดียิ่งขึ้น 10 เท่า เข้าถึงได้ที่ พร้อมให้คำแนะนำจากแพทย์ผู้เชี่ยวชาญ และ เทคโนโลยี AI ที่ทันสมัย
            </p>
          </div>

          {/* Services Column */}
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-6">บริการ</h3>
            <ul className="space-y-4">
              <li>
                <Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 text-sm transition-colors">
                  AI Health Check
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 text-sm transition-colors">
                  Telemedicine
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 text-sm transition-colors">
                  สำหรับองค์กร
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 text-sm transition-colors">
                  ตรวจสอบสิทธิ์
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-6">ติดต่อเรา</h3>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3 text-gray-600 dark:text-gray-400 text-sm">
                <Mail className="w-4 h-4" />
                <a href="mailto:contact@vonix.health" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  contact@vonix.health
                </a>
              </li>
              <li className="flex items-center space-x-3 text-gray-600 dark:text-gray-400 text-sm">
                <MapPin className="w-4 h-4" />
                <span>Bangkok, Thailand</span>
              </li>
            </ul>
          </div>

          {/* Follow Us Column */}
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-6">ติดตามเรา</h3>
            <div className="flex space-x-4">
              <SocialIcon href="#" icon={<FaTwitter size={16} />} label="Twitter" />
              <SocialIcon href="#" icon={<FaLinkedinIn size={16} />} label="LinkedIn" />
              <SocialIcon href="#" icon={<FaInstagram size={16} />} label="Instagram" />
              <SocialIcon href="#" icon={<FaTwitter size={16} />} label="Twitter" />
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 dark:text-gray-400 text-xs">
            © {currentYear} VONIX Co., Ltd. All Rights Reserved.
          </p>

          <p className="text-gray-400 dark:text-gray-500 text-[10px] md:text-center flex-1 px-4">
            This system is for preliminary assessment only, not a medical diagnosis.
          </p>

          <div className="flex space-x-6">
            <Link href="/privacy-policy" className="text-gray-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 text-xs transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 text-xs transition-colors">
              Terms of Use
            </Link>
            <Link href="#" className="text-gray-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 text-xs transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

function SocialIcon({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <a
      href={href}
      aria-label={label}
      className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 flex items-center justify-center hover:bg-teal-600 hover:text-white dark:hover:bg-teal-600 dark:hover:text-white transition-all duration-300"
    >
      {icon}
    </a>
  )
}
