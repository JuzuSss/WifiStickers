import { SignJWT, jwtVerify } from 'jose';

export const ADMIN_COOKIE = 'wifi_admin_session';

function getSecret() {
  return new TextEncoder().encode(
    process.env.JWT_SECRET || 'default-dev-secret-change-in-production'
  );
}

export async function signAdminToken() {
  return new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getSecret());
}

export async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, getSecret());
    return true;
  } catch {
    return false;
  }
}
