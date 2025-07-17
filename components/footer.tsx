import Link from "next/link"
import { Mail, MapPin } from "lucide-react"
import { FaFacebookF, FaLinkedinIn, FaInstagram, FaXTwitter, FaLine } from "react-icons/fa6"
import { useTranslation } from "@/hooks/use-translation"

export function Footer() {
  const currentYear = new Date().getFullYear()
  const { t } = useTranslation()

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">V</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">VONIX</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
              {t("discribe_vonix")}
            </p>  
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <p className="font-semibold mb-1">VONIX LIMITED PARTNERSHIP</p>
              <p>ห้างหุ้นส่วนจำกัด วอนิกซ์</p>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              {t("contact_us")}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-gray-400" />
                <a href="mailto:vonix.th@gmail.com" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  vonix.th@gmail.com
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-400 text-sm">Thailand</span>
              </li>
            </ul>

            {/* Social Icons */}
            <div className="mt-6 bg-gray-700 px-4 py-3 rounded-lg flex space-x-5 justify-center md:justify-start">
              <a
                href="https://www.facebook.com/share/1A7JtFPPuh/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-white hover:text-blue-300"
              >
                <FaFacebookF size={20} />
              </a>
              <a
                href="https://www.linkedin.com/company/vonix-co-ltd/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-white hover:text-blue-300"
              >
                <FaLinkedinIn size={20} />
              </a>
              <a
                href="https://x.com/vonixth?s=21&t=AS59LsinHEdhLf6yXgERRA"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                className="text-white hover:text-blue-300"
              >
                <FaXTwitter size={20} />
              </a>
              <a
                href="https://www.instagram.com/vonixlimited?igsh=M2U0ZnNrcjF6NXVr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-white hover:text-blue-300"
              >
                <FaInstagram size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-500 dark:text-gray-400 text-center md:text-left">
              <p>© {currentYear} VONIX LIMITED PARTNERSHIP. All Rights Reserved.</p>
              <p className="mt-1">This system is for preliminary assessment only, not a medical diagnosis.</p>
            </div>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacy-policy" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Terms of Use
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
