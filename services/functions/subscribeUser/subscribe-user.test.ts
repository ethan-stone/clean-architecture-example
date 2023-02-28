import { GetUserByEmailFn, InsertUserFn, User } from "@/db/user";
import { SendEmailFn } from "@/email/send-email";
import { describe, expect, it, vi } from "vitest";
import { EmailInUseError, subscribeUser } from "./subscribe-user";

describe("subscribe-user tests", () => {
  it("should throw EmailInUseError if a user is found by email", async () => {
    const user = {
      id: "id",
      email: "email",
      name: "name",
    } satisfies User;

    const mockGetUserByEmail = vi
      .fn<Parameters<GetUserByEmailFn>, ReturnType<GetUserByEmailFn>>()
      .mockResolvedValueOnce(user);

    const mockInsertUser = vi
      .fn<Parameters<InsertUserFn>, ReturnType<InsertUserFn>>()
      .mockResolvedValueOnce(user);

    const mockSendEmail = vi
      .fn<Parameters<SendEmailFn>, ReturnType<SendEmailFn>>()
      .mockResolvedValueOnce();

    try {
      await subscribeUser(
        {
          email: user.email,
          name: user.name,
        },
        {
          getUserByEmail: mockGetUserByEmail,
          insertUser: mockInsertUser,
          sendEmail: mockSendEmail,
        }
      );
    } catch (error) {
      expect(error).toBeInstanceOf(EmailInUseError);
      expect(mockGetUserByEmail).toHaveBeenCalledTimes(1);
      expect(mockInsertUser).toHaveBeenCalledTimes(0);
      expect(mockSendEmail).toHaveBeenCalledTimes(0);
    }
  });

  it("should return user if insert and send email succeed", async () => {
    const user = {
      id: "id",
      email: "email",
      name: "name",
    } satisfies User;

    const mockGetUserByEmail = vi
      .fn<Parameters<GetUserByEmailFn>, ReturnType<GetUserByEmailFn>>()
      .mockResolvedValueOnce(null);

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
        getUserByEmail: mockGetUserByEmail,
        insertUser: mockInsertUser,
        sendEmail: mockSendEmail,
      }
    );

    expect(mockGetUserByEmail).toHaveBeenCalledTimes(1);
    expect(mockInsertUser).toHaveBeenCalledTimes(1);
    expect(mockSendEmail).toHaveBeenCalledTimes(1);
    expect(res).toEqual(user);
  });
});
