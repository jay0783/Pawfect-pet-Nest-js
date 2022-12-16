import { isEmpty } from "class-validator";
import { ExtractJwt, StrategyOptions } from "passport-jwt";
import { registerAs } from "@nestjs/config";
import { JwtModuleOptions } from "@nestjs/jwt";

import { InvalidEnvException } from "@pawfect/exceptions";


export const jwtConfigRegister = registerAs("jwt", () => {
  if (!process.env.JWT_SECRET || isEmpty(process.env.JWT_SECRET)) {
    throw new InvalidEnvException();
  }

  if (!process.env.JWT_REFRESH_SECRET || isEmpty(process.env.JWT_REFRESH_SECRET)) {
    throw new InvalidEnvException();
  }

  const jwtConfig: AppJwtConfig = {
    refreshOptions: {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d'
    },
    moduleOptions: {
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: "3h",
        subject: "pawfect"
      }
    },
    passportOptions: {
      secretOrKey: process.env.JWT_SECRET,
      ignoreExpiration: true,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    }
  };
  return jwtConfig;
});

export interface AppJwtConfig {
  refreshOptions: { secret: string; expiresIn: string; };
  moduleOptions: JwtModuleOptions;
  passportOptions: StrategyOptions;
}
