import { SetMetadata, UseGuards, applyDecorators } from "@nestjs/common";
import { Role } from "../../common/enums/rol.enum";
import { Roles } from "./roles.decorator";
import { AuthGuard } from "../guard/auth.guard";
import { RolesGuard } from "../guard/roles.guard";

export function Auth(roles: Role | Role[]) {
    const roleList = Array.isArray(roles) ? roles : [roles];
    return applyDecorators(
        Roles (...roleList),
        UseGuards(AuthGuard, RolesGuard)
    )
}