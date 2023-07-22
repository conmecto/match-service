import { Router } from 'express';
import matchRouter from './match';

const router = Router();
router.use('/match', matchRouter);

export default router;
