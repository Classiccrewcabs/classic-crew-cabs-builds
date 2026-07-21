"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import Image from "next/image";
import { buildImageUrl } from "@/lib/image-url";
import type { Build, BuildImage } from "@/lib/types";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-navy text-cream font-semibold uppercase tracking-wide px-6 py-3 hover:bg-navy-light transition-colors disabled:opacity-60"
    >
      {pending ? "Saving..." : label}
    </button>
  );
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-wide text-navy/60 mb-1">
        {label}
        {required && <span className="text-red"> *</span>}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        defaultValue={defaultValue ?? ""}
        className="w-full border border-navy/20 px-3 py-2 text-navy focus:outline-none focus:border-navy"
      />
    </div>
  );
}

export function BuildForm({
  action,
  build,
  existingImages,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  build?: Build;
  existingImages?: BuildImage[];
  submitLabel: string;
}) {
  const [category, setCategory] = useState(build?.category ?? "past_build");

  return (
    <form action={action} className="max-w-3xl space-y-10">
      {build && <input type="hidden" name="slug" value={build.slug} />}

      <div>
        <label className="block text-xs uppercase tracking-wide text-navy/60 mb-1">
          Category
        </label>
        <select
          name="category"
          value={category}
          onChange={(e) =>
            setCategory(e.target.value as "for_sale" | "past_build")
          }
          className="w-full max-w-xs border border-navy/20 px-3 py-2 text-navy focus:outline-none focus:border-navy bg-white"
        >
          <option value="for_sale">For Sale</option>
          <option value="past_build">Past Build</option>
        </select>
      </div>

      <div>
        <h2 className="text-xs font-bold uppercase tracking-wide text-navy/40 mb-3">
          Main Page (shown on the listing card)
        </h2>
        <div className="space-y-4">
          <Field
            label="Title (optional — e.g. a nickname or edition name)"
            name="title"
            defaultValue={build?.title}
          />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Field
              label="Year"
              name="year"
              type="number"
              defaultValue={build?.year}
              required
            />
            <Field
              label="Make"
              name="make"
              defaultValue={build?.make}
              required
            />
            <Field
              label="Model"
              name="model"
              defaultValue={build?.model}
              required
            />
            <Field
              label="Sub Model"
              name="package"
              defaultValue={build?.package}
            />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xs font-bold uppercase tracking-wide text-navy/40 mb-3">
          Detail Page (shown after &quot;View Details&quot;)
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <Field
            label="Exterior Color"
            name="exterior_color"
            defaultValue={build?.exterior_color}
          />
          <Field label="Engine" name="engine" defaultValue={build?.engine} />
          <Field
            label="Transmission"
            name="transmission"
            defaultValue={build?.transmission}
          />
          <Field label="Axles" name="axles" defaultValue={build?.axles} />
          <Field label="Brakes" name="brakes" defaultValue={build?.brakes} />
          <Field
            label="Interior"
            name="interior"
            defaultValue={build?.interior}
          />
          <div>
            <label className="block text-xs uppercase tracking-wide text-navy/60 mb-1">
              Status
            </label>
            <select
              name="status"
              defaultValue={build?.status ?? "available"}
              className="w-full border border-navy/20 px-3 py-2 text-navy focus:outline-none focus:border-navy bg-white"
            >
              <option value="available">Available</option>
              <option value="sold">Sold</option>
              <option value="featured">Featured</option>
            </select>
          </div>
          <Field
            label="Price (optional — leave blank to hide)"
            name="price"
            defaultValue={build?.price}
          />
        </div>

        <div className="mt-4">
          <label className="block text-xs uppercase tracking-wide text-navy/60 mb-1">
            Creature Comforts
          </label>
          <textarea
            name="creature_comforts"
            rows={3}
            defaultValue={build?.creature_comforts ?? ""}
            placeholder="A/C, power windows, heated seats, Bluetooth stereo..."
            className="w-full border border-navy/20 px-3 py-2 text-navy focus:outline-none focus:border-navy"
          />
        </div>

        <div className="mt-4">
          <label className="block text-xs uppercase tracking-wide text-navy/60 mb-1">
            Description
          </label>
          <textarea
            name="description"
            rows={5}
            defaultValue={build?.description ?? ""}
            className="w-full border border-navy/20 px-3 py-2 text-navy focus:outline-none focus:border-navy"
          />
        </div>
      </div>

      {existingImages && existingImages.length > 0 && (
        <div>
          <p className="text-xs uppercase tracking-wide text-navy/60 mb-2">
            Current Photos &mdash; select the lead photo, check any to remove
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {existingImages.map((image) => (
              <div key={image.id} className="space-y-1">
                <div className="relative aspect-square bg-white border border-navy/10">
                  <Image
                    src={buildImageUrl(image.storage_path)}
                    alt=""
                    fill
                    className="object-contain"
                    sizes="120px"
                  />
                </div>
                <label className="flex items-center justify-center gap-1 text-[0.65rem] uppercase tracking-wide text-navy/70">
                  <input
                    type="radio"
                    name="cover_image_id"
                    value={image.id}
                    defaultChecked={build?.cover_image_id === image.id}
                    className="accent-red"
                  />
                  Lead Photo
                </label>
                <label className="flex items-center justify-center gap-1 text-[0.65rem] uppercase tracking-wide text-red">
                  <input
                    type="checkbox"
                    name="delete_image"
                    value={image.id}
                    className="accent-red"
                  />
                  Remove
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="block text-xs uppercase tracking-wide text-navy/60 mb-1">
          {existingImages && existingImages.length > 0
            ? "Add More Photos"
            : "Photos (up to 10) — first photo uploaded becomes the lead photo"}
        </label>
        <input
          type="file"
          name="photos"
          accept="image/*"
          multiple
          className="w-full border border-navy/20 px-3 py-2 text-navy file:mr-4 file:border-0 file:bg-navy file:text-cream file:px-4 file:py-2 file:uppercase file:text-xs file:font-semibold"
        />
      </div>

      <SubmitButton label={submitLabel} />
    </form>
  );
}
