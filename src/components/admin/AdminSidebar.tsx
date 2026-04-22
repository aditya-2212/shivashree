"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Building2,
  FileText,
  HelpCircle,
  Inbox,
  Settings,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

/*
  Sidebar groupings are intentionally tiny — six items with explicit, plain
  labels so a non-technical staff member doesn't have to guess which menu
  contains which feature. The labels are tasks ("Add a project", "Reply to
  enquiries"), not jargon.
*/
const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/properties", label: "Projects", icon: Building2 },
  { href: "/admin/blog", label: "Notes & guides", icon: FileText },
  { href: "/admin/faqs", label: "FAQs", icon: HelpCircle },
  { href: "/admin/leads", label: "Enquiries", icon: Inbox },
  { href: "/admin/settings", label: "Site settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 bg-brand-purple-900 text-white min-h-screen flex flex-col">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-white/10">
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center bg-white rounded-lg p-1.5 shrink-0">
            <Image
              src="/logo.png"
              alt="Shivashree Developers"
              width={120}
              height={90}
              className="h-9 w-auto"
            />
          </span>
          <div>
            <p className="text-white font-semibold text-sm leading-tight">
              Shivashree
            </p>
            <p className="text-white/60 text-xs">Content control room</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group",
                isActive
                  ? "bg-white text-brand-purple-700"
                  : "text-white/75 hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* View Site + Sign Out */}
      <div className="px-3 py-4 border-t border-white/10 space-y-1">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/75 hover:bg-white/10 hover:text-white transition-colors text-sm font-medium"
        >
          <ExternalLink className="w-5 h-5" />
          Open live website
        </a>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/75 hover:bg-red-500/20 hover:text-red-200 transition-colors text-sm font-medium"
        >
          <LogOut className="w-5 h-5" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
