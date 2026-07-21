"use client";

import { useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import Image from "next/image";
import { buildImageUrl } from "@/lib/image-url";
import type { Build, BuildImage } from "@/lib/types";

function isHeicFile(file: File) {
  return /image\/hei[cf]/i.test(file.type) || /\.hei[cf]$/i.test(file.name);
}

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
  const [heicFiles, setHeicFiles] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    setHeicFiles(files.filter(isHeicFile).map((f) => f.name));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const files = Array.from(fileInputRef.current?.files ?? []);
    const heic = files.filter(isHeicFile);
    if (heic.length > 0) {
      e.preventDefault();
      alert(
        `These photos are HEIC format and can't be uploaded yet:\n\n${heic
          .map((f) => f.name)
          .join(
            "\n"
          )}\n\nConvert them to JPG first, then remove them from the file picker and try again.\n\nTip: On iPhone, go to Settings > Camera > Formats > Most Compatible, and new photos will save as JPG automatically.`
      );
    }
  }

  return (
    <form action={action} onSubmit={handleSubmit} className="max-w-3xl space-y-8">
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
          ref={fileInputRef}
          type="file"
          name="photos"
          accept="image/*,.heic,.heif"
          multiple
          onChange={handleFileChange}
          className="w-full border border-navy/20 px-3 py-2 text-navy file:mr-4 file:border-0 file:bg-navy file:text-cream file:px-4 file:py-2 file:uppercase file:text-xs file:font-semibold"
        />
        {heicFiles.length > 0 && (
          <p className="text-red text-sm mt-2">
            These are HEIC files and won&apos;t upload yet: {heicFiles.join(", ")}
            . Convert to JPG first (see tip below).
          </p>
        )}
        <p className="text-xs text-navy/50 mt-2">
          Tip: iPhone photos are often saved as HEIC. To have new photos save
          as JPG automatically, go to iPhone Settings &rarr; Camera &rarr;
          Formats &rarr; Most Compatible.
        </p>
      </div>

      <SubmitButton label={submitLabel} />
    </form>
  );
}
