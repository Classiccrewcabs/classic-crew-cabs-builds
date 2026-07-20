import { BuildForm } from "@/components/BuildForm";
import { createBuild } from "@/app/admin/actions";

export default function NewBuildPage() {
  return (
    <div>
      <h1 className="text-xl font-bold uppercase tracking-wide text-navy mb-8">
        Add New Build
      </h1>
      <BuildForm action={createBuild} submitLabel="Create Build" />
    </div>
  );
}
