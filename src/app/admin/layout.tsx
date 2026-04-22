import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Admin — Shivashree Developers",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Login page is handled separately without the shell
  return (
    <div className="flex min-h-screen bg-stone-50">
      {session && <AdminSidebar />}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
      <Toaster
        position="top-right"
        toastOptions={{
          className: "text-sm",
          success: { duration: 3000 },
          error: { duration: 5000 },
        }}
      />
    </div>
  );
}
