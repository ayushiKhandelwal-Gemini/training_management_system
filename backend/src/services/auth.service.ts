import { User } from "../models/user.model";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt";

export const registerUser = async (data: any) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await User.create({
    ...data,
    password: hashedPassword,
  });

  return user;
};

export const loginUser = async (email: string, password: string) => {
  const user: any = await User.findOne({ where: { email } });

  if (!user) throw new Error("User not found");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const token = generateToken({
    id: user.id,
    role: user.role,
  });

  return { user, token };
};