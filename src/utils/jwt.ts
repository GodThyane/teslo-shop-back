import jwt from 'jsonwebtoken';

export const generateToken = (_id: string, email: string) => {
  console.log('Hola');
  if (!process.env.JWT_SECRET_SEED) {
    throw new Error('JWT_SECRET_SEED is not defined');
  }
  return jwt.sign(
    {
      _id,
      email,
    },
    process.env.JWT_SECRET_SEED,
    {
      expiresIn: '30d',
    },
  );
};
