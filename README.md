# VONIX Health Dashboard

This is a health assessment and management platform built with Next.js, React, Tailwind CSS, and Supabase. It features AI-powered health analysis and a chatbot.

## Features

-   **User Authentication:** Secure sign-up, sign-in, and profile management using Supabase Auth.
-   **Health Assessments:** Comprehensive assessments across various categories (Basic, Heart, Nutrition, Mental, Physical, Sleep).
-   **AI-Powered Analysis:** Utilizes OpenAI for analyzing assessment results and providing personalized recommendations.
-   **Interactive Chatbot:** An AI assistant to answer health-related questions and provide app support.
-   **Health Dashboard:** Overview of user's health score, risk factors, and assessment progress.
-   **Responsive Design:** Optimized for various screen sizes using Tailwind CSS and Shadcn UI components.
-   **Internationalization:** Supports multiple languages (Thai and English).
-   **Data Management:** Secure data storage and retrieval with Supabase.

## Technologies Used

-   **Framework:** Next.js (App Router)
-   **UI Library:** React
-   **Styling:** Tailwind CSS, Shadcn UI
-   **Database & Auth:** Supabase
-   **AI:** OpenAI (via Vercel AI SDK)
-   **Language:** TypeScript

## Getting Started

1.  **Clone the repository:**
    \`\`\`bash
    git clone <repository-url>
    cd vonix-health-dashboard
    \`\`\`
2.  **Install dependencies:**
    \`\`\`bash
    npm install
    # or
    yarn install
    \`\`\`
3.  **Set up Supabase:**
    -   Create a new Supabase project.
    -   Configure environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`).
    -   Run the SQL scripts in the `scripts/` directory to set up your database schema and RLS policies.
4.  **Set up OpenAI:**
    -   Obtain an OpenAI API key.
    -   Set the `OPENAI_API_KEY` environment variable.
