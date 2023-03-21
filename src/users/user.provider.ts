import { Mongoose } from 'mongoose';
import { UserSchema } from './schemas/user.schema';

export const userProviders = [
  {
    provide: 'USER_MODEL',
    useFactory: (mongoose: Mongoose) =>
      mongoose.models.Users || mongoose.model('User', UserSchema),
    inject: ['TESLODB_CONNECTION'],
  },
];
