"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type GalleryImage = { url: string; alt: string };

const ZOOM_QUERY = "(hover: hover) and (min-width: 1024px)";

export function ProductGallery({ images, name }: { images: GalleryImage[]; name: string }) {
  const [index, setIndex] = useState(0);
  const [zoomOrigin, setZoomOrigin] = useState<string | null>(null);
  const touchStartX = useRef<number | null>(null);

  const count = images.length;
  const hasMultiple = count > 1;

  const go = (next: number) => {
    setZoomOrigin(null);
    setIndex((next + count) % count);
  };

  if (count === 0) {
    return (
      <div className="flex aspect-[4/5] w-full items-center justify-center bg-surface-alt text-sm text-ink-faint">
        Image coming soon
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 lg:flex-row-reverse lg:gap-4">
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label={`${name} images`}
        tabIndex={0}
        onKeyDown={(e) => {
          if (!hasMultiple) return;
          if (e.key === "ArrowRight") {
            e.preventDefault();
            go(index + 1);
          } else if (e.key === "ArrowLeft") {
            e.preventDefault();
            go(index - 1);
          }
        }}
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (touchStartX.current === null || !hasMultiple) return;
          const delta = e.changedTouches[0].clientX - touchStartX.current;
          if (Math.abs(delta) > 40) go(index + (delta < 0 ? 1 : -1));
          touchStartX.current = null;
        }}
        onMouseMove={(e) => {
          if (!window.matchMedia(ZOOM_QUERY).matches) return;
          const rect = e.currentTarget.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          setZoomOrigin(`${x}% ${y}%`);
        }}
        onMouseLeave={() => setZoomOrigin(null)}
        className="group relative aspect-[4/5] w-full touch-pan-y overflow-hidden bg-surface-alt lg:flex-1 lg:cursor-zoom-in"
      >
        {images.map((image, i) => (
          <div
            key={`${image.url}-${i}`}
            aria-hidden={i !== index}
            className={cn(
              "absolute inset-0 transition-opacity duration-500 ease-out",
              i === index ? "opacity-100" : "opacity-0",
            )}
          >
            <Image
              src={image.url}
              alt={image.alt}
              fill
              priority={i === 0}
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-cover transition-transform duration-300 ease-out"
              style={i === index && zoomOrigin ? { transform: "scale(1.8)", transformOrigin: zoomOrigin } : undefined}
            />
          </div>
        ))}

        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-surface/90 text-ink shadow-sm backdrop-blur transition-opacity hover:bg-surface focus-visible:opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label="Next image"
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-surface/90 text-ink shadow-sm backdrop-blur transition-opacity hover:bg-surface focus-visible:opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
            >
              <ChevronRight size={18} />
            </button>
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5 lg:hidden" aria-hidden>
              {images.map((_, i) => (
                <span
                  key={i}
                  className={cn("h-1.5 rounded-full transition-all duration-300", i === index ? "w-5 bg-ink" : "w-1.5 bg-ink/30")}
                />
              ))}
            </div>
            <p className="sr-only" aria-live="polite">
              Image {index + 1} of {count}
            </p>
          </>
        )}
      </div>

      {hasMultiple && (
        <div className="no-scrollbar flex gap-3 overflow-x-auto px-5 py-1 md:px-0 lg:w-20 lg:flex-col lg:overflow-visible lg:py-0">
          {images.map((image, i) => (
            <button
              key={`${image.url}-thumb-${i}`}
              type="button"
              onClick={() => go(i)}
              aria-label={`View image ${i + 1} of ${count}`}
              aria-current={i === index}
              className={cn(
                "relative aspect-[4/5] w-16 shrink-0 overflow-hidden bg-surface-alt transition-all duration-200 lg:w-full",
                i === index
                  ? "opacity-100 ring-1 ring-ink ring-offset-2 ring-offset-paper"
                  : "opacity-55 hover:opacity-100",
              )}
            >
              <Image src={image.url} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
