import { Request, Response } from 'express';
import { Contact } from '../models';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import { ContactCreateInput } from '../validators/contact.validator';

/**
 * POST /api/contact
 * Public. Anyone can submit a message from the Contact page form.
 * Reading/managing messages (GET /api/contact, status updates, delete)
 * is protected and lands in Phase 4 alongside the rest of the admin API.
 */
export const submitContactMessage = asyncHandler(async (req: Request, res: Response) => {
  const { name, phone, email, message } = req.body as ContactCreateInput;

  const contact = await Contact.create({
    name,
    phone,
    email: email || undefined,
    message,
    status: 'new',
  });

  res.status(201).json({
    success: true,
    message: 'Message sent successfully',
    data: {
      id: contact.id,
      createdAt: contact.get('createdAt'),
    },
  });
});

/** GET /api/contact — Protected (admin). Optional ?status= filter, paginated. */
export const listContactMessages = asyncHandler(async (req: Request, res: Response) => {
  const { status, page, limit } = req.query as unknown as {
    status?: 'new' | 'read' | 'resolved';
    page: number;
    limit: number;
  };

  const filter = status ? { status } : {};
  const skip = (page - 1) * limit;

  const [messages, total] = await Promise.all([
    Contact.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Contact.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: messages,
    meta: { total, page, pages: Math.max(1, Math.ceil(total / limit)) },
  });
});

/** PATCH /api/contact/:id/status — Protected (admin). */
export const updateContactStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body as { status: 'new' | 'read' | 'resolved' };

  const message = await Contact.findByIdAndUpdate(id, { status }, { new: true });
  if (!message) {
    throw ApiError.notFound('Message not found');
  }

  res.status(200).json({
    success: true,
    message: 'Status updated',
    data: message,
  });
});

/** DELETE /api/contact/:id — Protected (admin). */
export const deleteContactMessage = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const message = await Contact.findByIdAndDelete(id);
  if (!message) {
    throw ApiError.notFound('Message not found');
  }

  res.status(200).json({
    success: true,
    message: 'Message deleted successfully',
  });
});
