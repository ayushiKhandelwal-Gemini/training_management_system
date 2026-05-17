import { User, UserInstance } from "../models/user.model";

export interface UpdateProfilePayload {
  name?: string;
  email?: string;
}

const safeUserAttributes = {
  exclude: ["password"],
};

export const getProfileService = async (userId: string) => {
  return User.findByPk(userId, {
    attributes: safeUserAttributes,
  });
};

export const updateProfileService = async (
  userId: string,
  payload: UpdateProfilePayload
) => {
  const user = (await User.findByPk(userId)) as UserInstance | null;

  if (!user) {
    return null;
  }

  await user.update({
    name: payload.name ?? user.name,
    email: payload.email ?? user.email,
  });

  return User.findByPk(userId, {
    attributes: safeUserAttributes,
  });
};
