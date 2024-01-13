import { Transaction } from "@/types/transaction";
import { GetAkauntingAuthHeaders, GetNextTransactionNumber } from "@/util";

// Handles GET requests to /api/transactions
export async function GET(request: Request) {
    // Get the query string parameters
    const url = new URL(request.url);
    const refId = url.searchParams.get("refId");
    const accountId = url.searchParams.get("accountId");

    const res = await fetch(
        `${process.env.AKAUNTING_URL}/transactions?search=reference:${refId}&account_id=${accountId}`,
        { headers: GetAkauntingAuthHeaders() }
    );
    const data = await res.json();

    return new Response(
        JSON.stringify({ found: data.data.length > 0, transactions: data.data }), 
        { headers: { "content-type": "application/json" },
    });
}

export async function POST(request: Request) {
    const body = await request.json() as { transaction: Transaction, accountId: number, companyId: number };

    const transactionNumber = await GetNextTransactionNumber();

    const requestUrl = new URL(`${process.env.AKAUNTING_URL}/transactions`);
    requestUrl.searchParams.append('company_id', body.companyId.toString());
    requestUrl.searchParams.append('account_id', body.accountId.toString());
    requestUrl.searchParams.append('category_id', "1"); // TODO: Make this configurable
    requestUrl.searchParams.append('reference', body.transaction.reference);
    requestUrl.searchParams.append('description', body.transaction.description);
    requestUrl.searchParams.append('type', body.transaction.amount.startsWith('-') ? "expense" : "income");
    requestUrl.searchParams.append('payment_method', "offline-payments.bank_transfer.2"); //TODO: Make this configurable
    requestUrl.searchParams.append('paid_at', body.transaction.date);
    requestUrl.searchParams.append('currency_code', "USD"); // TODO: Make this configurable
    requestUrl.searchParams.append('currency_rate', "1"); // TODO: Make this configurable
    requestUrl.searchParams.append('amount', body.transaction.amount.replace(/[$,-]/g, ''));
    requestUrl.searchParams.append('number', transactionNumber);
    
    const res = await fetch(
        requestUrl,
        { 
            method: "POST",
            headers: GetAkauntingAuthHeaders(),
        }
    );
    
    await res.json();

    return new Response(
        JSON.stringify({ success: true }), 
        { headers: { "content-type": "application/json" },
    });   
}
