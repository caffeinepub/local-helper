import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, Loader2, Upload } from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import type { NavigateFn } from "../App";
import { ExternalBlob } from "../backend";
import type { Listing } from "../backend.d";
import { useUpdateListing } from "../hooks/useQueries";

interface Props {
  listing: Listing;
  navigate: NavigateFn;
  goBack: () => void;
}

interface FormErrors {
  name?: string;
  category?: string;
  price?: string;
  area?: string;
  phone?: string;
}

export default function EditListingScreen({
  listing,
  navigate,
  goBack,
}: Props) {
  const [name, setName] = useState(listing.name);
  const [category, setCategory] = useState(listing.category);
  const [price, setPrice] = useState(listing.price);
  const [area, setArea] = useState(listing.area);
  const [phone, setPhone] = useState(listing.phone);
  const [description, setDescription] = useState(listing.description);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    listing.imageBlob?.getDirectURL() ?? null,
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutateAsync: updateListing, isPending } = useUpdateListing();

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!name.trim()) errs.name = "Name is required";
    if (!category) errs.category = "Category is required";
    if (!price.trim()) errs.price = "Price is required";
    if (!area.trim()) errs.area = "Area is required";
    if (!phone.trim()) errs.phone = "Phone is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    let imageBlob = (listing.imageBlob ?? null) as ExternalBlob | null;
    if (imageFile) {
      const arrayBuffer = await imageFile.arrayBuffer();
      imageBlob = ExternalBlob.fromBytes(new Uint8Array(arrayBuffer));
    }

    try {
      await updateListing({
        id: listing.id,
        name: name.trim(),
        category,
        price: price.trim(),
        area: area.trim(),
        phone: phone.trim(),
        description: description.trim(),
        imageBlob,
      });
      toast.success("Listing updated successfully!");
      navigate({ name: "myListings" });
    } catch {
      toast.error("Failed to update listing. Please try again.");
    }
  };

  return (
    <div data-ocid="edit_listing.page" className="min-h-screen pb-24">
      {/* Header */}
      <div
        className="flex items-center gap-3 px-5 pt-12 pb-5"
        style={{
          background:
            "linear-gradient(160deg, oklch(0.35 0.15 170) 0%, oklch(0.45 0.18 175) 100%)",
        }}
      >
        <button
          type="button"
          data-ocid="edit_listing.back_button"
          onClick={goBack}
          className="w-9 h-9 flex items-center justify-center rounded-full"
          style={{ background: "rgba(255,255,255,0.2)" }}
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="font-display text-xl font-bold text-white">
          Edit Listing
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="px-5 pt-5 space-y-5">
        {/* Image upload */}
        <div>
          <Label className="text-sm font-semibold text-foreground mb-2 block">
            Photo
          </Label>
          <button
            type="button"
            data-ocid="edit_listing.dropzone"
            className="relative h-36 w-full rounded-2xl border-2 border-dashed border-border overflow-hidden cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                <Upload className="w-8 h-8 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  Tap to upload image
                </span>
              </div>
            )}
          </button>
          <input
            data-ocid="edit_listing.image_upload"
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>

        {/* Name */}
        <div>
          <Label
            htmlFor="edit-name"
            className="text-sm font-semibold mb-1.5 block"
          >
            Listing Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="edit-name"
            data-ocid="add_listing.name_input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={errors.name ? "border-destructive" : ""}
          />
          {errors.name && (
            <p
              className="text-xs text-destructive mt-1"
              data-ocid="edit_listing.name_error"
            >
              {errors.name}
            </p>
          )}
        </div>

        {/* Category */}
        <div>
          <Label className="text-sm font-semibold mb-1.5 block">
            Category <span className="text-destructive">*</span>
          </Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger
              data-ocid="add_listing.category_select"
              className={errors.category ? "border-destructive" : ""}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PG">🏠 PG / Room</SelectItem>
              <SelectItem value="Tiffin">🍱 Tiffin Service</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Price */}
        <div>
          <Label
            htmlFor="edit-price"
            className="text-sm font-semibold mb-1.5 block"
          >
            Price <span className="text-destructive">*</span>
          </Label>
          <Input
            id="edit-price"
            data-ocid="add_listing.price_input"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className={errors.price ? "border-destructive" : ""}
          />
        </div>

        {/* Area */}
        <div>
          <Label
            htmlFor="edit-area"
            className="text-sm font-semibold mb-1.5 block"
          >
            Area / Location <span className="text-destructive">*</span>
          </Label>
          <Input
            id="edit-area"
            data-ocid="add_listing.area_input"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className={errors.area ? "border-destructive" : ""}
          />
        </div>

        {/* Phone */}
        <div>
          <Label
            htmlFor="edit-phone"
            className="text-sm font-semibold mb-1.5 block"
          >
            Phone Number <span className="text-destructive">*</span>
          </Label>
          <Input
            id="edit-phone"
            data-ocid="add_listing.phone_input"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={errors.phone ? "border-destructive" : ""}
          />
        </div>

        {/* Description */}
        <div>
          <Label
            htmlFor="edit-desc"
            className="text-sm font-semibold mb-1.5 block"
          >
            Description
          </Label>
          <Textarea
            id="edit-desc"
            data-ocid="add_listing.description_textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="resize-none"
          />
        </div>

        {/* Submit */}
        <motion.button
          data-ocid="edit_listing.submit_button"
          type="submit"
          disabled={isPending}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 rounded-2xl text-base font-bold text-white flex items-center justify-center gap-2 disabled:opacity-70"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.5 0.16 170), oklch(0.42 0.18 175))",
          }}
        >
          {isPending && <Loader2 className="w-5 h-5 animate-spin" />}
          {isPending ? "Saving Changes..." : "Save Changes"}
        </motion.button>
      </form>
    </div>
  );
}
