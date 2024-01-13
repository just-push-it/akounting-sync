export type ApiResponse<T> = {
    data: T[]
    link: {
        first: string
        last: string
        prev: string | null
        next: string | null
    },
    meta: {
        current_page: number
        from: number
        last_page: number
        links: {
            url: string | null
            label: string
            active: boolean
        }[]
        path: string
        per_page: number
        to: number
        total: number
    }
}

export type ApiResponseSingle<T> = {
    data: T
}