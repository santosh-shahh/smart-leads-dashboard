import { Request, Response, NextFunction } from 'express';
import Lead, { LeadStatus, LeadSource } from '../models/Lead';
import { z } from 'zod';
import { Parser } from 'json2csv';

const leadSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  status: z.nativeEnum(LeadStatus).optional(),
  source: z.nativeEnum(LeadSource),
});

// @desc    Get all leads with filtering, searching, sorting, pagination
// @route   GET /api/leads
// @access  Private
export const getLeads = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status, source, search, sort, page, limit } = req.query;

    const query: any = {};

    // Filtering
    if (status) query.status = status;
    if (source) query.source = source;

    // Searching (Name or Email)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    // Sorting
    let sortObj: any = { createdAt: -1 }; // Default: Latest
    if (sort === 'oldest') {
      sortObj = { createdAt: 1 };
    }

    // Pagination
    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 10;
    const skip = (pageNum - 1) * limitNum;

    const total = await Lead.countDocuments(query);
    const leads = await Lead.find(query).sort(sortObj).skip(skip).limit(limitNum);

    res.json({
      leads,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single lead
// @route   GET /api/leads/:id
// @access  Private
export const getLeadById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (lead) {
      res.json(lead);
    } else {
      res.status(404);
      throw new Error('Lead not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a lead
// @route   POST /api/leads
// @access  Private
export const createLead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsedData = leadSchema.parse(req.body);

    const lead = await Lead.create(parsedData);
    res.status(201).json(lead);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a lead
// @route   PUT /api/leads/:id
// @access  Private
export const updateLead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Basic validation for updating (partial updates allowed, so we use partial() on zod schema)
    const updateData = leadSchema.partial().parse(req.body);

    const lead = await Lead.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });

    if (lead) {
      res.json(lead);
    } else {
      res.status(404);
      throw new Error('Lead not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a lead
// @route   DELETE /api/leads/:id
// @access  Private/Admin
export const deleteLead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (lead) {
      await lead.deleteOne();
      res.json({ message: 'Lead removed' });
    } else {
      res.status(404);
      throw new Error('Lead not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get lead statistics
// @route   GET /api/leads/stats
// @access  Private
export const getLeadStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const total = await Lead.countDocuments();

    const statusCounts = await Lead.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const sourceCounts = await Lead.aggregate([
      { $group: { _id: '$source', count: { $sum: 1 } } },
    ]);

    // Build status map with defaults
    const byStatus: Record<string, number> = { New: 0, Contacted: 0, Qualified: 0, Lost: 0 };
    statusCounts.forEach((s) => { byStatus[s._id] = s.count; });

    const bySource: Record<string, number> = { Website: 0, Instagram: 0, Referral: 0 };
    sourceCounts.forEach((s) => { bySource[s._id] = s.count; });

    const conversionRate = total > 0 ? Math.round((byStatus.Qualified / total) * 100) : 0;

    res.json({
      total,
      byStatus,
      bySource,
      conversionRate,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Export leads to CSV
// @route   GET /api/leads/export
// @access  Private/Admin
export const exportLeads = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const leads = await Lead.find({}).lean(); // Use lean for faster plain JS objects

    const fields = ['_id', 'name', 'email', 'status', 'source', 'createdAt'];
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(leads);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=leads.csv');
    res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
};
