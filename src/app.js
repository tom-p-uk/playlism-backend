import express from 'express';
import mongoose from 'mongoose';
import { config } from 'dotenv';

config();
const app = express();

if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(process.env.MONGO_URI);

  mongoose.connection
    .once('open', () => console.log('Connected to database'))
    .on('error', err => console.warn(err));
}

const port = 3000 || process.env.PORT;
app.listen(port, () => console.log(`Listening on port ${port}`));
