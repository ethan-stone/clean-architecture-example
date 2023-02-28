import { InsertUserFn, User } from "@/db/user";
import { SendEmailFn } from "@/email/send-email";
import { describe, expect, it, vi } from "vitest";
import { subscribeUser } from "./subscribe-user";

describe("subscribe-user tests", () => {
  it("should return user if insert and send email succeed", async () => {
    const user = {
      id: "id",
      email: "email",
      name: "name",
    } satisfies User;

    const mockInsertUser = vi
      .fn<Parameters<InsertUserFn>, ReturnType<InsertUserFn>>()
      .mockResolvedValueOnce(user);

    const mockSendEmail = vi
      .fn<Parameters<SendEmailFn>, ReturnType<SendEmailFn>>()
      .mockResolvedValueOnce();

    const res = await subscribeUser(
      {
        email: user.email,
        name: user.name,
      },
      {
        insertUser: mockInsertUser,
        sendEmail: mockSendEmail,
      }
    );

    expect(mockInsertUser).toHaveBeenCalledTimes(1);
    expect(mockSendEmail).toHaveBeenCalledTimes(1);
    expect(res).toEqual(user);
  });
});
