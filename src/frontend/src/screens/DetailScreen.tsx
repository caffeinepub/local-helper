import { Skeleton } from "@/components/ui/skeleton";
import {
  ChefHat,
  ChevronLeft,
  Home,
  IndianRupee,
  MapPin,
  Phone,
} from "lucide-react";
import { motion } from "motion/react";
import { useListing } from "../hooks/useQueries";

interface Props {
  listingId: bigint;
  goBack: () => void;
}

export default function DetailScreen({ listingId, goBack }: Props) {
  const { data: listing, isLoading } = useListing(listingId);

  const imageUrl = listing?.imageBlob?.getDirectURL();

  if (isLoading) {
    return (
      <div data-ocid="detail.page" className="min-h-screen pb-8">
        <Skeleton className="h-64 w-full" />
        <div className="px-5 pt-4">
          <Skeleton className="h-7 w-3/4 mb-3" />
          <Skeleton className="h-5 w-1/3 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-4" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div
        data-ocid="detail.page"
        className="min-h-screen flex flex-col items-center justify-center"
      >
        <p className="text-muted-foreground">Listing not found.</p>
        <button
          type="button"
          onClick={goBack}
          className="mt-4 text-sm underline"
          style={{ color: "oklch(0.52 0.15 170)" }}
        >
          Go back
        </button>
      </div>
    );
  }

  const isPG = listing.category === "PG";

  return (
    <div data-ocid="detail.page" className="min-h-screen pb-8">
      {/* Hero image */}
      <div className="relative h-64 w-full overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={listing.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full flex flex-col items-center justify-center"
            style={{
              background: isPG
                ? "linear-gradient(135deg, oklch(0.75 0.12 250), oklch(0.85 0.08 240))"
                : "linear-gradient(135deg, oklch(0.8 0.12 55), oklch(0.88 0.08 65))",
            }}
          >
            {isPG ? (
              <Home className="w-16 h-16 text-white opacity-50" />
            ) : (
              <ChefHat className="w-16 h-16 text-white opacity-50" />
            )}
            <span className="text-white opacity-50 mt-2 text-sm">
              {listing.area}
            </span>
          </div>
        )}

        {/* Back button */}
        <motion.button
          data-ocid="detail.back_button"
          whileTap={{ scale: 0.9 }}
          onClick={goBack}
          className="absolute top-12 left-4 w-10 h-10 flex items-center justify-center rounded-full"
          style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)" }}
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </motion.button>

        {/* Category badge overlay */}
        <div className="absolute bottom-3 left-4">
          {isPG ? (
            <span className="badge-pg text-xs font-semibold px-3 py-1 rounded-full">
              🏠 PG / Room
            </span>
          ) : (
            <span className="badge-tiffin text-xs font-semibold px-3 py-1 rounded-full">
              🍱 Tiffin Service
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-5 pt-5">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="font-display text-2xl font-bold text-foreground mb-3">
            {listing.name}
          </h1>

          {/* Price */}
          <div
            className="flex items-center gap-1.5 mb-3 px-4 py-3 rounded-xl"
            style={{ background: "oklch(0.92 0.05 170)" }}
          >
            <IndianRupee
              className="w-5 h-5"
              style={{ color: "oklch(0.4 0.15 170)" }}
            />
            <span
              className="font-display font-bold text-xl"
              style={{ color: "oklch(0.35 0.15 170)" }}
            >
              {listing.price}
            </span>
          </div>

          {/* Area */}
          <div className="flex items-center gap-2 mb-4 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{listing.area}</span>
          </div>

          {/* Description */}
          {listing.description && (
            <div className="mb-5">
              <h2 className="font-display font-semibold text-base text-foreground mb-2">
                About
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {listing.description}
              </p>
            </div>
          )}

          {/* Contact info */}
          <div className="flex items-center gap-3 p-4 rounded-xl mb-5 border border-border/50 bg-card">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "oklch(0.92 0.05 170)" }}
            >
              <Phone
                className="w-5 h-5"
                style={{ color: "oklch(0.45 0.15 170)" }}
              />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Contact number</p>
              <p className="font-semibold text-foreground">{listing.phone}</p>
            </div>
          </div>

          {/* Call Now button */}
          <a
            data-ocid="detail.call_button"
            href={`tel:${listing.phone}`}
            className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl text-base font-bold text-white shadow-lg"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.5 0.16 170), oklch(0.42 0.18 175))",
            }}
          >
            <Phone className="w-5 h-5" />
            Call Now
          </a>
        </motion.div>
      </div>
    </div>
  );
}
