import { Home, Plus, Search, User } from "lucide-react";
import { motion } from "motion/react";
import type { NavState, ScreenName } from "../App";

interface Props {
  current: ScreenName;
  navigate: (state: NavState) => void;
}

const navItems = [
  { name: "home" as const, label: "Home", icon: Home, ocid: "nav.home_link" },
  {
    name: "listings" as const,
    label: "Browse",
    icon: Search,
    ocid: "nav.browse_link",
  },
  {
    name: "add" as const,
    label: "Add",
    icon: Plus,
    ocid: "nav.add_link",
    primary: true,
  },
  {
    name: "myListings" as const,
    label: "Mine",
    icon: User,
    ocid: "nav.my_listings_link",
  },
];

export default function BottomNav({ current, navigate }: Props) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 pb-safe"
      style={{ maxWidth: 480, margin: "0 auto" }}
    >
      <div
        className="mx-4 mb-3 rounded-2xl border border-border/50 shadow-xl"
        style={{
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="flex items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = current === item.name;

            if (item.primary) {
              return (
                <div
                  key={item.name}
                  className="flex-1 flex justify-center py-3"
                >
                  <motion.button
                    type="button"
                    data-ocid={item.ocid}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => navigate({ name: item.name })}
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.5 0.16 170), oklch(0.42 0.18 175))",
                    }}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </motion.button>
                </div>
              );
            }

            return (
              <button
                key={item.name}
                type="button"
                data-ocid={item.ocid}
                onClick={() => navigate({ name: item.name })}
                className="flex-1 flex flex-col items-center gap-1 py-3 transition-all"
              >
                <div className="relative">
                  <Icon
                    className="w-5 h-5 transition-colors"
                    style={{
                      color: isActive
                        ? "oklch(0.52 0.15 170)"
                        : "oklch(0.6 0.02 250)",
                      strokeWidth: isActive ? 2.5 : 1.5,
                    }}
                  />
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                      style={{ background: "oklch(0.52 0.15 170)" }}
                    />
                  )}
                </div>
                <span
                  className="text-xs font-medium transition-colors"
                  style={{
                    color: isActive
                      ? "oklch(0.52 0.15 170)"
                      : "oklch(0.6 0.02 250)",
                    fontFamily: "Plus Jakarta Sans, sans-serif",
                  }}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
