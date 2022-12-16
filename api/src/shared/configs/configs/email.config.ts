import { registerAs } from "@nestjs/config";


export const emailRegister = registerAs("email", () => {
  const emailConfig = {
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL_LOGIN,
      pass: process.env.GMAIL_PASS
    }
  };

  return emailConfig;
});

export class EmailConfig {
  static from: "Pawfect";
}
