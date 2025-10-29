import { operationLogs as seed } from '@/mocks/seed';

export type OperationLog = {
    id: number;
    equipment: string;
    startDate: string; // YYYY-MM-DD
    endDate: string;   // YYYY-MM-DD
    useTime: string;   // '45h' 같은 문자열
    activity: string;  // 활동 내역
    actualUser: string;// 실사용자
};

export type ListOperationInput = {
    page: number;
    pageSize: number;
    q?: string;
    target?: '전체' | '장비' | '사용자' | '활동' | '연구시작일' | '연구종료일' | '시간';
};

// ---- 메모리 DB ----
let db: OperationLog[] = seed.map(x => ({ ...x }));
let nextId = (db.length ? Math.max(...db.map(x => x.id)) : 0) + 1;

function hit(hay: string, q: string) {
    return hay.toLowerCase().includes(q.toLowerCase());
}
function matches(row: OperationLog, q: string, target: NonNullable<ListOperationInput['target']>) {
    const qq = (q ?? '').trim();
    if (!qq) return true;

    switch (target) {
        case '장비':       return hit(row.equipment, qq);
        case '사용자':     return hit(row.actualUser, qq);
        case '활동':       return hit(row.activity, qq);
        case '연구시작일': return hit(row.startDate, qq);
        case '연구종료일': return hit(row.endDate, qq);
        case '시간':       return hit(row.useTime, qq);
        case '전체':
        default:
            return (
                hit(row.equipment, qq) ||
                hit(row.actualUser, qq) ||
                hit(row.activity, qq) ||
                hit(row.startDate, qq) ||
                hit(row.endDate, qq) ||
                hit(row.useTime, qq)
            );
    }
}

export async function listOperationLogsPaged(input: ListOperationInput) {
    await new Promise(r => setTimeout(r, 100));
    const { page, pageSize, q = '', target = '전체' } = input;
    const filtered = db.filter(x => matches(x, q, target));
    const start = (page - 1) * pageSize;
    return { items: filtered.slice(start, start + pageSize), total: filtered.length };
}

type CreateOperationInput = Omit<OperationLog, 'id'>;
export async function createOperationLog(input: CreateOperationInput) {
    await new Promise(r => setTimeout(r, 100));
    const row: OperationLog = { id: nextId++, ...input };
    db.unshift(row);
    return row;
}

// 개발 편의
export function __resetOperationForDev() {
    db = seed.map(x => ({ ...x }));
    nextId = (db.length ? Math.max(...db.map(x => x.id)) : 0) + 1;
}