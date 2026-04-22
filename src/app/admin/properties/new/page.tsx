import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import PropertyForm from "@/components/admin/PropertyForm";

export default async function NewPropertyPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <nav className="text-sm text-stone-400 mb-1">
          <a href="/admin/properties" className="hover:text-stone-600">
            Properties
          </a>{" "}
          / New Property
        </nav>
        <h1 className="text-2xl font-bold text-stone-900">Add New Property</h1>
        <p className="text-stone-500 text-sm mt-1">
          Fill in the details below. You can save as a draft and publish when
          ready.
        </p>
      </div>

      <PropertyForm mode="create" />
    </div>
  );
}
