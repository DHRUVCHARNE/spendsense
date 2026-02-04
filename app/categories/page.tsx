import { CatHeader } from "@/components/category-table/cat-header";
import CatsPage from "@/components/category-table/cat-table";
import { redirect } from "next/navigation";
import { cachedAuth } from "@/lib/authUtils";
export default async function Home() {
  const session = await cachedAuth();

  if (!session) {
    redirect("/");
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold justify-center align-middle">Categories</h1>
        <CatHeader />
      </div>
      <div>
        <CatsPage />
      </div>
    </div>
  );
}
