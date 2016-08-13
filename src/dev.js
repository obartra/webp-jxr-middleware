import { join } from 'path';
import express from 'express';
import { rewriteImageRequestMiddleware } from './index';

const app = express();
const path = join(__dirname, '../assets');

app.listen(8888);
app.use(rewriteImageRequestMiddleware(path));
app.use(express.static(path));
