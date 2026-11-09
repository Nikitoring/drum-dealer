export type ProductCondition = 'NEW' | 'USED';
export type ProductStatus = 'AVAILABLE' | 'SOLD' | 'HIDDEN';

export type Product = {
  id?: string;
  slug: string;
  name: string;
  brand: string | null;
  category: string;
  categoryId: string;
  condition: ProductCondition;
  status: ProductStatus;
  price: string;
  description?: string | null;
  specifications?: Record<string, string> | null;
  images: { id?: string; url: string; position?: number }[];
};

export type Category = {
  id: string;
  name: string;
  slug: string;
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

export type AdminProductFilters = ProductFilters & {
  status?: ProductStatus;
};

export type CreateProductInput = {
  name: string;
  slug: string;
  brand?: string;
  categoryId: string;
  price: string;
  condition: ProductCondition;
  status: ProductStatus;
  description?: string;
  specifications?: string;
};

export type UpdateProductInput = Partial<CreateProductInput>;

export type ProductImage = { id: string; url: string; position: number };

export type RehearsalPoint = {
  id: string;
  slug: string;
  name: string;
  address: string;
  description: string | null;
  equipment?: string | null;
  contactPhone?: string | null;
  pricePerHour?: string | null;
  images: { id: string; url: string; type: 'POINT' | 'EQUIPMENT'; position: number }[];
};

export type RehearsalPointInput = Partial<
  Pick<
    RehearsalPoint,
    'name' | 'address' | 'description' | 'equipment' | 'contactPhone' | 'pricePerHour'
  >
>;

export type TimeSlot = {
  id: string;
  startAt: string;
  endAt: string;
  status: 'AVAILABLE' | 'PENDING' | 'BOOKED' | 'BLOCKED';
};

export type AdminSchedulePoint = {
  point: RehearsalPoint;
  slots: (TimeSlot & {
    bookings: { id: string; status: BookingStatus; customerName: string }[];
  })[];
};

export type AdminSchedule = {
  data: AdminSchedulePoint[];
  range: { from: string | null; to: string | null };
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

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'REJECTED' | 'CANCELLED';

export type Booking = {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  comment: string | null;
  status: BookingStatus;
  createdAt: string;
  timeSlot: {
    startAt: string;
    endAt: string;
    rehearsalPoint: { name: string };
  };
};
