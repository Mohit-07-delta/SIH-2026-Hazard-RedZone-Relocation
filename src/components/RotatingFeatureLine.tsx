import { useState, useEffect, type FC, type ReactNode } from "react";

export interface RotatingFeatureItem {
  icon: ReactNode;
  text: string;
}

export interface RotatingFeatureLineProps {
  items: RotatingFeatureItem[];
  typeSpeedMs?: number;
  eraseSpeedMs?: number;
  pauseMs?: number;
  switchDelayMs?: number;
  className?: string;
  iconContainerClassName?: string;
  textClassName?: string;
}

type Phase = "typing" | "pausing" | "erasing" | "switching";

export const RotatingFeatureLine: FC<RotatingFeatureLineProps> = ({
  items,
  typeSpeedMs = 22,
  eraseSpeedMs = 8,
  pauseMs = 1000,
  switchDelayMs = 150,
  className = "mt-6 lg:mt-8 max-w-lg min-h-[56px] sm:min-h-[48px] flex items-start gap-3",
  iconContainerClassName = "mt-0.5 shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/15 transition-all duration-300",
  textClassName = "text-[13px] text-slate-300/90 leading-relaxed min-h-[2.5em] flex-1",
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("typing");

  useEffect(() => {
    if (!items || items.length === 0) return;

    const currentItem = items[currentIndex];
    if (!currentItem) return;

    let timer: ReturnType<typeof setTimeout>;

    switch (phase) {
      case "typing": {
        if (charIndex < currentItem.text.length) {
          timer = setTimeout(() => {
            setCharIndex((prev) => prev + 1);
          }, typeSpeedMs);
        } else {
          // Finished typing, pause to read
          setPhase("pausing");
        }
        break;
      }

      case "pausing": {
        timer = setTimeout(() => {
          setPhase("erasing");
        }, pauseMs);
        break;
      }

      case "erasing": {
        if (charIndex > 0) {
          timer = setTimeout(() => {
            setCharIndex((prev) => prev - 1);
          }, eraseSpeedMs);
        } else {
          // Finished erasing, prepare next item
          setPhase("switching");
        }
        break;
      }

      case "switching": {
        timer = setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % items.length);
          setPhase("typing");
        }, switchDelayMs);
        break;
      }
    }

    return () => clearTimeout(timer);
  }, [
    items,
    currentIndex,
    charIndex,
    phase,
    typeSpeedMs,
    eraseSpeedMs,
    pauseMs,
    switchDelayMs,
  ]);

  if (!items || items.length === 0) return null;

  const currentItem = items[currentIndex];
  const isIconVisible = phase !== "switching";
  const displayText = currentItem.text.slice(0, charIndex);

  return (
    <div className={className}>
      <span
        className={`${iconContainerClassName} ${
          isIconVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
        }`}
      >
        {currentItem.icon}
      </span>
      <p className={textClassName}>
        {displayText}
        {phase !== "switching" && (
          <span
            className="inline-block w-[2px] h-[13px] bg-blue-400 ml-1 translate-y-[2px] animate-pulse"
            aria-hidden="true"
          />
        )}
      </p>
    </div>
  );
};

export default RotatingFeatureLine;
