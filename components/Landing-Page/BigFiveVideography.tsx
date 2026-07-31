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
      className="relative h-screen w-full overflow-hidden bg-umber select-none focus:outline-none"
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
        const showFallbackPoster = failedVideos[index];

        return (
          <div
            key={animal.name}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? "z-10 opacity-100" : "z-0 opacity-0 pointer-events-none"
            }`}
            aria-hidden={!isActive}
          >
            {/* Poster shows immediately; video crossfades in once it can play */}
            <img
              src={animal.poster}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            {!showFallbackPoster && (
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
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                  loadedVideos[index] ? "opacity-100" : "opacity-0"
                }`}
              >
                <source src={animal.videoSrc} type="video/mp4" />
              </video>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-umber/90 via-umber/40 to-umber/20" />
          </div>
        );
      })}

      {/* Content overlay */}
      <div className="relative z-20 flex h-full flex-col justify-between p-6 md:p-12 lg:p-16 max-w-7xl mx-auto pointer-events-none">
        <div className="pt-8 pointer-events-auto">
          <span className="eyebrow !text-ochre">Videography</span>
          <h2 className="mt-2 max-w-xl font-display text-4xl text-linen md:text-6xl drop-shadow-md">
            The Big Five, Up Close
          </h2>
        </div>

        {/* Animal detail card */}
        <div className="mb-12 max-w-2xl pointer-events-auto" aria-live="polite">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="text-xs uppercase tracking-widest text-ochre font-semibold">
              {currentIndex + 1} / {bigFive.length}
            </span>
            <span className="text-xs uppercase tracking-widest text-linen/60">
              {active.whereToSpot}
            </span>
            <span className="text-xs uppercase tracking-widest text-linen/60">
              · Best seen: {active.bestTime}
            </span>
          </div>

          <h3 className="mt-2 font-display text-3xl md:text-5xl text-linen">
            {active.name}
          </h3>
          <p className="text-sm italic text-linen/50 mt-0.5">{active.latin}</p>

          <p className="mt-3 text-sm md:text-base leading-relaxed text-linen/90 drop-shadow">
            {active.fact}
          </p>
        </div>

        {/* Navigation & progress */}
        <div className="relative z-30 flex items-center justify-between border-t border-linen/20 pt-6 pointer-events-auto">
          <div className="flex items-center gap-3">
            {bigFive.map((animal, index) => (
              <button
                key={animal.name}
                type="button"
                onClick={() => {
                  goTo(index);
                }}
                aria-label={`Go to ${animal.name}`}
                aria-current={index === currentIndex}
                className="group relative h-1.5 w-12 sm:w-16 overflow-hidden rounded-full bg-linen/30"
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

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsAutoplay((prev) => !prev)}
              aria-label={isAutoplay ? "Pause slideshow" : "Play slideshow"}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-linen/30 bg-umber/40 text-linen backdrop-blur-md transition-colors hover:border-ochre hover:bg-ochre"
            >
              {isAutoplay ? <Pause className="h-4 w-4" /> : <Play className="ml-0.5 h-4 w-4" />}
            </button>

            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous animal"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-linen/30 bg-umber/40 text-linen backdrop-blur-md transition-colors hover:border-ochre hover:bg-ochre"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Next animal"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-linen/30 bg-umber/40 text-linen backdrop-blur-md transition-colors hover:border-ochre hover:bg-ochre"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
