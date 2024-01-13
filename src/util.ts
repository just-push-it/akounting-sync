import { AkauntingSetting } from "./types/akaunting-setting";
import { ApiResponseSingle } from "./types/api-response";
import { Transaction } from "./types/transaction";

export function ParseTransactionCSV(data: string): Transaction[] {
    const lines = data.split('\n');
    const transactions: Transaction[] = [];
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        const values = line.split(',"').map(v => v.trim().replace(/^"|"$/g, ''));
        if (values.length < 6) continue;
        transactions.push({
            order: parseInt(values[0]),
            date: values[1],
            description: values[2].trim(),
            amount: values[3],
            balance: values[4],
            reference: values[5],
        });
    }

    return transactions;
}

export function GetAkauntingAuthHeaders(contentType?: string): { [key: string]: string } {
    return {
        'Authorization': 'Basic ' + btoa(process.env.AKAUNTING_USER + ':' + process.env.AKAUNTING_PASSWORD),
        'content-type': contentType ? contentType : 'application/json'
    }
}

export async function GetAkauntingSetting(key: string) {
    const res = await fetch(
        `${process.env.AKAUNTING_URL}/settings/${key}`,
        { headers: GetAkauntingAuthHeaders() }
    );
    const data = await res.json() as ApiResponseSingle<AkauntingSetting>;
    return data.data.value;
}

export async function GetNextTransactionNumber() {
    //const prefix = await GetAkauntingSetting(companyId, 'transaction.number_prefix');
    const prefix = "TRA-"; // Not set in DB and API does not grab default value
    
    const next = await GetAkauntingSetting('transaction.number_next');

    const digits = 5 // Not set in DB and API does not grab default value

    const number = next.padStart(digits, '0');
    const transactionNumber = prefix + number;

    return transactionNumber;
}