import { Application } from 'express';
import { createBullBoard } from 'bull-board';
import { BullAdapter } from 'bull-board/bullAdapter';
import myQueues from './queue';
import { PageAuthMiddleware } from './middleware/pageAuthMiddleware';

export function EnableBullBoard(app: Application): void {
  const queues = myQueues.map(q => {
    return new BullAdapter(q);
  });
  const { router, setQueues, replaceQueues, addQueue, removeQueue } = createBullBoard(queues);
  if (process.env.NODE_ENV === 'prod') {
    app.use('/admin/bullboard', PageAuthMiddleware('Admin'), router);
  } else {
    app.use('/admin/bullboard', router);
  }
}
