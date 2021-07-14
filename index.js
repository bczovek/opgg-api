import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import routes from './routes/index.js';
import database from './models/database.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use((req, res, next) => {
  if(req.method != 'GET'){
    return res.status(405).send('Method not allowed').end();
  }
  next();
});

app.use((req, res, next) => {
    req.database = database(process.env.REDIS_URL);
    next();
});

app.use('/', routes);

app.listen(port, () =>
  console.log(`App listening on port ${port}!`),
);