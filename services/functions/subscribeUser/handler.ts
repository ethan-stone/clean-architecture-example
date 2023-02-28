import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { getUserByEmail, insertUser } from "@/db/user";
import { sendEmail } from "@/email/send-email";
import { badRequest } from "@/http/responses-400";
import { ok } from "@/http/responses-200";
import { EmailInUseError, subscribeUser } from "./subscribe-user";
import { z } from "zod";
import { internalError } from "@/http/responses-500";

const bodySchema = z.object({
  email: z.string(),
  name: z.string(),
});

export const main: APIGatewayProxyHandlerV2 = async (event) => {
  const bodyResult = await bodySchema.spa(JSON.parse(event.body || "{}"));

  if (!bodyResult.success) {
    return badRequest("Invalid request body");
  }

  try {
    const user = await subscribeUser(
      {
        email: bodyResult.data.email,
        name: bodyResult.data.name,
      },
      {
        getUserByEmail,
        insertUser,
        sendEmail,
      }
    );

    return ok(user);
  } catch (error) {
    if (error instanceof EmailInUseError) {
      return badRequest(
        `The email ${bodyResult.data.email} is already in use.`
      );
    }
    return internalError();
  }
};
