import { ApiResponse } from "@/types/api-response";
import { Account } from "@/types/account";
import { TransactionReview } from "@/components/transaction-review";
import { GetAkauntingAuthHeaders } from "@/util";

export default async function Home() {
  const accounts = (await getAccountList()).data;
  
  return (
    <main className="flex min-h-screen flex-col items-center pt-5">
      <header className="flex flex-col items-center justify-center mb-10">
        <h1 className="text-4xl font-bold text-slate-100">Akounting Sync</h1>
        <p className="text-slate-100">Sync GTE Transaction Records with Akounting</p>
      </header>
      <div className="container">
        <TransactionReview accounts={accounts} />
      </div>
    </main>
  )
}

async function getAccountList() {
  // Base64 encode the user and password separated by a colon
  //console.log(process.env.AKOUNTING_USER + ':' + process.env.AKOUNTING_PASSWORD)
  const res = await fetch(
      `${process.env.AKAUNTING_URL}/accounts?limit=1000`,
      { headers: GetAkauntingAuthHeaders() }
  )

  return await res.json() as ApiResponse<Account>;
}
