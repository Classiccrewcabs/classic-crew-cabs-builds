import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BuildForm } from "@/components/BuildForm";
import { updateBuild } from "@/app/admin/actions";
import type { BuildWithImages } from "@/lib/types";

export default async function EditBuildPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: build } = await supabase
    .from("builds")
    .select("*, build_images!build_images_build_id_fkey(*)")
    .eq("id", id)
    .maybeSingle<BuildWithImages>();

  if (!build) notFound();

  const sortedImages = [...build.build_images].sort(
    (a, b) => a.sort_order - b.sort_order
  );

  const updateBuildWithId = updateBuild.bind(null, build.id);

  return (
    <div>
      <h1 className="text-xl font-bold uppercase tracking-wide text-navy mb-8">
        Edit Build
      </h1>
      <BuildForm
        action={updateBuildWithId}
        build={build}
        existingImages={sortedImages}
        submitLabel="Save Changes"
      />
    </div>
  );
}
