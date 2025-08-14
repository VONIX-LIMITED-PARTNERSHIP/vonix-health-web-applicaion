"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function ReferencesPage() {
  const references = [
    {
      title: "PHQ-2 & PHQ-9",
      items: [
        {
          name: "National HIV Curriculum",
          url: "https://www-hiv-uw-edu.translate.goog/page/mental-health-screening/phq-2?_x_tr_sl=en&_x_tr_tl=th&_x_tr_hl=th&_x_tr_pto=tc",
        },
        {
          name: "กรมสุขภาพจิต",
          url: "https://dmh.go.th/test/download/files/2Q%209Q%208Q%20(1).pdf",
        },
      ],
    },
    {
      title: "Thai CV Risk Score",
      items: [
        {
          name: "งานโรคหัวใจ โรงพยาบาลราชวิถี",
          url: "https://www.rajavithi.go.th/rj/wp-content/uploads/2018/02/7score.pdf",
        },
      ],
    },
    {
      title: "GPAQ",
      items: [
        {
          name: "WHO - Department of Chronic Diseases and Health Promotion",
          url: "http://tpak.or.th/uploadsCK/GPAQ%20Instrument%20and%20Analysis%20Guide%20v2_1711369392.pdf",
        },
        {
          name: "อบต.ป่ากลาง",
          url: "https://www.paklang.go.th/%E0%B8%AA%E0%B8%A3%E0%B8%B8%E0%B8%9B%E0%B8%9C%E0%B8%A5%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B9%80%E0%B8%A1%E0%B8%B4%E0%B8%99%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1%E0%B8%9E%E0%B8%B6%E0%B8%87%E0%B8%9E%E0%B8%AD/",
        },
        {
          name: "BMC Public Health",
          url: "https://bmcpublichealth-biomedcentral-com.translate.goog/articles/10.1186/1471-2458-14-1255?_x_tr_sl=en&_x_tr_tl=th&_x_tr_hl=th&_x_tr_pto=tc",
        },
        {
          name: "ChatGPT",
          url: "https://chatgpt.com/share/68973cec-716c-8005-ae28-65d97dc6f874",
        },
      ],
    },
    {
      title: "AUDIT",
      items: [
        {
          name: "Drinkaware",
          url: "https://www-drinkaware-co-uk.translate.goog/facts/information-about-alcohol/alcohol-and-the-facts/understanding-the-alcohol-use-disorders-identification-test?_x_tr_sl=en&_x_tr_tl=th&_x_tr_hl=th&_x_tr_pto=tc",
        },
        {
          name: "AUDIT (Thai PDF)",
          url: "https://auditscreen.org/cmsb/uploads/audit-thai.pdf",
        },
      ],
    },
    {
      title: "ESS",
      items: [
        {
          name: "Cleveland Clinic",
          url: "https://my-clevelandclinic-org.translate.goog/health/diagnostics/epworth-sleepiness-scale-ess?_x_tr_sl=en&_x_tr_tl=th&_x_tr_hl=th&_x_tr_pto=tc",
        },
        {
          name: "ESS Official",
          url: "https://epworthsleepinessscale-com.translate.goog/about-the-ess/?_x_tr_sl=en&_x_tr_tl=th&_x_tr_hl=th&_x_tr_pto=tc",
        },
      ],
    },
    {
      title: "DAST-10",
      items: [
        {
          name: "Valley Spring Recovery Center",
          url: "https://valleyspringrecovery-com.translate.goog/addiction/screening/dast/?_x_tr_sl=en&_x_tr_tl=th&_x_tr_hl=th&_x_tr_pto=tc",
        },
        {
          name: "คลินิกสุขภาพจิตหมอวิวัฒน์",
          url: "https://www.doctorwiwat.com/test/DAST-10.html",
        },
      ],
    },
    {
      title: "GAD-2 & GAD-7",
      items: [
        {
          name: "National HIV Curriculum",
          url: "https://www-hiv-uw-edu.translate.goog/page/mental-health-screening/gad-7?_x_tr_sl=en&_x_tr_tl=th&_x_tr_hl=th&_x_tr_pto=tc",
        },
        {
          name: "Medscape",
          url: "https://reference-medscape-com.translate.goog/calculator/570/generalized-anxiety-disorder-2-gad-2?_x_tr_sl=en&_x_tr_tl=th&_x_tr_hl=th&_x_tr_pto=tc",
        },
        {
          name: "National Library of Medicine",
          url: "https://pmc-ncbi-nlm-nih-gov.translate.goog/articles/PMC7306644/?_x_tr_sl=en&_x_tr_tl=th&_x_tr_hl=th&_x_tr_pto=tc",
        },
        {
          name: "Healthify",
          url: "https://healthify-nz.translate.goog/tools/g/general-anxiety-scale-gad-7?_x_tr_sl=en&_x_tr_tl=th&_x_tr_hl=th&_x_tr_pto=wa",
        },
      ],
    },
    {
      title: "PC-PTSD-5",
      items: [
        {
          name: "National HIV Curriculum",
          url: "https://www-hiv-uw-edu.translate.goog/page/mental-health-screening/pc-ptsd?_x_tr_sl=en&_x_tr_tl=th&_x_tr_hl=th&_x_tr_pto=tc",
        },
        {
          name: "National Center for PTSD",
          url: "https://www.ptsd.va.gov/professional/assessment/documents/pc-ptsd5-screen.pdf",
        },
      ],
    },
  ];

    return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h1
            className="text-5xl font-extrabold mb-14 text-center bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            📚 แหล่งอ้างอิง
          </motion.h1>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {references.map((ref, idx) => (
              <motion.div
                key={ref.title}
                className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-3xl shadow-lg border border-white/20 p-6 hover:scale-[1.02] transition-transform duration-300"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.5 }}
              >
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">{ref.title}</h2>
                <ul className="space-y-3">
                  {ref.items.map((item) => (
                    <li key={item.url}>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline group"
                      >
                        <span>{item.name}</span>
                        <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
