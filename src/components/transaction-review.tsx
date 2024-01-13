'use client'
import { Account } from "@/types/account"
import { Dropzone } from "./dropzone"
import { useCallback, useEffect, useState } from "react"
import { AccountList } from "./account-list"
import { Transaction } from "@/types/transaction"
import { ParseTransactionCSV } from "@/util"
import { Modal } from "./modal"
import { TbCircleCheckFilled, TbCircleXFilled } from "react-icons/tb"
import { TransactionError } from "@/types/transaction-error"
import { AkauntingTransaction } from "@/types/akaunting-transaction"
import { Tooltip } from "./tooltip"
import { PacmanLoader } from "react-spinners"

export type TransactionReviewProps = {
    accounts: Account[]
}

export const TransactionReview = (props: TransactionReviewProps) => {
    const [account, setAccount] = useState<Account | null>(null)
    const [file, setFile] = useState<File | null>(null)
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [loadingModalOpen, setLoadingModalOpen] = useState<boolean>(false)
    const [busy, setBusy] = useState<boolean>(false)
    const [transactionErrors, setTransactionErrors] = useState<TransactionError[]>([])

    const onSubmit = async () => {
        if (busy) return;
        if (!account) return;
        if (!transactions) return;
        setBusy(true);

        for (const t of transactions) {
            const res = await fetch(`/api/transactions`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    transaction: t,
                    accountId: account.id,
                    companyId: account.company_id
                })
            })
            await res.json();
        }

        setBusy(false);
        setFile(null);
    }

    const checkForDuplicates = useCallback(async () => {
        setBusy(true);
        const problems: TransactionError[] = [];
        const promises = transactions.map(async (t) => {
            const res = await fetch(`/api/transactions?accountId=${account?.id}&refId=${t.reference}`, {
                method: "GET",
            })
            const data = await res.json() as { found: boolean, transactions: AkauntingTransaction[] };
            if (data.found) {
                problems.push({
                    reference: t.reference,
                    error: "Found transaction with same reference number for this account",
                    data: data.transactions
                })
            }
        })

        await Promise.allSettled(promises);
        setTransactionErrors(problems);
        setBusy(false);
    }, [transactions, account]);

    useEffect(() => {
        if (!file) {
            setTransactions([]);
            setTransactionErrors([]);
            return;
        }
        file.text().then((text) => {
            const parsed = ParseTransactionCSV(text);
            const sorted = parsed.sort((a, b) => a.order - b.order)
            setTransactions(sorted)
        })
    }, [file])

    useEffect(() => {
        if (!account) return;
        if (!transactions) return;
        checkForDuplicates();
    }, [account, transactions])

    useEffect(() => {
        busy ? setLoadingModalOpen(true) : setLoadingModalOpen(false);
    }, [busy])

    if (!file) return (
        <Dropzone onFileAccepted={(file) => setFile(file)} extensions={[".csv"]} />
    )

    return (
        <div className="flex flex-col">
            <div className="flex justify-center align-middle">
                <h4 className="flex mr-2 pt-1.5">SELECT ACCOUNT</h4>
                <AccountList
                    accountList={props.accounts}
                    onChange={(a => setAccount(a))}
                    default={2}
                />
            </div>
            <table className="table-auto bg-slate-900 border border-collapse border-slate-500 mt-5">
                <thead className="text-left pb-2 bg-slate-700 m-5">
                    <tr className="border border-collapse border-slate-500">
                        <th className="p-2 pl-5">
                            <button>
                                DATE
                            </button>
                        </th>
                        <th>DESCRIPTION</th>
                        <th>AMOUNT</th>
                        <th>BALANCE FORWARD</th>
                        <th>REF #</th>
                        <th>ISSUES</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((t) => {
                        const error = transactionErrors.find(te => te.reference === t.reference);

                        return (
                            <tr key={t.order} className="border border-collapse border-slate-500">
                                <td className="p-2 pl-5">{t.date}</td>
                                <td>{t.description}</td>
                                <td>{t.amount}</td>
                                <td>{t.balance}</td>
                                <td>{t.reference}</td>
                                <td className="pr-5">
                                    {
                                        error || busy
                                        ? <span className="text-red-500 flex justify-center text-2xl">
                                            <Tooltip
                                                content={
                                                    <div className="text-nowrap">
                                                        <p className="text-slate-100 text-base">Duplicate Transaction Ref#</p>
                                                        {
                                                            error?.data?.map((at) => (
                                                                <div key={t.reference} className="text-slate-100 text-sm border-l-2 border-solid border-slate-300 pl-2 mb-2">
                                                                    {/* This should probably be gotten directly from Akaunting, but the settings endpoint doesn't grab defaults */}
                                                                    <p className="text-slate-100 text-sm">Transaction #: TRA-{String(at.id).padStart(5, '0')}</p>
                                                                    <p className="text-slate-100 text-sm">Date: {Intl.DateTimeFormat('en-US', { dateStyle: 'short' }).format(new Date(at.paid_at))}</p>
                                                                    <p className="text-slate-100 text-sm">Amount: {at.amount_formatted}</p>
                                                                    <p className="text-slate-100 text-sm">Descr: {at.description}</p>
                                                                    <p className="text-blue-300 underline text-sm">
                                                                        <a href={`http://accounting.internal.alitz.us/${at.company_id}/banking/transactions/${at.id}`} target="_blank">
                                                                            Go to Transaction
                                                                        </a>
                                                                    </p>
                                                                </div>
                                                            ))
                                                        }
                                                    </div>
                                                }
                                                showDelay={500}
                                                hideDelay={500}
                                            >
                                                <TbCircleXFilled />
                                            </Tooltip>
                                        </span>
                                        : <span className="text-green-500 flex justify-center text-2xl"><TbCircleCheckFilled /></span>
                                    }
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>

            <div className="flex justify-center">
                <button
                    className="bg-green-700 text-slate-100 rounded-sm p-2 mt-5 disabled:bg-gray-700 disabled:text-gray-100"
                    onClick={onSubmit}
                    disabled={busy || transactionErrors.length > 0}
                >
                    SUBMIT
                </button>
                <button
                    className="bg-red-700 text-slate-100 rounded-sm p-2 mt-5 ml-2"
                    onClick={() => setFile(null)}
                >
                    CANCEL
                </button>
                <button
                    className="bg-yellow-700 text-slate-100 rounded-sm p-2 mt-5 ml-2 disabled:bg-gray-700 disabled:text-gray-100"
                    onClick={() => checkForDuplicates()}
                    disabled={busy}
                >
                    RE-RUN CHECKS
                </button>
            </div>

            <Modal
                open={loadingModalOpen}
                onClose={() => setLoadingModalOpen(false)}
            >
                <div>
                    <h2 className="text-white text-center">Working, please wait.</h2>
                    <PacmanLoader color="#ffffff" size={"5rem"} />
                </div>
            </Modal>
        </div>
    )
}