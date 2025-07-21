import { Router } from 'express';
import { createQuery, getMyQueries } from '../controllers/query.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/', protect, createQuery);
router.get('/', protect, getMyQueries);

export default router;