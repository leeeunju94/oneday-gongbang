// 회원 로그인 도우미 — 공개 키는 /api/auth-config에서 받아 온다(파일에 값을 적지 않는다)
const TOKEN_KEY = 'gongbang-member-token';
const Auth = {
  _cfg: null,
  async cfg() {
    if (this._cfg) return this._cfg;
    const r = await fetch('/api/auth-config');
    const d = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(d.error || '로그인 준비를 하지 못했어요. 잠시 뒤 다시 시도해 주세요.');
    return (this._cfg = d);
  },
  async call(path, body, token) {
    const { url, key } = await this.cfg();
    const r = await fetch(`${url}/auth/v1/${path}`, {
      method: 'POST',
      headers: { apikey: key, 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: body ? JSON.stringify(body) : undefined,
    });
    const d = await r.json().catch(() => ({}));
    return { ok: r.ok, status: r.status, data: d };
  },
  token() { try { return sessionStorage.getItem(TOKEN_KEY) || ''; } catch { return ''; } },
  save(t) { try { t ? sessionStorage.setItem(TOKEN_KEY, t) : sessionStorage.removeItem(TOKEN_KEY); } catch {} },
};
function showMsg(el, text, ok) { el.className = 'msg ' + (ok ? 'ok' : 'err'); el.textContent = text; }
