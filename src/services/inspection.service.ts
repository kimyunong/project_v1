import { inspectionLogs as seed } from '@/mocks/seed';

export type InspectionLog = {
    id: number;
    equipment: string;
    startDate: string;     // 연구 시작일 (YYYY-MM-DD)
    institution: string;   // 공동활용 기관
    user: string;          // 공동활용 사용자
    useStartDate: string;  // 장비 사용 시작일
    useEndDate: string;    // 장비 사용 종료일
    registrant: string;    // 등록 작성자
    purpose: string;       // 장비 사용 목적
};

export type ListInspectionInput = {
    page: number;
    pageSize: number;
    q?: string;
    target?: '전체' | '장비' | '기관' | '사용자' | '등록자' | '목적' | '연구시작일' | '사용시작일' | '사용종료일';
};

// ---- 메모리 DB ----
let db: InspectionLog[] = seed.map(x => ({ ...x }));
let nextId = (db.length ? Math.max(...db.map(x => x.id)) : 0) + 1;

function hit(hay: string, q: string) {
    return hay.toLowerCase().includes(q.toLowerCase());
}
function matches(row: InspectionLog, q: string, target: NonNullable<ListInspectionInput['target']>) {
    const qq = (q ?? '').trim();
    if (!qq) return true;

    switch (target) {
        case '장비':       return hit(row.equipment, qq);
        case '기관':       return hit(row.institution, qq);
        case '사용자':     return hit(row.user, qq);
        case '등록자':     return hit(row.registrant, qq);
        case '목적':       return hit(row.purpose, qq);
        case '연구시작일': return hit(row.startDate, qq);
        case '사용시작일': return hit(row.useStartDate, qq);
        case '사용종료일': return hit(row.useEndDate, qq);
        case '전체':
        default:
            return (
                hit(row.equipment, qq) ||
                hit(row.institution, qq) ||
                hit(row.user, qq) ||
                hit(row.registrant, qq) ||
                hit(row.purpose, qq) ||
                hit(row.startDate, qq) ||
                hit(row.useStartDate, qq) ||
                hit(row.useEndDate, qq)
            );
    }
}

export async function listInspectionLogsPaged(input: ListInspectionInput) {
    await new Promise(r => setTimeout(r, 100));
    const { page, pageSize, q = '', target = '전체' } = input;
    const filtered = db.filter(x => matches(x, q, target));
    const start = (page - 1) * pageSize;
    return { items: filtered.slice(start, start + pageSize), total: filtered.length };
}

type CreateInspectionInput = Omit<InspectionLog, 'id'>;
export async function createInspectionLog(input: CreateInspectionInput) {
    await new Promise(r => setTimeout(r, 100));
    const row: InspectionLog = { id: nextId++, ...input };
    db.unshift(row);
    return row;
}

// 개발 편의
export function __resetInspectionForDev() {
    db = seed.map(x => ({ ...x }));
    nextId = (db.length ? Math.max(...db.map(x => x.id)) : 0) + 1;
}