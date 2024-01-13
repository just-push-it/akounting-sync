import { AkauntingTransaction } from "./akaunting-transaction";

export type TransactionError = {
    reference: string;
    error: string;
    data: AkauntingTransaction[];
}