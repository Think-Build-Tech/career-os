import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'crypto';

export interface AuthTokenPayload {
  sub: string;
  role: string;
  tenantId?: string;
  exp: number;
}

function secret(): string {
  const value = process.env['AUTH_TOKEN_SECRET'];
  if (!value || value.length < 32) {
    throw new Error('AUTH_TOKEN_SECRET must be configured with at least 32 characters');
  }
  return value;
}

function encode(value: string): string {
  return Buffer.from(value).toString('base64url');
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `scrypt$${salt}$${hash}`;
}

export function verifyPassword(password: string, encodedHash: string): boolean {
  const [algorithm, salt, expectedHex] = encodedHash.split('$');
  if (algorithm !== 'scrypt' || !salt || !expectedHex) return false;
  const expected = Buffer.from(expectedHex, 'hex');
  const actual = scryptSync(password, salt, expected.length);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export function issueToken(payload: Omit<AuthTokenPayload, 'exp'>): string {
  const body: AuthTokenPayload = { ...payload, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 8 };
  const encoded = encode(JSON.stringify(body));
  const signature = createHmac('sha256', secret()).update(encoded).digest('base64url');
  return `${encoded}.${signature}`;
}

export function verifyToken(token: string): AuthTokenPayload {
  const [encoded, signature] = token.split('.');
  if (!encoded || !signature) throw new Error('Invalid authentication token');
  const expected = createHmac('sha256', secret()).update(encoded).digest('base64url');
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (actualBuffer.length !== expectedBuffer.length || !timingSafeEqual(actualBuffer, expectedBuffer)) {
    throw new Error('Invalid authentication token');
  }
  const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as AuthTokenPayload;
  if (!payload.sub || !payload.role || payload.exp <= Math.floor(Date.now() / 1000)) {
    throw new Error('Authentication token expired');
  }
  return payload;
}
