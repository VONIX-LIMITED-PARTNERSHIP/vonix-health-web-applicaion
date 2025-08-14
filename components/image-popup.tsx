"use client"

import { useState, useEffect, useCallback } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"

interface ImagePopupProps {
  imageUrl?: string
  altText?: string
  showOnMount?: boolean
  onClose?: () => void
  autoShowDelay?: number
}

export default function ImagePopup({
  imageUrl = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
  altText = "Beautiful Image",
  showOnMount = true,
  onClose,
  autoShowDelay = 500,
}: ImagePopupProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isImageLoaded, setIsImageLoaded] = useState(false)

  useEffect(() => {
    if (showOnMount) {
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, autoShowDelay)
      return () => clearTimeout(timer)
    }
  }, [showOnMount, autoShowDelay])

  const handleClose = useCallback(() => {
    setIsOpen(false)
    onClose?.()
  }, [onClose])

  return (
    <>


      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl w-[90vw] h-[85vh] p-0 bg-transparent border-none shadow-none overflow-hidden">
          {/* Animated backdrop */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-blue-900/30 to-indigo-900/40 backdrop-blur-2xl animate-pulse" 
               style={{ animationDuration: '4s' }} />
          
          {/* Main container */}
          <div className="relative w-full h-full bg-white/5 backdrop-blur-3xl border border-white/10 rounded-3xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] overflow-hidden">
            
            {/* Floating orbs */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0s', animationDuration: '6s' }} />
              <div className="absolute top-3/4 right-1/4 w-40 h-40 bg-gradient-to-r from-blue-500/15 to-cyan-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s', animationDuration: '8s' }} />
              <div className="absolute bottom-1/4 left-1/3 w-24 h-24 bg-gradient-to-r from-violet-500/25 to-purple-500/25 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '4s', animationDuration: '5s' }} />
            </div>



            {/* Image container */}
            <div className="flex items-center justify-center h-full p-8">
              <div className="relative max-w-full max-h-full">
                {/* Loading shimmer */}
                {!isImageLoaded && (
                  <div className="absolute inset-0 rounded-3xl overflow-hidden">
                    <div className="w-full h-96 bg-gradient-to-r from-white/10 via-white/20 to-white/10 animate-pulse rounded-3xl">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                    </div>
                  </div>
                )}
                
                {/* Main image */}
                <div className="relative group">
                  <img
                    src={imageUrl}
                    alt={altText}
                    className={`max-w-full max-h-[75vh] object-contain rounded-3xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] border border-white/10 transition-all duration-1000 ${
                      isImageLoaded 
                        ? 'opacity-100 scale-100 blur-0' 
                        : 'opacity-0 scale-95 blur-sm'
                    }`}
                    onLoad={() => setIsImageLoaded(true)}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop"
                    }}
                  />
                  
                  {/* Image glow effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-pink-500/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10"></div>
                </div>
              </div>
            </div>

            {/* Bottom close button */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
              <Button 
                onClick={handleClose} 
                className="bg-gradient-to-r from-slate-800/80 to-slate-900/80 hover:from-slate-700/90 hover:to-slate-800/90 backdrop-blur-sm text-white px-12 py-4 rounded-2xl shadow-2xl hover:shadow-3xl border border-white/10 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 font-medium text-lg"
              >
                ปิด
              </Button>
            </div>

            {/* Animated gradient border */}
            <div className="absolute inset-0 rounded-3xl pointer-events-none">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-pink-500/20 opacity-50 animate-pulse blur-sm"></div>
            </div>

            {/* Subtle particle effects */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-white/40 rounded-full animate-float"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${i * 0.8}s`,
                    animationDuration: `${4 + Math.random() * 2}s`
                  }}
                />
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }

        .animate-float {
          animation: float 6s infinite ease-in-out;
        }
      `}</style>
    </>
  )
}

// Hook สำหรับจัดการ popup state
export function useImagePopup() {
  const [isVisible, setIsVisible] = useState(false)

  const showPopup = useCallback(() => setIsVisible(true), [])
  const hidePopup = useCallback(() => setIsVisible(false), [])

  return {
    isVisible,
    showPopup,
    hidePopup,
  }
}