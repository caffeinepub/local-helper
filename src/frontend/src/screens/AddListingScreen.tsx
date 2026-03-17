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
import { useAddListing } from "../hooks/useQueries";

interface Props {
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

export default function AddListingScreen({ navigate, goBack }: Props) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [area, setArea] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutateAsync: addListing, isPending } = useAddListing();

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

    let imageBlob: ExternalBlob | null = null;
    if (imageFile) {
      const arrayBuffer = await imageFile.arrayBuffer();
      imageBlob = ExternalBlob.fromBytes(new Uint8Array(arrayBuffer));
    }

    try {
      await addListing({
        name: name.trim(),
        category,
        price: price.trim(),
        area: area.trim(),
        phone: phone.trim(),
        ownerPhone: phone.trim(),
        description: description.trim(),
        imageBlob,
      });
      toast.success("Listing added successfully!");
      navigate({ name: "listings" });
    } catch {
      toast.error("Failed to add listing. Please try again.");
    }
  };

  return (
    <div data-ocid="add_listing.page" className="min-h-screen pb-24">
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
          data-ocid="add_listing.back_button"
          onClick={goBack}
          className="w-9 h-9 flex items-center justify-center rounded-full"
          style={{ background: "rgba(255,255,255,0.2)" }}
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="font-display text-xl font-bold text-white">
          Add New Listing
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
            data-ocid="add_listing.dropzone"
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
            data-ocid="add_listing.image_upload"
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
            htmlFor="add-name"
            className="text-sm font-semibold mb-1.5 block"
          >
            Listing Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="add-name"
            data-ocid="add_listing.name_input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Sunshine PG for Boys"
            className={errors.name ? "border-destructive" : ""}
          />
          {errors.name && (
            <p
              className="text-xs text-destructive mt-1"
              data-ocid="add_listing.name_error"
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
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PG">🏠 PG / Room</SelectItem>
              <SelectItem value="Tiffin">🍱 Tiffin Service</SelectItem>
            </SelectContent>
          </Select>
          {errors.category && (
            <p
              className="text-xs text-destructive mt-1"
              data-ocid="add_listing.category_error"
            >
              {errors.category}
            </p>
          )}
        </div>

        {/* Price */}
        <div>
          <Label
            htmlFor="add-price"
            className="text-sm font-semibold mb-1.5 block"
          >
            Price <span className="text-destructive">*</span>
          </Label>
          <Input
            id="add-price"
            data-ocid="add_listing.price_input"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="e.g. ₹5000/month"
            className={errors.price ? "border-destructive" : ""}
          />
          {errors.price && (
            <p
              className="text-xs text-destructive mt-1"
              data-ocid="add_listing.price_error"
            >
              {errors.price}
            </p>
          )}
        </div>

        {/* Area */}
        <div>
          <Label
            htmlFor="add-area"
            className="text-sm font-semibold mb-1.5 block"
          >
            Area / Location <span className="text-destructive">*</span>
          </Label>
          <Input
            id="add-area"
            data-ocid="add_listing.area_input"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder="e.g. Koramangala, Bangalore"
            className={errors.area ? "border-destructive" : ""}
          />
          {errors.area && (
            <p
              className="text-xs text-destructive mt-1"
              data-ocid="add_listing.area_error"
            >
              {errors.area}
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <Label
            htmlFor="add-phone"
            className="text-sm font-semibold mb-1.5 block"
          >
            Phone Number <span className="text-destructive">*</span>
          </Label>
          <Input
            id="add-phone"
            data-ocid="add_listing.phone_input"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. 9876543210"
            className={errors.phone ? "border-destructive" : ""}
          />
          {errors.phone && (
            <p
              className="text-xs text-destructive mt-1"
              data-ocid="add_listing.phone_error"
            >
              {errors.phone}
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            This number will be used to identify your listings
          </p>
        </div>

        {/* Description */}
        <div>
          <Label
            htmlFor="add-desc"
            className="text-sm font-semibold mb-1.5 block"
          >
            Description
          </Label>
          <Textarea
            id="add-desc"
            data-ocid="add_listing.description_textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your listing — amenities, meal timings, rules, etc."
            rows={4}
            className="resize-none"
          />
        </div>

        {/* Submit */}
        <motion.button
          data-ocid="add_listing.submit_button"
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
          {isPending ? "Adding Listing..." : "Add Listing"}
        </motion.button>
      </form>
    </div>
  );
}
