import { User, UserInstance } from "../models/user.model";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt";

interface RegisterUserPayload {
  name: string;
  email: string;
  password: string;
  role: "TRAINER" | "STUDENT";
}

export const registerUser = async (data: RegisterUserPayload) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await User.create({
    ...data,
    password: hashedPassword,
  });

  return user as UserInstance;
};

export const loginUser = async (email: string, password: string) => {
  const user = (await User.findOne({ where: { email } })) as UserInstance | null;

  if (!user) throw new Error("User not found");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const token = generateToken({
    id: user.id,
    role: user.role,
  });

  return { user, token };
};