import { registerAs } from "@nestjs/config";


export const redisRegister = registerAs("redis", () => {
  console.log("ashdkagdhsßß",process.env.REDIS_HOST)
  console.log("ashdkagdhsßß",process.env.REDIS_PORT)
  const config = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  };

  return config;
});
