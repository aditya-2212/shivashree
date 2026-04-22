import Link from "next/link";
import { Building2, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-brand-purple-100 rounded-2xl mb-6">
          <Building2 className="w-10 h-10 text-brand-purple-600" />
        </div>
        <h1 className="text-6xl font-bold text-stone-900 mb-3">404</h1>
        <h2 className="text-2xl font-semibold text-stone-700 mb-3">
          Page Not Found
        </h2>
        <p className="text-stone-500 mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or may have been
          moved. Let us help you find what you&apos;re looking for.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-brand-purple-600 hover:bg-brand-purple-700 text-white font-semibold px-6 py-3 rounded-xl transition"
          >
            Go Home
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/projects"
            className="inline-flex items-center justify-center gap-2 border border-stone-300 text-stone-700 font-semibold px-6 py-3 rounded-xl hover:bg-stone-100 transition"
          >
            View Projects
          </Link>
        </div>
      </div>
    </div>
  );
}
