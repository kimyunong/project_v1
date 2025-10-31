export type PartType = 'SparePart' | 'Store';
export const partTypes = ['SparePart', 'Store'] as const satisfies readonly PartType[];

export type Part = {
    id: number;
    name: string;
    partNo: string;
    equipment: string;
    type: PartType;
    unitPrice: number;
    totalQty: number;
    usedQty: number;
    remainQty: number;
    firstShipDate: string; // YYYY-MM-DD
};

export type ListPartsInput = {
    page: number;
    pageSize: number;
    q?: string;
    target?: '전체' | '부속품명' | '장비' | '유형' | '파트번호';
};

const toPartType = (v: string): PartType =>
    v === 'SparePart' ? 'SparePart' : 'Store';

// ---- seed (새로고침 시 초기화) ----
import { parts as seed } from '@/mocks/seed';

// 메모리 DB
let db: Part[] = seed.map(p => ({
    ...p,
    type: toPartType(String(p.type)),
}));
let nextId = (db.length ? Math.max(...db.map(p => p.id)) : 0) + 1;

function matches(p: Part, q: string, target: ListPartsInput['target']) {
    const qq = q.trim().toLowerCase();
    if (!qq) return true;

    const hit = (s: string) => s.toLowerCase().includes(qq);
    switch (target) {
        case '부속품명': return hit(p.name);
        case '장비':     return hit(p.equipment);
        case '유형':     return hit(p.type);
        case '파트번호': return hit(p.partNo);
        case '전체':
        default:
            return hit(p.name) || hit(p.equipment) || hit(p.type) || hit(p.partNo);
    }
}

export async function listPartsPaged(input: ListPartsInput): Promise<{ items: Part[]; total: number }> {
    await new Promise(r => setTimeout(r, 100));
    const { page, pageSize, q = '', target = '전체' } = input;
    const filtered = db.filter(p => matches(p, q, target));
    const total = filtered.length;
    const start = (page - 1) * pageSize;
    return { items: filtered.slice(start, start + pageSize), total };
}

type CreatePartInput = Omit<Part, 'id' | 'remainQty'> & { remainQty?: number };
export async function createPart(input: CreatePartInput) {
    await new Promise(r => setTimeout(r, 100));
    const remainQty = input.remainQty ?? Math.max(0, input.totalQty - input.usedQty);
    const row: Part = { id: nextId++, remainQty, ...input };
    db.unshift(row);
    return row;
}

// (옵션) 수량 수정
export async function updatePartQty(id: number, usedQty: number, totalQty?: number) {
    await new Promise(r => setTimeout(r, 80));
    db = db.map(p =>
        p.id === id
            ? {
                ...p,
                totalQty: totalQty ?? p.totalQty,
                usedQty,
                remainQty: Math.max(0, (totalQty ?? p.totalQty) - usedQty),
            }
            : p
    );
    return db.find(p => p.id === id) ?? null;
}




