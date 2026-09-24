import { Request, Response } from 'express';
import { FilterQuery } from 'mongoose';

import { Offer, IOfferDocument } from '../models/Offer.model';
import { Plant } from '../models/Plant.model';

import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';

import {
  OfferCreateInput,
  OfferUpdateInput,
} from '../validators/offer.validator';

import {
  uploadImageBuffer,
  deleteCloudinaryImage,
} from '../utils/cloudinaryUpload';

const validateOfferDates = (
  startDate?: Date,
  endDate?: Date,
) => {
  if (startDate && endDate && endDate < startDate) {
    throw ApiError.badRequest(
      'End date must be after start date',
    );
  }
};

const validatePlantIds = async (plantIds: string[]) => {
  const plants = await Plant.find({
    _id: { $in: plantIds },
  }).select('_id');

  if (plants.length !== plantIds.length) {
    throw ApiError.notFound(
      'One or more selected plants were not found',
    );
  }
};

export const listOffers = asyncHandler(
  async (req: Request, res: Response) => {
    const { active } = req.query as {
      active?: boolean;
    };

    const filter: FilterQuery<IOfferDocument> = {};

    if (typeof active === 'boolean') {
      filter.isActive = active;
    }

    const offers = await Offer.find(filter)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: offers,
    });
  },
);

export const getOfferById = asyncHandler(
  async (req: Request, res: Response) => {
    const offer = await Offer.findById(req.params.id)
      .populate('plants');

    if (!offer) {
      throw ApiError.notFound('Offer not found');
    }

    res.status(200).json({
      success: true,
      data: offer,
    });
  },
);

export const createOffer = asyncHandler(
  async (req: Request, res: Response) => {
    const input = req.body as OfferCreateInput;

    const file = req.file as
      | Express.Multer.File
      | undefined;

    validateOfferDates(
      input.startDate,
      input.endDate,
    );

    await validatePlantIds(input.plants);

    const image = file
      ? await uploadImageBuffer(
          file.buffer,
          'alyasmin/content',
        )
      : undefined;

    const offer = await Offer.create({
      ...input,
      image,
    });

    res.status(201).json({
      success: true,
      message: 'Offer created successfully',
      data: offer,
    });
  },
);

export const updateOffer = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const input = req.body as OfferUpdateInput;

    const file = req.file as
      | Express.Multer.File
      | undefined;

    const offer = await Offer.findById(id);

    if (!offer) {
      throw ApiError.notFound('Offer not found');
    }

    const nextStartDate =
      input.startDate ?? offer.startDate;

    const nextEndDate =
      input.endDate ?? offer.endDate;

    validateOfferDates(
      nextStartDate,
      nextEndDate,
    );

    if (input.plants !== undefined) {
      await validatePlantIds(input.plants);
    }

    if (file) {
      const oldPublicId = offer.image?.publicId;

      const newImage = await uploadImageBuffer(
        file.buffer,
        'alyasmin/content',
      );

      offer.image = newImage;

      if (oldPublicId) {
        await deleteCloudinaryImage(oldPublicId);
      }
    }

    Object.assign(offer, input);

    await offer.save();

    res.status(200).json({
      success: true,
      message: 'Offer updated successfully',
      data: offer,
    });
  },
);

export const deleteOffer = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const offer = await Offer.findById(id);

    if (!offer) {
      throw ApiError.notFound('Offer not found');
    }

    if (offer.image?.publicId) {
      await deleteCloudinaryImage(
        offer.image.publicId,
      );
    }

    await offer.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Offer deleted successfully',
    });
  },
);