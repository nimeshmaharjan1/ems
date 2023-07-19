import { ourFileRouter } from '@/features/upload-thing';
import { createNextPageApiHandler } from 'uploadthing/next-legacy';

const handler = createNextPageApiHandler({
  router: ourFileRouter,
});

export default handler;
