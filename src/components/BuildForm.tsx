"use client";

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
  return (
    <form action={action} className="max-w-3xl space-y-8">
      {build && <input type="hidden" name="slug" value={build.slug} />}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Field
          label="Year"
          name="year"
          type="number"
          defaultValue={build?.year}
          required
        />
        <Field label="Make" name="make" defaultValue={build?.make} required />
        <Field
          label="Model"
          name="model"
          defaultValue={build?.model}
          required
        />
        <Field
          label="Package / Build Name"
          name="package"
          defaultValue={build?.package}
        />
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
      </div>

      <div>
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

      {existingImages && existingImages.length > 0 && (
        <div>
          <p className="text-xs uppercase tracking-wide text-navy/60 mb-2">
            Current Photos &mdash; check any to remove
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {existingImages.map((image) => (
              <label key={image.id} className="relative block cursor-pointer">
                <div className="relative aspect-square bg-white border border-navy/10">
                  <Image
                    src={buildImageUrl(image.storage_path)}
                    alt=""
                    fill
                    className="object-contain"
                    sizes="120px"
                  />
                </div>
                <input
                  type="checkbox"
                  name="delete_image"
                  value={image.id}
                  className="absolute top-1 right-1 h-5 w-5 accent-red"
                />
              </label>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="block text-xs uppercase tracking-wide text-navy/60 mb-1">
          {existingImages && existingImages.length > 0
            ? "Add More Photos"
            : "Photos (up to 10)"}
        </label>
        <input
          type="file"
          name="photos"
          accept="image/*,.heic,.heif"
          multiple
          className="w-full border border-navy/20 px-3 py-2 text-navy file:mr-4 file:border-0 file:bg-navy file:text-cream file:px-4 file:py-2 file:uppercase file:text-xs file:font-semibold"
        />
      </div>

      <SubmitButton label={submitLabel} />
    </form>
  );
}
