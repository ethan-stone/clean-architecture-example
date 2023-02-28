import { getClient } from "./client";

export type User = {
  id: string;
  name: string;
  email: string;
};

export type InsertUserFn = (user: User) => Promise<User>;

export const insertUser: InsertUserFn = async (user) => {
  const client = await getClient();
  const coll = client.db().collection<User>("users");

  await coll.insertOne(user);

  const insertedUser = await coll.findOne({ id: user.id });

  return insertedUser as User;
};

export type GetUserByEmailFn = (email: string) => Promise<User | null>;

export const getUserByEmail: GetUserByEmailFn = async (email) => {
  const client = await getClient();
  const coll = client.db().collection<User>("users");

  const user = await coll.findOne({
    email,
  });

  return user as User | null;
};
