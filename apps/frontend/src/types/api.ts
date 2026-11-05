export type ProductCondition = 'NEW' | 'USED';
export type ProductStatus = 'AVAILABLE' | 'SOLD';

export type Product = {
  id?: string;
  slug: string;
  name: string;
  brand: string | null;
  category: string;
  condition: ProductCondition;
  status: ProductStatus;
  price: string;
  description?: string | null;
  specifications?: Record<string, string> | null;
  images: { id?: string; url: string; position?: number }[];
};

export type Paginated<T> = {
  data: T[];
  meta: { page: number; pageSize: number; total: number; totalPages: number };
};

export type ProductFilters = {
  search?: string;
  condition?: ProductCondition;
  category?: string;
  brand?: string;
  sort?: string;
  pageSize?: number;
};

export type RehearsalPoint = {
  id: string;
  slug: string;
  name: string;
  address: string;
  description: string | null;
  equipment?: string | null;
  contactPhone?: string | null;
  pricePerHour?: string | null;
};

export type TimeSlot = {
  id: string;
  startAt: string;
  endAt: string;
  status: 'AVAILABLE' | 'PENDING' | 'BOOKED' | 'BLOCKED';
};

export type CreateBookingInput = {
  timeSlotId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  comment?: string;
  personalDataConsent: boolean;
};

export type CreatedBooking = {
  data: { id: string; status: string; timeSlotId: string };
};
