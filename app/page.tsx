import LandingPage from "@/components/LandingPage";
import { TxnHeader } from "@/components/txn-table/txn-header";
import TxnsPage from "@/components/txn-table/txn-table";
import { cachedAuth } from "@/lib/authUtils";
import RateLimitToast from "@/components/RateLimitToast";
export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {

  const session = await cachedAuth();
  // ✅ unwrap searchParams
  const params = await searchParams ?? {};

  const error =
    typeof params.error === "string"
      ? params.error
      : Array.isArray(params.error)
        ? params.error[0]
        : undefined

  const remaining =
    typeof params.remaining === "string" ? Number(params.remaining) : undefined

  const reset =
    typeof params.reset === "string" ? Number(params.reset) : undefined



  return (
    <>
       <RateLimitToast error={error} remaining={remaining} reset={reset} />
      {
        !session ? (<LandingPage />) : (<div className="p-6 space-y-6">
          {/* Header Row */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold justify-center align-middle">Transactions</h1>
            <TxnHeader />
          </div>
          <div>
            <TxnsPage />
          </div>
        </div>)
      }

    </>
  );
}
