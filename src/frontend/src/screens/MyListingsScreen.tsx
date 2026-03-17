import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Edit2,
  IndianRupee,
  Loader2,
  MapPin,
  Phone,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { NavigateFn } from "../App";
import type { Listing } from "../backend.d";
import { useDeleteListing, useListingsByOwner } from "../hooks/useQueries";

interface Props {
  navigate: NavigateFn;
}

export default function MyListingsScreen({ navigate }: Props) {
  const [phoneInput, setPhoneInput] = useState("");
  const [submittedPhone, setSubmittedPhone] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Listing | null>(null);

  const { data: listings, isLoading } = useListingsByOwner(submittedPhone);
  const { mutateAsync: deleteListing, isPending: isDeleting } =
    useDeleteListing();

  const handleView = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneInput.trim()) return;
    setSubmittedPhone(phoneInput.trim());
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteListing(deleteTarget.id);
      toast.success("Listing deleted successfully");
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to delete listing.");
    }
  };

  return (
    <div
      data-ocid="my_listings.page"
      className="flex flex-col min-h-screen pb-24"
    >
      {/* Header */}
      <div
        className="px-5 pt-12 pb-5"
        style={{
          background:
            "linear-gradient(160deg, oklch(0.35 0.15 170) 0%, oklch(0.45 0.18 175) 100%)",
        }}
      >
        <h1 className="font-display text-2xl font-bold text-white mb-1">
          My Listings
        </h1>
        <p className="text-sm text-white opacity-70">
          Manage your posted listings
        </p>
      </div>

      {/* Phone input */}
      <div className="px-5 py-5">
        <form onSubmit={handleView} className="flex gap-3">
          <div className="flex-1 relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              data-ocid="my_listings.phone_input"
              type="tel"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              placeholder="Enter your phone number"
              className="pl-10"
            />
          </div>
          <Button
            data-ocid="my_listings.view_button"
            type="submit"
            disabled={!phoneInput.trim()}
            className="font-semibold px-4"
            style={{ background: "oklch(0.52 0.15 170)", color: "white" }}
          >
            View
          </Button>
        </form>
      </div>

      {/* Results */}
      <div className="flex-1 px-5">
        {!submittedPhone ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-5xl mb-4">📱</div>
            <p className="text-muted-foreground text-sm">
              Enter your phone number to view and manage your listings
            </p>
          </div>
        ) : isLoading ? (
          <div data-ocid="my_listings.loading_state" className="space-y-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-card rounded-2xl p-4 border border-border/50"
              >
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/3 mb-2" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        ) : listings && listings.length > 0 ? (
          <AnimatePresence>
            <div className="space-y-4">
              {listings.map((listing, index) => (
                <motion.div
                  key={listing.id.toString()}
                  data-ocid={`my_listings.item.${index + 1}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.07 }}
                  className="bg-card rounded-2xl border border-border/50 overflow-hidden shadow-sm"
                >
                  {listing.imageBlob?.getDirectURL() && (
                    <img
                      src={listing.imageBlob.getDirectURL()}
                      alt={listing.name}
                      className="w-full h-32 object-cover"
                    />
                  )}

                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-display font-semibold text-base text-foreground flex-1">
                        {listing.name}
                      </h3>
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
                          listing.category === "PG"
                            ? "badge-pg"
                            : "badge-tiffin"
                        }`}
                      >
                        {listing.category === "PG" ? "🏠 PG" : "🍱 Tiffin"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-sm mb-1">
                      <IndianRupee
                        className="w-3.5 h-3.5"
                        style={{ color: "oklch(0.52 0.15 170)" }}
                      />
                      <span
                        className="font-semibold text-sm"
                        style={{ color: "oklch(0.45 0.15 170)" }}
                      >
                        {listing.price}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
                      <MapPin className="w-3 h-3" />
                      <span>{listing.area}</span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        data-ocid={`my_listings.edit_button.${index + 1}`}
                        onClick={() => navigate({ name: "edit", listing })}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold border border-border"
                        style={{ color: "oklch(0.45 0.15 170)" }}
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        type="button"
                        data-ocid={`my_listings.delete_button.${index + 1}`}
                        onClick={() => setDeleteTarget(listing)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold"
                        style={{
                          background: "oklch(0.95 0.03 25)",
                          color: "oklch(0.45 0.2 25)",
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        ) : (
          <div
            data-ocid="my_listings.empty_state"
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="font-display font-semibold text-lg text-foreground mb-2">
              No listings found
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              No listings found for this number.
            </p>
            <button
              type="button"
              onClick={() => navigate({ name: "add" })}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{ background: "oklch(0.52 0.15 170)" }}
            >
              Add Your First Listing
            </button>
          </div>
        )}
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent data-ocid="my_listings.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">
              Delete Listing?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deleteTarget?.name}&quot;?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="my_listings.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="my_listings.confirm_button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting && <Loader2 className="mr-2 w-4 h-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
