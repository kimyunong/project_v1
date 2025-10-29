export type User = {
    id: string;
    pw: string;
};

const KEY = 'app_user';

export function getUser(): User | null {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw) as User;
    } catch {
        return null;
    }
}

export function login(user: User) {
    localStorage.setItem(KEY, JSON.stringify(user));
}

export function logout() {
    localStorage.removeItem(KEY);
}