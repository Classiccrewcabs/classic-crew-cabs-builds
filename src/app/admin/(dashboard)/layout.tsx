import Link from "next/link";
import { signOut } from "@/app/admin/actions";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="border-b border-navy/10 bg-white px-6 py-4 sm:px-10 flex items-center justify-between">
        <Link
          href="/admin"
          className="font-bold uppercase tracking-wide text-navy"
        >
          Admin Dashboard
        </Link>
        <form action={signOut}>
          <button
            type="submit"
            className="text-xs font-semibold uppercase tracking-wide text-navy/60 hover:text-navy"
          >
            Log Out
          </button>
        </form>
      </div>
      <div className="px-6 py-10 sm:px-10 lg:px-16">{children}</div>
    </div>
  );
}
