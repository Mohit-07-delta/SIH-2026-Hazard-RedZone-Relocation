import { useState, useEffect, useRef, type FC, type ReactNode } from "react";

export interface SequentialTypingItem {
  icon: ReactNode;
  text: string;
}

export interface SequentialTypingListProps {
  items: SequentialTypingItem[];
  charSpeedMs?: number;
  delayBetweenLinesMs?: number;
  iconFadeMs?: number;
  className?: string;
  itemClassName?: string;
  iconContainerClassName?: string;
  textClassName?: string;
}

export const SequentialTypingList: FC<SequentialTypingListProps> = ({
  items,
  charSpeedMs = 28,
  delayBetweenLinesMs = 300,
  iconFadeMs = 180,
  className = "mt-6 lg:mt-8 space-y-4 max-w-lg",
  itemClassName = "flex items-start gap-3 transition-opacity duration-300 opacity-100",
  iconContainerClassName = "mt-0.5 shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/15 transition-all duration-300",
  textClassName = "text-[13px] text-slate-300/90 leading-relaxed",
}) => {
  const [hasStarted, setHasStarted] = useState(false);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [iconReady, setIconReady] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Trigger start on mount or when scrolled into view
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") {
      setHasStarted(true);
      return;
    }

    let isStarted = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isStarted) {
          isStarted = true;
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    // Fallback in case observer doesn't trigger immediately
    const fallbackTimer = setTimeout(() => {
      if (!isStarted) {
        setHasStarted(true);
      }
    }, 400);

    return () => {
      observer.disconnect();
      clearTimeout(fallbackTimer);
    };
  }, []);

  // Sequential typing state machine
  useEffect(() => {
    if (!hasStarted) return;
    if (currentLineIndex >= items.length) return;

    const currentItem = items[currentLineIndex];
    if (!currentItem) return;

    // Step 1: Icon fade-in before typing begins on this line
    if (!iconReady) {
      const timer = setTimeout(() => {
        setIconReady(true);
      }, iconFadeMs);
      return () => clearTimeout(timer);
    }

    // Step 2: Typing characters one by one
    if (charIndex < currentItem.text.length) {
      const timer = setTimeout(() => {
        setCharIndex((prev) => prev + 1);
      }, charSpeedMs);
      return () => clearTimeout(timer);
    }

    // Step 3: Line complete, pause before moving to next line
    const timer = setTimeout(() => {
      setCurrentLineIndex((prev) => prev + 1);
      setCharIndex(0);
      setIconReady(false);
    }, delayBetweenLinesMs);

    return () => clearTimeout(timer);
  }, [
    hasStarted,
    currentLineIndex,
    charIndex,
    iconReady,
    items,
    charSpeedMs,
    delayBetweenLinesMs,
    iconFadeMs,
  ]);

  if (!items || items.length === 0) return null;

  return (
    <div ref={containerRef} className={className}>
      {items.map((item, idx) => {
        if (!hasStarted || idx > currentLineIndex) return null;

        const isPast = idx < currentLineIndex;
        const isCurrent = idx === currentLineIndex;
        const isIconVisible = isPast || (isCurrent && iconReady);
        const displayText = isPast ? item.text : item.text.slice(0, charIndex);
        const isTypingNow = isCurrent && iconReady && charIndex < item.text.length;

        return (
          <div key={idx} className={itemClassName}>
            <span
              className={`${iconContainerClassName} ${
                isIconVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
              }`}
            >
              {item.icon}
            </span>
            <p className={textClassName}>
              {displayText}
              {isTypingNow && (
                <span
                  className="inline-block w-[2px] h-[13px] bg-blue-400 ml-1 translate-y-[2px] animate-pulse"
                  aria-hidden="true"
                />
              )}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default SequentialTypingList;
