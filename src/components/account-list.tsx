'use client'
import { Account } from "@/types/account";
import { useEffect } from "react";

export type AccountListProps = {
    accountList: Account[]
    onChange?: (account: Account) => void
    default?: number
}

export const AccountList = (props: AccountListProps) => {
    const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const account = props.accountList.find(acct => acct.id.toString() === event.target.value)
        if (!account) throw new Error("Account not found")
        if (props.onChange) props.onChange(account)
    }

    useEffect(() => {
        if(props.onChange) {
            if (!props.default) {
                props.onChange(props.accountList[0]);
            } else {
                let def = props.accountList.find(acct => acct.id === props.default)
                if(!def) console.warn("Invalid default account ID");
                def = def || props.accountList[0];
                props.onChange(def);
            }
        }
    }, [])

    return (
        <select onChange={onChange} className="text-slate-800 rounded-sm p-2" defaultValue={props.default}>
            {props.accountList.map((account) => (
                <option key={account.id} value={account.id}>{account.name}</option>
            ))}
        </select>
    )
}