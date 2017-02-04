'use strict';
import express from 'express';
import path from 'path';
import logger from 'morgan';
import bodyParser from 'body-parser';
import helmet from 'helmet';

import router from './router';
import mongoInit from './bin/dbInit';

const app = express();
mongoInit();

app.use(helmet());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(logger('dev'));

app.use(express.static(path.join(__dirname, '/../public')));
app.set('views', path.join(__dirname, '/../views'));
app.use('/', router);

export default app;