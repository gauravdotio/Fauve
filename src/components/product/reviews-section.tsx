import { Rating } from "@/components/ui/rating";
import { ReviewForm } from "@/components/product/review-form";

interface ReviewRecord {
  id: string;
  rating: number;
  title: string;
  body: string;
  createdAt: Date;
  user: { name: string };
}

interface ReviewsSectionProps {
  productSlug: string;
  rating: number;
  reviewCount: number;
  reviews: ReviewRecord[];
  isLoggedIn: boolean;
}

export function ReviewsSection({ productSlug, rating, reviewCount, reviews, isLoggedIn }: ReviewsSectionProps) {
  return (
    <section id="reviews" className="scroll-mt-24 border-t border-border">
      <div className="container-page py-16 sm:py-20">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-xs font-medium uppercase tracking-[0.14em] text-accent">Reviews</span>
            <h2 className="mt-3 font-serif text-3xl text-ink sm:text-4xl">Customer Reviews</h2>
            <div className="mt-3 flex items-center gap-2">
              <Rating value={rating} size="md" />
              <span className="text-sm tabular-nums text-ink-soft">{rating.toFixed(1)} out of 5 · {reviewCount.toLocaleString()} ratings</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            {reviews.length === 0 ? (
              <p className="border border-dashed border-border-strong px-5 py-10 text-center text-sm text-ink-soft">
                No written reviews yet — be the first to share your thoughts.
              </p>
            ) : (
              <ul className="flex flex-col divide-y divide-border">
                {reviews.map((review) => (
                  <li key={review.id} className="py-6 first:pt-0">
                    <div className="flex items-center justify-between gap-3">
                      <Rating value={review.rating} />
                      <span className="text-xs text-ink-faint">
                        {review.createdAt.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </div>
                    <h3 className="mt-2.5 text-sm font-medium text-ink">{review.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{review.body}</p>
                    <p className="mt-2.5 text-xs text-ink-faint">{review.user.name}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="lg:col-span-5">
            <ReviewForm productSlug={productSlug} isLoggedIn={isLoggedIn} />
          </div>
        </div>
      </div>
    </section>
  );
}
