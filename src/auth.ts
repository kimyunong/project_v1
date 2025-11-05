export type User = {
    id: string;
    pw: string;
};

const KEY = 'app_user'; // 로컬 저장 name

export function getUser(): User | null {
    const user = localStorage.getItem(KEY);
    if (!user) return null;
    try {
        return JSON.parse(user) as User; // 객체 변환
    } catch {
        return null;
    }
}

export function login(user: User) {
    localStorage.setItem(KEY, JSON.stringify(user)); //문자열 변환 로컬스토리지에 저장
}

export function logout() {
    localStorage.removeItem(KEY);
}