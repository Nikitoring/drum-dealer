import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "crypto";

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}
  private secret() { return process.env.JWT_SECRET ?? "development-secret-change-me"; }
  hashPassword(password: string) { const salt = randomBytes(16).toString("hex"); return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`; }
  verifyPassword(password: string, stored: string) { const [salt, hash] = stored.split(":"); if (!salt || !hash) return false; const actual = scryptSync(password, salt, 64); return timingSafeEqual(actual, Buffer.from(hash, "hex")); }
  sign(payload: Record<string, string>) { const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url"); const body = Buffer.from(JSON.stringify({ ...payload, exp: Math.floor(Date.now() / 1000) + Number(process.env.JWT_EXPIRES_SECONDS ?? 86400) })).toString("base64url"); const signature = createHmac("sha256", this.secret()).update(`${header}.${body}`).digest("base64url"); return `${header}.${body}.${signature}`; }
  verify(token: string) { try { const [header, body, signature] = token.split("."); const expected = createHmac("sha256", this.secret()).update(`${header}.${body}`).digest("base64url"); if (!signature || signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) throw new Error(); const data = JSON.parse(Buffer.from(body, "base64url").toString()); if (data.exp < Date.now() / 1000) throw new Error(); return data as { sub: string; email: string }; } catch { throw new UnauthorizedException("Недействительный токен"); } }
  async login(email: string, password: string) { const admin = await this.prisma.admin.findUnique({ where: { email } }); if (!admin || !this.verifyPassword(password, admin.passwordHash)) throw new UnauthorizedException("Неверный email или пароль"); return { accessToken: this.sign({ sub: admin.id, email: admin.email }), tokenType: "Bearer", expiresIn: Number(process.env.JWT_EXPIRES_SECONDS ?? 86400), admin: { id: admin.id, email: admin.email } }; }
}
