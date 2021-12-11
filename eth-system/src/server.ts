import 'reflect-metadata';
import express from 'express';
import { createConnection } from 'typeorm';
import path from 'path';
import queues from './queue';
import { ExpressLogOverrideMiddleware } from './middleware/express.log.override.middleware';
import { AccessLogMiddleware } from './middleware/access.log.middleware';
import { ErrorHandlerMiddleware } from './middleware/error.handler.middleware';
import { RouteNotFoundMiddleware } from './middleware/route.not.found.middleware';
import { LogMiddleware } from './middleware/log.middleware';
import { LogErrorMiddleware } from './middleware/log.error.middleware';
import { AccessErrorLogMiddleware } from './middleware/access.error.log.middleware';
import { OverrideRawBody } from './lib/override.raw.body';
import { OverrideJsonBody } from './lib/override.json.body';
import ViewRoute from './route/view.route';
import { router } from './router';
import { EnableBullBoard } from './bullboard';
import cookieParser from 'cookie-parser';
import { EnableDocs } from './docs';
import startCronJob from './cron';
import { COOKIE_HASH } from './lib/constant';

const port = process.env.PORT || '5000';

createConnection().then(() => {
  const app: express.Application = express();
  // 因為是從nginx proxy過來 設定這個讓express抓x-forward-for 最左邊的ip
  app.set('trust proxy', true);
  app.use(cookieParser(COOKIE_HASH));
  // 訂單入款頁面
  app.use(express.static('dist/public'));
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'pug');

  app.use(ExpressLogOverrideMiddleware);
  OverrideRawBody(app);
  OverrideJsonBody(app);

  // bull board
  EnableBullBoard(app);
  // api文件
  EnableDocs(app);

  app.use(AccessLogMiddleware);
  app.use(AccessErrorLogMiddleware);

  for (const route of router) {
    if (!(route instanceof ViewRoute)) {
      app.use('/api' + route.getPrefix(), route.getRouter());
    } else {
      app.use(route.getPrefix(), route.getRouter());
    }
  }

  // error handler
  app.use(ErrorHandlerMiddleware);
  // route not found
  app.use(RouteNotFoundMiddleware);
  // 記錄log
  app.use(LogMiddleware);
  // 記錄error log
  app.use(LogErrorMiddleware);

  app.listen(port, () => {
    startCronJob();
    console.log(`eth_system service is listening on port ${port}`);
    queues.forEach(q => {
      console.log(`${q.name} started!`);
    });
  });
});

process.on('SIGINT', function () {
  queues.forEach(q => {
    q.pause();
    console.log(`${q.name} stop!`);
  });
  process.exit(0);
});
