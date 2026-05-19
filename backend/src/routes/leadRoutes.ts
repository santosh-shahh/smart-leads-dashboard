import express from 'express';
import {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  exportLeads,
  getLeadStats,
} from '../controllers/leadController';
import { protect, adminOnly } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/stats').get(protect, getLeadStats);
router.route('/export').get(protect, adminOnly, exportLeads); // Put this before /:id to avoid matching :id with 'export'

router.route('/').get(protect, getLeads).post(protect, createLead);

router.route('/:id').get(protect, getLeadById).put(protect, updateLead).delete(protect, adminOnly, deleteLead);

export default router;
