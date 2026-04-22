"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit2, Eye, EyeOff, Trash2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface Props {
  id: number;
  slug: string;
  isPublished: boolean;
}

export default function PropertyListActions({ id, slug, isPublished }: Props) {
  const router = useRouter();
  const [publishing, setPublishing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const togglePublish = async () => {
    setPublishing(true);
    try {
      const res = await fetch(`/api/admin/properties/${id}/publish`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !isPublished }),
      });
      if (!res.ok) throw new Error();
      toast.success(isPublished ? "Property unpublished" : "Property published");
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setPublishing(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/properties/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      toast.success("Property deleted");
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-1 shrink-0">
        <Link
          href={`/admin/properties/${id}/edit`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition"
        >
          <Edit2 className="w-3.5 h-3.5" />
          Edit
        </Link>

        <button
          onClick={togglePublish}
          disabled={publishing}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition ${
            isPublished
              ? "text-brand-purple-600 hover:bg-brand-purple-50"
              : "text-green-700 hover:bg-green-50"
          }`}
        >
          {publishing ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : isPublished ? (
            <EyeOff className="w-3.5 h-3.5" />
          ) : (
            <Eye className="w-3.5 h-3.5" />
          )}
          {isPublished ? "Unpublish" : "Publish"}
        </button>

        <button
          onClick={() => setShowConfirm(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Delete
        </button>
      </div>

      {/* Confirmation modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-stone-900 mb-2">
              Delete this property?
            </h3>
            <p className="text-stone-500 text-sm mb-6">
              This will permanently remove the property listing and all its
              content. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-2 border border-stone-300 text-stone-700 rounded-lg text-sm font-medium hover:bg-stone-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
