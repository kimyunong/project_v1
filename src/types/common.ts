export type ID = string | number;

export type Page<T> ={
    items: T[];
    page: number;
    pageSize: number;
    total: number;
}

export type DateISO = string