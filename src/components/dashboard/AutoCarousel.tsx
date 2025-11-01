import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface AutoCarouselProps {
  children: React.ReactNode[];
  intervalMs?: number;
}

export const AutoCarousel = ({ children, intervalMs = 5000 }: AutoCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % children.length);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [children.length, intervalMs]);

  return (
    <div className="relative h-full">
      <div className="absolute inset-0 flex items-center justify-center">
        {children[currentIndex]}
      </div>
      
      {/* Indicators */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
        {children.map((_, index) => (
          <div
            key={index}
            className={`h-1 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "w-6 bg-primary"
                : "w-1.5 bg-muted-foreground/30"
            }`}
          />
        ))}
      </div>

      {/* Navigation hints */}
      <div className="absolute left-2 top-1/2 -translate-y-1/2">
        <ChevronLeft className="w-4 h-4 text-muted-foreground/30" />
      </div>
      <div className="absolute right-2 top-1/2 -translate-y-1/2">
        <ChevronRight className="w-4 h-4 text-muted-foreground/30" />
      </div>
    </div>
  );
};
