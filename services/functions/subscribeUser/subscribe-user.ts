import { GetUserByEmailFn, InsertUserFn } from "@/db/user";
import { SendEmailFn } from "@/email/send-email";
import { randomUUID } from "crypto";

export class EmailInUseError extends Error {}

export async function subscribeUser(
  userData: {
    name: string;
    email: string;
  },
  ctx: {
    getUserByEmail: GetUserByEmailFn;
    insertUser: InsertUserFn;
    sendEmail: SendEmailFn;
  }
) {
  const existingUser = await ctx.getUserByEmail(userData.email);

  if (existingUser) throw new EmailInUseError();

  const user = await ctx.insertUser({
    id: randomUUID(),
    email: userData.email,
    name: userData.name,
  });

  await ctx.sendEmail({
    from: `no-reply@example.com`,
    html: `<p>welcome</p>`,
    plaintext: `welcome`,
    subject: `Welcome`,
    to: [user.email],
  });

  return user;
}
