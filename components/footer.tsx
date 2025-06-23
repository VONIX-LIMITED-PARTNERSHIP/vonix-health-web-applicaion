import Link from "next/link"
import { Mail, MapPin } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation" // Import useTranslation

export function Footer() {
  const currentYear = new Date().getFullYear()
  const { t } = useTranslation() // Use translation hook

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
            <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md">{t("ai_powered_description")}</p>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <p className="font-semibold mb-1">VONIX LIMITED PARTNERSHIP</p>
              <p>ห้างหุ้นส่วนจำกัด วอนิกซ์</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              {t("main_menu")}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {t("home")}
                </Link>
              </li>
              <li></li>
              <li></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              {t("contact_us")}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-gray-400" />
                <a
                  href="mailto:vonix.th@gmail.com"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  vonix.th@gmail.com
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-400 text-sm">{t("thailand")}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-500 dark:text-gray-400 text-center md:text-left">
              <p>
                © {currentYear} VONIX LIMITED PARTNERSHIP. {t("all_rights_reserved")}.
              </p>
              <p className="mt-1">{t("preliminary_assessment_only")}</p>
            </div>
            <div className="flex space-x-6 text-sm">
              <Link
                href="/privacy-policy"
                className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {t("privacy_policy")}
              </Link>
              <Link
                href="/terms"
                className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {t("terms_of_use")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
