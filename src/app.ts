import express from 'express';

import cors from 'cors';

const app = express();

app.set('trust proxy', true);
app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

export default app;
