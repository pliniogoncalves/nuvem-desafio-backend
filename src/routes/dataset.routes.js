import { Router } from 'express';
import { upload, uploadDataset, getMyDatasets, getRecordsFromDataset } from '../controllers/dataset.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/upload', protect, upload.single('file'), uploadDataset);
router.get('/', protect, getMyDatasets);
router.get('/:id/records', protect, getRecordsFromDataset);

export default router;