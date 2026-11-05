import { CanActivate, ExecutionContext, Injectable, ForbiddenException, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";
import { AuthService } from "./auth.service";
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly auth: AuthService) {}
  canActivate(context: ExecutionContext) { const req = context.switchToHttp().getRequest<Request>(); const header = req.headers.authorization; if (!header?.startsWith("Bearer ")) throw new UnauthorizedException(); const user = this.auth.verify(header.slice(7)); if (!user.email) throw new ForbiddenException(); (req as Request & { user: typeof user }).user = user; return true; }
}
