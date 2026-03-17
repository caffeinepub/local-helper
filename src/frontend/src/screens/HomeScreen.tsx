import { Input } from "@/components/ui/input";
import { ChefHat, Home, MapPin, Search, Star, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { NavigateFn } from "../App";

interface Props {
  navigate: NavigateFn;
}

export default function HomeScreen({ navigate }: Props) {
  const [search, setSearch] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ name: "listings", search });
  };

  return (
    <div data-ocid="home.page" className="flex flex-col min-h-screen pb-20">
      {/* Header */}
      <div
        className="px-5 pt-12 pb-6"
        style={{
          background:
            "linear-gradient(160deg, oklch(0.35 0.15 170) 0%, oklch(0.45 0.18 175) 100%)",
        }}
      >
        <div className="flex items-center gap-2 mb-1">
          <MapPin className="w-4 h-4 text-white opacity-80" />
          <span className="text-xs text-white opacity-70 font-body">
            Your Locality
          </span>
        </div>
        <h1 className="font-display text-3xl font-bold text-white mb-1">
          Local Helper
        </h1>
        <p className="text-sm text-white opacity-70">
          Find PG Rooms & Tiffin services near you
        </p>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              data-ocid="home.search_input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or area..."
              className="pl-10 bg-white border-0 rounded-xl h-11 font-body text-foreground placeholder:text-muted-foreground shadow-lg"
            />
          </div>
        </form>
      </div>

      {/* Main content */}
      <div className="flex-1 px-5 pt-6 pb-4">
        {/* Category section */}
        <div className="mb-2">
          <h2 className="font-display text-lg font-semibold text-foreground mb-1">
            Browse Categories
          </h2>
          <p className="text-sm text-muted-foreground">
            What are you looking for?
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          {/* PG / Rooms card */}
          <motion.button
            data-ocid="home.pg_card"
            whileTap={{ scale: 0.96 }}
            whileHover={{ y: -2 }}
            onClick={() => navigate({ name: "listings", category: "PG" })}
            className="relative overflow-hidden rounded-2xl p-5 text-left shadow-md border border-border/50 bg-card"
            style={{ minHeight: 140 }}
          >
            <div
              className="absolute inset-0 opacity-5"
              style={{ background: "oklch(0.52 0.16 250)" }}
            />
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
              style={{ background: "oklch(0.92 0.06 250)" }}
            >
              <Home
                className="w-6 h-6"
                style={{ color: "oklch(0.4 0.18 250)" }}
              />
            </div>
            <div className="font-display font-semibold text-base text-foreground">
              PG / Rooms
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              Affordable stays
            </div>
            <div className="absolute bottom-3 right-3 text-2xl opacity-30">
              🏠
            </div>
          </motion.button>

          {/* Tiffin card */}
          <motion.button
            data-ocid="home.tiffin_card"
            whileTap={{ scale: 0.96 }}
            whileHover={{ y: -2 }}
            onClick={() => navigate({ name: "listings", category: "Tiffin" })}
            className="relative overflow-hidden rounded-2xl p-5 text-left shadow-md border border-border/50 bg-card"
            style={{ minHeight: 140 }}
          >
            <div
              className="absolute inset-0 opacity-5"
              style={{ background: "oklch(0.62 0.18 55)" }}
            />
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
              style={{ background: "oklch(0.93 0.06 55)" }}
            >
              <ChefHat
                className="w-6 h-6"
                style={{ color: "oklch(0.4 0.18 55)" }}
              />
            </div>
            <div className="font-display font-semibold text-base text-foreground">
              Tiffin Services
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              Home-cooked meals
            </div>
            <div className="absolute bottom-3 right-3 text-2xl opacity-30">
              🍱
            </div>
          </motion.button>
        </div>

        {/* Browse all */}
        <motion.button
          data-ocid="home.browse_all_button"
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate({ name: "listings" })}
          className="w-full mt-4 rounded-xl py-3.5 text-sm font-semibold font-body text-white shadow-sm"
          style={{ background: "oklch(0.52 0.15 170)" }}
        >
          Browse All Listings
        </motion.button>

        {/* Stats strip */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          {[
            { icon: TrendingUp, label: "New daily", value: "10+" },
            { icon: Star, label: "Avg rating", value: "4.8" },
            { icon: MapPin, label: "Areas", value: "50+" },
          ].map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="bg-card rounded-xl p-3 text-center border border-border/50"
            >
              <Icon
                className="w-4 h-4 mx-auto mb-1"
                style={{ color: "oklch(0.52 0.15 170)" }}
              />
              <div className="font-display font-bold text-base text-foreground">
                {value}
              </div>
              <div className="text-xs text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-4 text-center">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </div>
  );
}
