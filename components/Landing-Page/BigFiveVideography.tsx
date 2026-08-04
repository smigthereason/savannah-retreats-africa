"use client";

import { useState, useEffect, useRef, useCallback, TouchEvent, KeyboardEvent } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { bigFive } from "@/lib/big-five-data";

const SLIDE_DURATION_MS = 6000;

export default function BigFiveVideography() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [loadedVideos, setLoadedVideos] = useState<boolean[]>(() => bigFive.map(() => false));
  const [failedVideos, setFailedVideos] = useState<boolean[]>(() => bigFive.map(() => false));

  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const sectionRef = useRef<HTMLElement | null>(null);

  // Touch gesture state
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const minSwipeDistance = 50;

  const goTo = useCallback((index: number) => {
    setCurrentIndex(((index % bigFive.length) + bigFive.length) % bigFive.length);
  }, []);

  const handleNext = useCallback(() => goTo(currentIndex + 1), [currentIndex, goTo]);
  const handlePrev = useCallback(() => goTo(currentIndex - 1), [currentIndex, goTo]);

  // Auto-advance timer
  useEffect(() => {
    if (!isAutoplay) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bigFive.length);
    }, SLIDE_DURATION_MS);
    return () => clearInterval(timer);
  }, [isAutoplay, currentIndex]);

  // Play only the active video, restart it, pause the rest
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;

      if (index === currentIndex) {
        video.currentTime = 0;
        video.play().catch(() => {
          video.muted = true;
          video.play().catch(() => {});
        });
      } else {
        video.pause();
      }
    });
  }, [currentIndex]);

  // Keyboard navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === "ArrowRight") handleNext();
    if (e.key === "ArrowLeft") handlePrev();
    if (e.key === " ") {
      e.preventDefault();
      setIsAutoplay((prev) => !prev);
    }
  };

  // Touch swipe handlers
  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;

    const distance = touchStartX.current - touchEndX.current;
    if (distance > minSwipeDistance) handleNext();
    else if (distance < -minSwipeDistance) handlePrev();

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const active = bigFive[currentIndex];

  return (
    <section
      ref={sectionRef}
      /*
        Aspect ratio is now orientation-aware, not just width-aware.
        Problem this fixes: iPad Pro portrait is 1024px wide — the same
        as the `lg` breakpoint used by laptops/desktops in landscape.
        Without orientation checks, a tall portrait tablet was getting
        the same ultra-wide 21/9 ratio meant for wide landscape screens.
        `portrait:`/`landscape:` variants disambiguate by orientation,
        not just width, so tall tablets get a tall frame regardless of
        which width bucket their portrait mode happens to land in.
      */
      className="relative w-full aspect-[4/5] landscape:aspect-[16/9] sm:portrait:aspect-[3/4] md:portrait:aspect-[3/4] lg:portrait:aspect-[3/4] lg:landscape:aspect-[16/9] xl:landscape:aspect-[21/9] max-h-[100dvh] min-h-[420px] overflow-hidden bg-umber select-none focus:outline-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="The Big Five, in motion"
    >
      {/* Background video layers */}
      {bigFive.map((animal, index) => {
        const isActive = index === currentIndex;
        const hasFailed = failedVideos[index];

        return (
          <div
            key={animal.name}
            className={`absolute inset-0 h-full w-full overflow-hidden transition-opacity duration-1000 ease-in-out ${
              isActive ? "z-10 opacity-100" : "z-0 opacity-0 pointer-events-none"
            }`}
            aria-hidden={!isActive}
          >
            {hasFailed ? (
              <div className="absolute inset-0 h-full w-full bg-umber" />
            ) : (
              <video
                ref={(el) => {
                  videoRefs.current[index] = el;
                }}
                muted
                loop
                playsInline
                preload={index === 0 ? "auto" : "metadata"}
                onCanPlay={() =>
                  setLoadedVideos((prev) => {
                    if (prev[index]) return prev;
                    const next = [...prev];
                    next[index] = true;
                    return next;
                  })
                }
                onError={() =>
                  setFailedVideos((prev) => {
                    if (prev[index]) return prev;
                    const next = [...prev];
                    next[index] = true;
                    return next;
                  })
                }
                className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 ${
                  loadedVideos[index] ? "opacity-100" : "opacity-0"
                }`}
              >
                <source src={animal.videoSrc} type="video/mp4" />
              </video>
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-umber/95 via-umber/50 to-umber/30" />
          </div>
        );
      })}

      {/* Content overlay */}
      <div className="relative z-20 flex h-full flex-col justify-between p-4 sm:p-8 md:p-12 lg:p-16 max-w-7xl mx-auto pointer-events-none">
        {/* Top Header */}
        <div className="pt-4 sm:pt-8 pointer-events-auto">
          <span className="eyebrow !text-ochre text-xs sm:text-sm">Videography</span>
          <h2 className="mt-1 sm:mt-2 max-w-xl font-display text-2xl xs:text-3xl sm:text-5xl md:text-6xl text-linen drop-shadow-md leading-tight">
            The Big Five, Up Close
          </h2>
        </div>

        {/* Animal detail card */}
        <div className="mb-4 sm:mb-8 md:mb-12 max-w-2xl pointer-events-auto" aria-live="polite">
          <div className="flex flex-wrap items-baseline gap-x-2 sm:gap-x-3 gap-y-1">
            <span className="text-[10px] sm:text-xs uppercase tracking-widest text-ochre font-semibold">
              {currentIndex + 1} / {bigFive.length}
            </span>
            <span className="text-[10px] sm:text-xs uppercase tracking-widest text-linen/70">
              {active.whereToSpot}
            </span>
            <span className="text-[10px] sm:text-xs uppercase tracking-widest text-linen/70">
              · Best seen: {active.bestTime}
            </span>
          </div>

          <h3 className="mt-1 sm:mt-2 font-display text-2xl sm:text-4xl md:text-5xl text-linen">
            {active.name}
          </h3>
          <p className="text-xs sm:text-sm italic text-linen/60 mt-0.5">{active.latin}</p>

          <p className="mt-2 sm:mt-3 text-xs sm:text-sm md:text-base leading-relaxed text-linen/90 drop-shadow line-clamp-4 sm:line-clamp-none">
            {active.fact}
          </p>
        </div>

        {/* Navigation & progress */}
        <div className="relative z-30 flex flex-col sm:flex-row items-stretch sm:items-center justify-between border-t border-linen/20 pt-4 sm:pt-6 gap-4 sm:gap-0 pointer-events-auto">
          {/* Progress Bars */}
          <div className="flex items-center gap-1.5 sm:gap-3 w-full sm:w-auto">
            {bigFive.map((animal, index) => (
              <button
                key={animal.name}
                type="button"
                onClick={() => goTo(index)}
                aria-label={`Go to ${animal.name}`}
                aria-current={index === currentIndex}
                className="group relative h-1.5 flex-1 sm:flex-none sm:w-12 md:w-16 overflow-hidden rounded-full bg-linen/30"
              >
                <div
                  key={`${index}-${currentIndex}-${isAutoplay}`}
                  className={`h-full bg-ochre ${
                    index === currentIndex
                      ? isAutoplay
                        ? "w-full transition-[width] ease-linear"
                        : "w-full"
                      : index < currentIndex
                      ? "w-full"
                      : "w-0"
                  }`}
                  style={
                    index === currentIndex && isAutoplay
                      ? { transitionDuration: `${SLIDE_DURATION_MS}ms` }
                      : undefined
                  }
                />
              </button>
            ))}
          </div>

          {/* Action Controls */}
          <div className="flex items-center justify-end gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setIsAutoplay((prev) => !prev)}
              aria-label={isAutoplay ? "Pause slideshow" : "Play slideshow"}
              className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-linen/30 bg-umber/40 text-linen backdrop-blur-md transition-colors hover:border-ochre hover:bg-ochre"
            >
              {isAutoplay ? <Pause className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <Play className="ml-0.5 h-3.5 w-3.5 sm:h-4 sm:w-4" />}
            </button>

            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous animal"
              className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-linen/30 bg-umber/40 text-linen backdrop-blur-md transition-colors hover:border-ochre hover:bg-ochre"
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Next animal"
              className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-linen/30 bg-umber/40 text-linen backdrop-blur-md transition-colors hover:border-ochre hover:bg-ochre"
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
