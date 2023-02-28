import { InsertUserFn } from "@/db/user";
import { sendEmail, SendEmailFn } from "@/email/send-email";
import { randomUUID } from "crypto";

export async function subscribeUser(
  userData: {
    name: string;
    email: string;
  },
  ctx: { insertUser: InsertUserFn; sendEmail: SendEmailFn }
) {
  const user = await ctx.insertUser({
    id: randomUUID(),
    email: userData.email,
    name: userData.name,
  });

  await sendEmail({
    from: `no-reply@example.com`,
    html: `<p>welcome</p>`,
    plaintext: `welcome`,
    subject: `Welcome`,
    to: [user.email],
  });

  return user;
}
