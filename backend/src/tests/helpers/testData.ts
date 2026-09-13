import { Types } from "mongoose";
import { Plant } from "../../models/Plant.model";
import { Category } from "../../models/Category.model";

import { Contact } from "../../models/Contact.model";

export async function createTestContact(
  status: "new" | "read" | "resolved" = "new"
) {
  return Contact.create({
    name: "Test Contact",
    phone: "0501234567",
    email: "test@example.com",
    message: "This is a test contact message.",
    status,
  });
}

export async function cleanupTestContact(contactId: Types.ObjectId) {
  await Contact.findByIdAndDelete(contactId);
}

export async function createTestCategory() {
  return Category.create({
    name: {
      ar: "فئة اختبار",
      he: "קטגוריית בדיקה",
    },
    slug: `test-category-${Date.now()}`,
    description: {
      ar: "فئة مخصصة للاختبارات",
      he: "קטגוריה המיועדת לבדיקות",
    },
  });
}

export async function createTestPlant(categoryId: Types.ObjectId) {
  return Plant.create({
    name: {
      ar: "نبتة اختبار",
      he: "צמח בדיקה",
    },

    scientificName: "Testus Plantus",

    slug: `test-plant-${Date.now()}`,

    description: {
      ar: "هذه نبتة مخصصة لاختبارات الـAPI",
      he: "זהו צמח המיועד לבדיקות API",
    },

    category: categoryId,

    price: 100,

    availability: "in_stock",

    images: [],

    care: {
      water: "medium",
      sunlight: "full_sun",
    },

    featured: false,

    isHidden: false,
  });
}

export async function cleanupTestPlant(plantId: Types.ObjectId) {
  await Plant.findByIdAndDelete(plantId);
}

export async function cleanupTestCategory(categoryId: Types.ObjectId) {
  await Category.findByIdAndDelete(categoryId);
}