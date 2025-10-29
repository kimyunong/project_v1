import {notices as seed} from "@/mocks/seed";
import type {Page} from "@/types/common";

export type Notice = {
    id: number;
    title: string;
    author: string;
    date: string;
    views: number;
    category: '공지' | '자료' | '보고서';
    content?: string;
};

export type ListNoticesInput = {
    page?: number;
    pageSize?: number;
    q?: string;
    target?: '전체' | '제목' | '내용' | '작성자';
};

function sleep(ms = 160) {
    return new Promise(r => setTimeout(r, ms));
}

// 내부 상태: seed를 메모리 상에서 조작
let store: Notice[] = (seed as Notice[]).map(n => ({content: '', ...n}));

export async function listNotices({
                                      page = 1, pageSize = 10, q = '', target = '전체'
                                  }: ListNoticesInput = {}): Promise<Page<Notice>> {
    await sleep();

    // 필터링
    const keyword = q.trim();
    let filtered = store;

    if (keyword) {
        const hit = (n: Notice) => {
            const t = (s?: string) => (s ?? '').toLowerCase();
            const key = keyword.toLowerCase();

            if (target === '제목') return t(n.title).includes(key);
            if (target === '내용') return t(n.content).includes(key);
            if (target === '작성자') return t(n.author).includes(key);
            // 전체
            return [n.title, n.author, n.content ?? ''].some(v => (v ?? '').toLowerCase().includes(key));
        };
        filtered = store.filter(hit);
    }

    // 정렬(최신순 가정: id DESC 또는 date DESC)
    filtered = filtered.slice().sort((a, b) => b.id - a.id);

    // 페이징
    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const items = filtered.slice(start, start + pageSize);

    return {items, page, pageSize, total};
}


export async function getNotice(id: number): Promise<Notice | undefined> {
    await sleep();
    return store.find(n => n.id === id);
}

export async function increaseViews(id: number): Promise<void> {
    await sleep(60);
    const idx = store.findIndex(n => n.id === id);
    if (idx >= 0) store[idx] = {...store[idx], views: store[idx].views + 1};
}

export type CreateNoticeInput = Omit<Notice, 'id' | 'views'>;

export async function createNotice(input: CreateNoticeInput): Promise<Notice> {
    await sleep();
    const n: Notice = {
        id: Date.now(),
        views: 0,
        content: '',
        ...input
    };
    store = [n, ...store];
    return n;
}
