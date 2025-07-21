import { Router } from 'express';
import { searchRecords } from '../controllers/record.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/search', protect, searchRecords);

export default router;