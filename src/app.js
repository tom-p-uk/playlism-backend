import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import passport from 'passport';
import _ from './env';
import routes from './routes';

const app = express();

if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(process.env.MONGO_URI);

  mongoose.connection
    .once('open', () => console.log('Connected to database'))
    .on('error', err => console.warn(err));
}

app.use(bodyParser.json({ type: '*/*' }));
app.use(bodyParser.urlencoded({ type: '*/x-www-form-urlencoded', extended: true }));
app.use(cors());
app.use(morgan('combined'));
app.use(passport.initialize());
app.use(passport.session());

routes(app);

const port = 3000 || process.env.PORT;
app.listen(port, () => console.log(`Listening on port ${port}`));

export default app;
