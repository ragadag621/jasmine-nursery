import { Request, Response } from 'express';
import { FilterQuery } from 'mongoose';
import { Offer, IOfferDocument } from '../models/Offer.model';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import { OfferCreateInput, OfferUpdateInput } from '../validators/offer.validator';
import { uploadImageBuffer, deleteCloudinaryImage } from '../utils/cloudinaryUpload';

/**
 * GET /api/offers
 * Public. ?active=true|false optionally filters by the isActive flag;
 * with no query param, all offers are returned (mainly useful for the
 * admin-side reuse of this same read path in a later phase).
 */
export const listOffers = asyncHandler(async (req: Request, res: Response) => {
  const { active } = req.query as { active?: boolean };

  const filter: FilterQuery<IOfferDocument> = {};
  if (typeof active === 'boolean') {
    filter.isActive = active;
  }

  const offers = await Offer.find(filter).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: offers,
  });
});

/** POST /api/offers — Protected (admin). Optional single `image` file. */
export const createOffer = asyncHandler(async (req: Request, res: Response) => {
  const input = req.body as OfferCreateInput;
  const file = req.file as Express.Multer.File | undefined;

  const image = file ? await uploadImageBuffer(file.buffer, 'alyasmin/content') : undefined;
  const offer = await Offer.create({ ...input, image });

  res.status(201).json({
    success: true,
    message: 'Offer created successfully',
    data: offer,
  });
});

/** PUT /api/offers/:id — Protected (admin). */
export const updateOffer = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const input = req.body as OfferUpdateInput;
  const file = req.file as Express.Multer.File | undefined;

  const offer = await Offer.findById(id);
  if (!offer) {
    throw ApiError.notFound('Offer not found');
  }

  if (file) {
    if (offer.image?.publicId) {
      await deleteCloudinaryImage(offer.image.publicId);
    }
    offer.image = await uploadImageBuffer(file.buffer, 'alyasmin/content');
  }

  Object.assign(offer, input);
  await offer.save();

  res.status(200).json({
    success: true,
    message: 'Offer updated successfully',
    data: offer,
  });
});

/** DELETE /api/offers/:id — Protected (admin). */
export const deleteOffer = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const offer = await Offer.findById(id);
  if (!offer) {
    throw ApiError.notFound('Offer not found');
  }

  if (offer.image?.publicId) {
    await deleteCloudinaryImage(offer.image.publicId);
  }
  await offer.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Offer deleted successfully',
  });
});
