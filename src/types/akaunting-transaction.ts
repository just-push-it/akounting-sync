export type AkauntingTransaction = {
    id: number;
    company_id: number;
    type: string;
    account_id: number;
    paid_at: string;
    amount: number;
    amount_formatted: string;
    currency_code: string;
    currency_rate: number;
    document_id: number;
    contact_id: number;
    description: string;
    category_id: number;
    payment_method: string;
    reference: string;
    parent_id: number;
    split_id: number;
    attachment: boolean;
    created_from: string;
    created_by: number;
    created_at: string;
    updated_at: string;
    account: any;
    category: any;
    currency: any;
    contact: any;
}