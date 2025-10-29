import {equipment as seed} from '@/mocks/seed';
import {Page} from "@/types/common";

export type Equipment = {
    id: number
    name: string
    status: 'active' | 'standby' | 'inactive'
    usage: number
    remaining: string
    lastCheck: string
}

export type ListEquipmentInput = {
    page?: number;
    pageSize?: number;
    q?: string;
    target?: '전체' | '장비명' | '상태';
};

function sleep(ms = 160) {
    return new Promise(r => setTimeout(r, ms));
}

// 메모리 스토어 (seed 복사)
let store: Equipment[] = (seed as Equipment[]).map(e => ({ ...e }));

export async function listEquipmentPaged({
                                             page = 1, pageSize = 10, q = '', target = '전체',
                                         }: ListEquipmentInput = {}): Promise<Page<Equipment>> {
    await sleep();

    const key = q.trim().toLowerCase();
    let rows = store.slice();

    if (key) {
        rows = rows.filter(e => {
            if (target === '장비명') return e.name.toLowerCase().includes(key);
            if (target === '상태')   return e.status.toLowerCase().includes(key);
            return [e.name, e.status].some(v => String(v).toLowerCase().includes(key));
        });
    }

    // 최신순 가정: id DESC
    rows.sort((a, b) => b.id - a.id);

    const total = rows.length;
    const start = (page - 1) * pageSize;
    const items = rows.slice(start, start + pageSize);

    return { items, page, pageSize, total };
}

export async function createEquipment(input: Omit<Equipment, 'id'>): Promise<Equipment> {
    await sleep();
    const row: Equipment = { id: Date.now(), ...input };
    store = [row, ...store];
    return row;
}

export async function updateEquipmentStatus(
    id: number,
    status: Equipment['status'],
): Promise<void> {
    await sleep(120);
    const idx = store.findIndex(e => e.id === id);
    if (idx >= 0) store[idx] = { ...store[idx], status };
}

export async function updateEquipment(
    id: number,
    patch: Partial<Omit<Equipment, 'id'>>,
): Promise<void> {
    await sleep(120);
    const idx = store.findIndex(e => e.id === id);
    if (idx >= 0) store[idx] = { ...store[idx], ...patch };
}

