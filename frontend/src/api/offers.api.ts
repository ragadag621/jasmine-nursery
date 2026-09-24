import { axiosClient } from './axiosClient';

import type { Offer, PopulatedOffer } from '@/types/content.types';

import type { OfferFormValues } from '@/components/admin/OfferForm';

export function buildOfferFormData(
  values: OfferFormValues,
  file: File | null,
): FormData {
  const formData = new FormData();

  formData.append(
    'title',
    JSON.stringify({
      he: values.titleHe,
      ar: values.titleAr,
    }),
  );

  formData.append(
    'description',
    JSON.stringify({
      he: values.descriptionHe,
      ar: values.descriptionAr,
    }),
  );

  formData.append(
    'plants',
    JSON.stringify(values.plants),
  );

  formData.append(
    'isActive',
    String(values.isActive),
  );

  if (values.startDate) {
    formData.append(
      'startDate',
      values.startDate,
    );
  }

  if (values.endDate) {
    formData.append(
      'endDate',
      values.endDate,
    );
  }

  if (file) {
    formData.append('image', file);
  }

  return formData;
}

export async function fetchOffers(
  active?: boolean,
): Promise<Offer[]> {
  const { data } =
    await axiosClient.get('/offers', {
      params:
        active !== undefined
          ? { active }
          : {},
    });

  return data.data as Offer[];
}

export async function fetchOffer(id: string): Promise<PopulatedOffer> {
  const { data } = await axiosClient.get(`/offers/${id}`);

  return data.data as PopulatedOffer;
}

export async function createOffer(
  formData: FormData,
): Promise<Offer> {
  const { data } =
    await axiosClient.post(
      '/offers',
      formData,
    );

  return data.data as Offer;
}

export async function updateOffer(
  id: string,
  formData: FormData,
): Promise<Offer> {
  const { data } =
    await axiosClient.put(
      `/offers/${id}`,
      formData,
    );

  return data.data as Offer;
}

export async function deleteOffer(
  id: string,
): Promise<void> {
  await axiosClient.delete(
    `/offers/${id}`,
  );
}