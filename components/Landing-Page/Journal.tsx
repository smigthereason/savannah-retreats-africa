"use client";

import { useState } from "react";
import Image from "next/image";
import { journal } from "@/lib/data";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ArrowLeft, ArrowRight } from "lucide-react";

// Import Swiper core styles
import "swiper/css";
import "swiper/css/navigation";

export default function Journal() {
  const [prevEl, setPrevEl] = useState<HTMLElement | null>(null);
  const [nextEl, setNextEl] = useState<HTMLElement | null>(null);

  // Pad the array to ensure we have a collection to paginate smoothly through positions 1 to 6
  const displaySlides =
    journal.length < 6
      ? [...journal, ...journal, ...journal].slice(0, 6)
      : journal;

  return (
    <section className="bg-umber py-24">
      <div className="mx-auto max-w-8xl px-4 md:px-8">
        {/* Top Header Section with Integrated Navigation Arrows */}
        <div className="mb-14 flex items-end justify-between">
          <div>
            <span className="eyebrow !text-ochre uppercase tracking-widest2 text-xs">
              Hotel Blog
            </span>
            <h2 className="mt-2 font-display text-4xl text-linen md:text-5xl">
              Our News
            </h2>
          </div>

          {/* Custom Styled Minimalist Navigation Elements */}
          <div className="flex items-center gap-3">
            <button
              ref={(node) => setPrevEl(node)}
              className="flex h-12 w-12 items-center justify-center border border-linen/20 rounded-full text-linen hover:border-ochre hover:text-ochre disabled:opacity-30 disabled:pointer-events-none transition-all duration-300 cursor-pointer"
              aria-label="Previous slide"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              ref={(node) => setNextEl(node)}
              className="flex h-12 w-12 items-center justify-center border border-linen/20 rounded-full text-linen hover:border-ochre hover:text-ochre disabled:opacity-30 disabled:pointer-events-none transition-all duration-300 cursor-pointer"
              aria-label="Next slide"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Carousel Component Framework restricted to the center grid space */}
        <Swiper
          modules={[Navigation]}
          navigation={{
            prevEl,
            nextEl,
          }}
          spaceBetween={32}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          loop={true}
          className="w-full"
        >
          {displaySlides.map((post, index) => (
            <SwiperSlide key={`${post.title}-${index}`} className="pb-16">
              <a
                href="/journal"
                className="group block relative w-full select-none"
              >
                {/* Fixed Structural Aspect Ratio Container for Layout Uniformity */}
                <div className="relative aspect-[3/4] w-full overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Subtle Dark Vignette Backdrop overlay to pop the image dates */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent" />

                  {/* The Transparent Minimalist Date Stamp Accent */}
                  <div className="absolute left-6 top-6 flex flex-col items-center border border-linen/30 bg-black/10 backdrop-blur-xs px-3 py-2 leading-none text-linen">
                    <span className="text-[10px] uppercase tracking-widest2 font-light opacity-80">
                      {post.date.month}
                    </span>
                    <span className="font-display text-xl mt-1 font-semibold">
                      {post.date.day}
                    </span>
                  </div>
                </div>

                {/* Overlapping Content Box with Active Hover Fluid Physics */}
                <div className="absolute bottom-[-30px] left-6 right-6 bg-linen p-8 shadow-xl transition-transform duration-500 ease-out group-hover:-translate-y-4">
                  <span className="text-[11px] font-medium uppercase tracking-widest2 text-ochre block mb-2">
                    {post.category}
                  </span>
                  <h3 className="font-display text-2xl text-umber leading-snug">
                    {post.title}
                  </h3>
                </div>
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
