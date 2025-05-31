function parseToken(tokenStr: string): { id: number | null; expired: boolean } {
  if (!tokenStr) return { id: null, expired: true };

  try {
    const base64Url = tokenStr.split('.')[1];
    if (!base64Url) return { id: null, expired: true };

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    const payload = JSON.parse(jsonPayload);

    const now = Math.floor(Date.now() / 1000);
    const exp = typeof payload.exp === 'number' ? payload.exp : 0;
    const expired = exp < now;

    // Verifica user_id ou id
    const id =
      typeof payload.user_id === 'number'
        ? payload.user_id
        : typeof payload.id === 'number'
        ? payload.id
        : null;

    return { id, expired };
  } catch (e) {
    return { id: null, expired: true };
  }
}

export default parseToken;
