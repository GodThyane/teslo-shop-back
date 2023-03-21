import * as mongoose from 'mongoose';
import * as process from 'process';

export const databaseProviders = [
  {
    provide: 'TESLODB_CONNECTION',
    useFactory: async (): Promise<typeof mongoose> =>
      await mongoose.connect(process.env.MONGO_URL || '', {
        dbName: 'teslodb',
      }),
  },
];
