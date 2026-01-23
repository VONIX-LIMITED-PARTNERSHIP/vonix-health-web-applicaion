import { cn } from "@/lib/utils"

export function VonixLogo({ className }: { className?: string }) {
    return (
        <div className={cn("flex items-center gap-2", className)}>
            <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-[#1ab394]">
                {/* Simple 4-pointed star/sparkle icon to match the image */}
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white"
                >
                    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                </svg>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                VONIX
            </span>
        </div>
    )
}
