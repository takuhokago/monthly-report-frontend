import { http, HttpResponse } from 'msw';

/**
 * モックユーザー台帳（必要に応じて追加）
 * - ログインID: code
 * - パスワード: password
 * - role は AuthService.isAdmin() の実装に合わせて 'ADMIN' or '管理者' を返す
 */
const users = [
  {
    code: '1234',
    name: '田中 太郎',
    role: 'ADMIN',
    department: '営業部',
    password: 'pass',
  },
  {
    code: '5678',
    name: '山田 花子',
    role: '一般',
    department: '開発部',
    password: 'pass',
  },
  {
    code: '9999',
    name: '管理 次郎',
    role: '管理者',
    department: '総務部',
    password: 'pass',
  },
] as const;

/**
 * 簡易トークン→ユーザーの対応表（SWプロセス内メモリ）
 * - Cookie "access_token" の値をキーに、ユーザー情報を引く
 */
const sessionTable = new Map<string, { code: string }>();

// トークン生成（雑でOK：モック用）
const makeToken = (code: string) => `mock-token-${code}-${Date.now()}`;

// Cookie の名前（AuthService 側は Cookie を直接読まないが、withCredentials で保持される）
const COOKIE_NAME = 'access_token';

// Cookie 失効ヘッダ（ログアウト用）
const expireCookie = `${COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax`;

export const handlers = [
  // POST /api/auth/login
  http.post('/api/auth/login', async ({ request }) => {
    type LoginRequest = { code: string; password: string };
    const body = (await request.json()) as LoginRequest | null;

    if (!body?.code || !body?.password) {
      return HttpResponse.json({ message: 'Bad Request' }, { status: 400 });
    }

    const found = users.find(
      (u) => u.code === body.code && u.password === body.password
    );
    if (!found) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // トークン発行 & セッション表に登録
    const token = makeToken(found.code);
    sessionTable.set(token, { code: found.code });

    // Cookie 付与（SameSite=Lax なので withCredentials で同一オリジンなら送出される）
    // ※必要に応じて Secure を付ける（httpsのみ）。開発中は省略可。
    const setCookie = `${COOKIE_NAME}=${token}; Path=/; Max-Age=86400; SameSite=Lax`;

    // フロントに返すレスポンス（あなたの LoginResponse に合わせて調整）
    const loginResponse = {
      code: found.code,
      name: found.name,
      role: found.role, // 'ADMIN' or '管理者' のどちらかにしてある
      departmentName: found.department,
      token, // 使わないなら削ってOK
    };

    return new HttpResponse(JSON.stringify(loginResponse), {
      status: 200,
      headers: { 'Set-Cookie': setCookie, 'Content-Type': 'application/json' },
    });
  }),

  // GET /api/auth/me
  http.get('/api/auth/me', ({ cookies }) => {
    const token = cookies[COOKIE_NAME];
    if (!token) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const session = sessionTable.get(token);
    if (!session) {
      return HttpResponse.json(
        { message: 'Unauthorized' },
        { status: 401, headers: { 'Set-Cookie': expireCookie } }
      );
    }

    const user = users.find((u) => u.code === session.code);
    if (!user) {
      return HttpResponse.json(
        { message: 'Unauthorized' },
        { status: 401, headers: { 'Set-Cookie': expireCookie } }
      );
    }

    // LoginResponse と同じ形で返す（AuthService.fetchMe() が set する）
    const meResponse = {
      code: user.code,
      name: user.name,
      role: user.role,
      departmentName: user.department,
      token: token, // 使わないなら削除OK
    };

    return HttpResponse.json(meResponse, { status: 200 });
  }),

  // POST /api/auth/logout
  http.post('/api/auth/logout', async ({ cookies }) => {
    const token = cookies[COOKIE_NAME];
    if (token) sessionTable.delete(token);

    // AuthService.logout() は responseType: 'text' なので text/plain を返す
    return new HttpResponse('OK', {
      status: 200,
      headers: {
        'Set-Cookie': expireCookie,
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  }),
];
