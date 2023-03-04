import { SendEmailCommand } from "@aws-sdk/client-ses";
import { client } from "./client";

export type SendEmailFn = (args: {
  subject: string;
  html: string;
  plaintext: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  from: string;
}) => Promise<void>;

export async function sendEmail([
  args,
]: Parameters<SendEmailFn>): ReturnType<SendEmailFn> {
  await client.send(
    new SendEmailCommand({
      Source: args.from,
      Destination: {
        ToAddresses: args.to,
        BccAddresses: args.bcc,
        CcAddresses: args.cc,
      },
      Message: {
        Body: {
          Html: {
            Data: args.html,
          },
          Text: {
            Data: args.plaintext,
          },
        },
        Subject: {
          Data: args.subject,
        },
      },
    })
  );
}