5.  **Run the development server:**
    \`\`\`bash
    npm run dev
    # or
    yarn dev
    \`\`\`
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

\`\`\`
.
├── app/                      # Next.js App Router routes and pages
│   ├── api/                  # API routes (e.g., for AI analysis, profile updates)
│   ├── assessment/[category]/# Dynamic routes for assessment forms and results
│   ├── auth/                 # Authentication related pages (login, register, etc.)
│   ├── (auth)/               # Grouped auth routes
│   ├── forgot-password/
│   ├── guest-assessment/     # Guest assessment pages
│   ├── login/
│   ├── profile/              # User profile page
│   ├── register/
│   ├── update-password/
│   ├── globals.css           # Global CSS styles (Tailwind, Shadcn)
│   ├── layout.tsx            # Root layout for the application
│   ├── loading.tsx           # Global loading UI
│   └── page.tsx              # Homepage
├── components/               # Reusable React components
│   ├── assessment/           # Components specific to assessments (form, question card, results)
│   ├── chatbot/              # Chatbot widget
│   ├── ui/                   # Shadcn UI components (extended or custom)
│   ├── header.tsx            # Application header
│   ├── footer.tsx            # Application footer
│   └── ...                   # Other general components
├── contexts/                 # React Contexts for global state (e.g., LanguageContext)
├── data/                     # Static data (e.g., assessment questions, chatbot knowledge base)
├── docs/                     # Documentation (e.g., database schema, system overview)
├── hooks/                    # Custom React hooks (e.g., useAuth, useTranslation)
├── lib/                      # Utility functions and services (e.g., Supabase client, AssessmentService)
├── locales/                  # Internationalization files (en.ts, th.ts)
├── public/                   # Static assets (images, fonts)
├── scripts/                  # SQL scripts for database setup and migrations
├── styles/                   # Additional global styles (e.g., main-colors.css)
├── types/                    # TypeScript type definitions
├── utils/                    # General utility functions (e.g., risk level calculations, validation)
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── ...                       # Other configuration files (package.json, next.config.mjs, etc.)
\`\`\`

## ฟังก์ชันหลัก (Core Functionalities)

### 1. **ระบบยืนยันตัวตน (Authentication)**
-   **ไฟล์ที่เกี่ยวข้อง:** `app/login/page.tsx`, `app/register/page.tsx`, `app/forgot-password/page.tsx`, `app/update-password/page.tsx`, `hooks/use-auth.tsx`, `lib/supabase.ts`, `app/api/auth/*`
-   **การทำงาน:** ผู้ใช้สามารถลงทะเบียน, เข้าสู่ระบบ, กู้คืนรหัสผ่าน, และอัปเดตรหัสผ่านได้อย่างปลอดภัย โดยใช้ Supabase Auth เป็น Backend as a Service (BaaS) มีการจัดการสถานะการเข้าสู่ระบบและข้อมูลโปรไฟล์ผู้ใช้ผ่าน `useAuth` hook

### 2. **ระบบแบบประเมินสุขภาพ (Health Assessment)**
-   **ไฟล์ที่เกี่ยวข้อง:** `app/assessment/[category]/page.tsx`, `components/assessment/assessment-form.tsx`, `components/assessment/question-card.tsx`, `data/assessment-questions.ts`, `lib/assessment-service.ts`, `types/assessment.ts`, `app/api/assessment/analyze/route.ts`
-   **การทำงาน:**
    -   **หมวดหมู่แบบประเมิน:** แบ่งเป็น 6 หมวดหลัก (ข้อมูลพื้นฐาน, หัวใจ, โภชนาการ, จิตใจ, ร่างกาย, การนอน) และมีแบบประเมินสำหรับแขก (Guest Assessment)
    -   **การแสดงคำถาม:** `AssessmentForm` จัดการการแสดงคำถามทีละข้อ โดยใช้ `QuestionCard` ในการเรนเดอร์ประเภทคำถามที่แตกต่างกัน (multiple-choice, rating, yes-no, checkbox, number, text, multi-select-combobox-with-other)
    -   **การบันทึกผล:** เมื่อทำแบบประเมินเสร็จสิ้น ข้อมูลจะถูกบันทึกลง Supabase ผ่าน `AssessmentService`
    -   **การวิเคราะห์ AI:** สำหรับแบบประเมินที่ไม่ใช่ข้อมูลพื้นฐาน จะมีการส่งข้อมูลไปให้ AI (OpenAI) วิเคราะห์เพื่อหาปัจจัยเสี่ยงและคำแนะนำส่วนบุคคล

### 3. **แดชบอร์ดสุขภาพ (Health Dashboard)**
-   **ไฟล์ที่เกี่ยวข้อง:** `app/page.tsx`, `lib/assessment-service.ts`, `utils/risk-level.ts`
-   **การทำงาน:** แสดงภาพรวมสุขภาพของผู้ใช้ เช่น คะแนนสุขภาพรวม, จำนวนปัจจัยเสี่ยง, และจำนวนแบบประเมินที่ทำเสร็จแล้ว ข้อมูลเหล่านี้ดึงมาจากผลการประเมินล่าสุดของผู้ใช้

### 4. **Chatbot AI**
-   **ไฟล์ที่เกี่ยวข้อง:** `components/chatbot/chat-widget.tsx`, `app/api/chat/route.ts`, `data/chatbot-app-knowledge.ts`
-   **การทำงาน:** ผู้ช่วย AI ที่สามารถตอบคำถามเกี่ยวกับสุขภาพทั่วไป และคำถามเกี่ยวกับการใช้งานแอปพลิเคชัน VONIX โดยใช้ OpenAI API ในการประมวลผลภาษาธรรมชาติ และมีฐานข้อมูลความรู้เฉพาะของแอปเพื่อตอบคำถามที่เกี่ยวข้อง

### 5. **การจัดการข้อมูล (Data Management)**
-   **ไฟล์ที่เกี่ยวข้อง:** `lib/supabase.ts`, `lib/supabase-server.ts`, `scripts/*.sql`, `types/database.ts`
-   **การทำงาน:** ใช้ Supabase เป็นฐานข้อมูลหลัก มีการตั้งค่า Row Level Security (RLS) เพื่อความปลอดภัยของข้อมูลผู้ใช้ และมี SQL scripts สำหรับการสร้าง schema และจัดการฐานข้อมูล

### 6. **การรองรับหลายภาษา (Internationalization - i18n)**
-   **ไฟล์ที่เกี่ยวข้อง:** `locales/en.ts`, `locales/th.ts`, `hooks/use-translation.ts`, `app/language-provider-client.tsx`
-   **การทำงาน:** รองรับการแสดงผลทั้งภาษาไทยและภาษาอังกฤษ ผู้ใช้สามารถสลับภาษาได้

### 7. **ส่วนประกอบ UI และการออกแบบ (UI Components & Design)**
-   **ไฟล์ที่เกี่ยวข้อง:** `components/ui/*`, `app/globals.css`, `tailwind.config.ts`, `components.json`, `components/theme-provider.tsx`
-   **การทำงาน:** ใช้ Shadcn UI components และ Tailwind CSS ในการสร้าง UI ที่สวยงามและ responsive รองรับทั้ง Light Mode และ Dark Mode

นี่คือภาพรวมของโปรเจกต์ VONIX Health Dashboard ครับ หากมีส่วนไหนที่ต้องการรายละเอียดเพิ่มเติม สามารถสอบถามได้เลยครับ!
