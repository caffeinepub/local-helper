import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { IndianRupee, MapPin, Package, Phone, Search } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import type { NavigateFn } from "../App";
import type { Listing } from "../backend.d";
import { useListings } from "../hooks/useQueries";

interface Props {
  navigate: NavigateFn;
  initialCategory?: string;
  initialSearch?: string;
}

function CategoryBadge({ category }: { category: string }) {
  if (category === "PG") {
    return (
      <span className="badge-pg text-xs font-semibold px-2 py-0.5 rounded-full">
        🏠 PG
      </span>
    );
  }
  return (
    <span className="badge-tiffin text-xs font-semibold px-2 py-0.5 rounded-full">
      🍱 Tiffin
    </span>
  );
}

function ListingCard({
  listing,
  index,
  onClick,
}: { listing: Listing; index: number; onClick: () => void }) {
  const imageUrl = listing.imageBlob?.getDirectURL();

  return (
    <motion.div
      data-ocid={`listing.card.${index + 1}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3 }}
      className="bg-card rounded-2xl shadow-sm border border-border/50 overflow-hidden card-hover"
    >
      {/* Image */}
      <button
        type="button"
        className="h-40 w-full relative overflow-hidden cursor-pointer block"
        onClick={onClick}
        onKeyUp={(e) => e.key === "Enter" && onClick()}
      >
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
              background:
                listing.category === "PG"
                  ? "linear-gradient(135deg, oklch(0.88 0.08 250), oklch(0.93 0.05 230))"
                  : "linear-gradient(135deg, oklch(0.9 0.08 55), oklch(0.95 0.05 70))",
            }}
          >
            <span className="text-4xl mb-1">
              {listing.category === "PG" ? "🏠" : "🍱"}
            </span>
            <span className="text-xs text-muted-foreground">
              {listing.area}
            </span>
          </div>
        )}
        <div className="absolute top-2 left-2">
          <CategoryBadge category={listing.category} />
        </div>
      </button>

      {/* Content */}
      <button type="button" className="p-4 w-full text-left" onClick={onClick}>
        <h3 className="font-display font-semibold text-base text-foreground mb-1">
          {listing.name}
        </h3>
        <div className="flex items-center gap-1 text-sm mb-1">
          <IndianRupee
            className="w-3.5 h-3.5"
            style={{ color: "oklch(0.52 0.15 170)" }}
          />
          <span
            className="font-semibold"
            style={{ color: "oklch(0.52 0.15 170)" }}
          >
            {listing.price}
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
          <MapPin className="w-3 h-3" />
          <span>{listing.area}</span>
        </div>
        {listing.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {listing.description}
          </p>
        )}
      </button>

      {/* Call button */}
      <div className="px-4 pb-4">
        <a
          href={`tel:${listing.phone}`}
          onClick={(e) => e.stopPropagation()}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: "oklch(0.52 0.15 170)" }}
        >
          <Phone className="w-4 h-4" />
          Call Now
        </a>
      </div>
    </motion.div>
  );
}

export default function ListingsScreen({
  navigate,
  initialCategory,
  initialSearch = "",
}: Props) {
  const [search, setSearch] = useState(initialSearch);
  const [categoryFilter, setCategoryFilter] = useState<string>(
    initialCategory ?? "All",
  );
  const { data: listings, isLoading } = useListings();

  const filtered = useMemo(() => {
    if (!listings) return [];
    return listings.filter((l) => {
      const matchCategory =
        categoryFilter === "All" || l.category === categoryFilter;
      const matchSearch =
        !search ||
        l.name.toLowerCase().includes(search.toLowerCase()) ||
        l.area.toLowerCase().includes(search.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [listings, categoryFilter, search]);

  const tabs = ["All", "PG", "Tiffin"];

  return (
    <div data-ocid="listings.page" className="flex flex-col min-h-screen pb-24">
      {/* Header */}
      <div
        className="px-5 pt-12 pb-4"
        style={{
          background:
            "linear-gradient(160deg, oklch(0.35 0.15 170) 0%, oklch(0.45 0.18 175) 100%)",
        }}
      >
        <h1 className="font-display text-2xl font-bold text-white mb-4">
          {categoryFilter === "All"
            ? "All Listings"
            : `${categoryFilter} Listings`}
        </h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            data-ocid="listings.search_input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or area..."
            className="pl-10 bg-white border-0 rounded-xl h-11 font-body"
          />
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 px-5 py-3 bg-card border-b border-border/50 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            data-ocid={`listings.${tab.toLowerCase()}_tab`}
            onClick={() => setCategoryFilter(tab)}
            className="flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-all"
            style={{
              background:
                categoryFilter === tab
                  ? "oklch(0.52 0.15 170)"
                  : "oklch(0.93 0.01 250)",
              color: categoryFilter === tab ? "white" : "oklch(0.45 0.02 250)",
            }}
          >
            {tab === "PG" ? "🏠 PG" : tab === "Tiffin" ? "🍱 Tiffin" : "All"}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 px-5 pt-4">
        {isLoading ? (
          <div
            className="grid grid-cols-1 gap-4"
            data-ocid="listings.loading_state"
          >
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-card rounded-2xl overflow-hidden border border-border/50"
              >
                <Skeleton className="h-40 w-full" />
                <div className="p-4">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/3 mb-2" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            data-ocid="listings.empty_state"
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <Package
              className="w-14 h-14 mx-auto mb-4"
              style={{ color: "oklch(0.75 0.05 250)" }}
            />
            <h3 className="font-display font-semibold text-lg text-foreground mb-2">
              No listings found
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              {search || categoryFilter !== "All"
                ? "Try adjusting your search or filters."
                : "Be the first to add a listing!"}
            </p>
            <button
              type="button"
              onClick={() => navigate({ name: "add" })}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{ background: "oklch(0.52 0.15 170)" }}
            >
              Add Listing
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filtered.map((listing, index) => (
              <ListingCard
                key={listing.id.toString()}
                listing={listing}
                index={index}
                onClick={() =>
                  navigate({ name: "detail", listingId: listing.id })
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
