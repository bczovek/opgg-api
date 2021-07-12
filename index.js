import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import routes from './routes/index.js';
import database from './models/database.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use((req, res, next) => {
    req.database = database(process.env.REDIS_HOST, process.env.REDIS_PORT);
    next();
});

app.use('/', routes);

app.listen(process.env.PORT, () =>
  console.log('App listening on port '+ process.env.PORT +'!'),
);