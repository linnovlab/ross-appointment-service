import * as bcrypt from 'bcrypt';

export const encryptData = (data: any, saltRounds: number) => {
  try {
    const salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(salt, data);
  } catch (error) {
    return error;
  }
};

export const verifyHash = (data: any, hash: string) => {
  return bcrypt.compareSync(data, hash);
};
