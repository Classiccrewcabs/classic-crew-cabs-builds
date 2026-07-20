"use client";

import { deleteBuild } from "@/app/admin/actions";

export function DeleteBuildForm({
  buildId,
  label,
}: {
  buildId: string;
  label: string;
}) {
  return (
    <form
      action={deleteBuild}
      onSubmit={(e) => {
        if (!confirm(`Delete "${label}"? This can't be undone.`)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="build_id" value={buildId} />
      <button
        type="submit"
        className="text-xs font-semibold uppercase tracking-wide text-red hover:text-red-dark"
      >
        Delete
      </button>
    </form>
  );
}
