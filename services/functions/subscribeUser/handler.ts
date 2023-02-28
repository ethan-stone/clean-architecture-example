import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { insertUser } from "@/db/user";
import { sendEmail } from "@/email/send-email";
import { badRequest } from "@/http/responses-400";
import { ok } from "@/http/responses-200";
import { subscribeUser } from "./subscribe-user";
import { z } from "zod";

const bodySchema = z.object({
  email: z.string(),
  name: z.string(),
});

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const bodyResult = await bodySchema.spa(JSON.parse(event.body || "{}"));

  if (!bodyResult.success) {
    return badRequest("Invalid request body");
  }

  const user = await subscribeUser(
    {
      email: bodyResult.data.email,
      name: bodyResult.data.name,
    },
    {
      insertUser,
      sendEmail,
    }
  );

  return ok(user);
};
