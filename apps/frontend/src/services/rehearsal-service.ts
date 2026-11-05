import { apiRequest } from '@/lib/api';
import type { CreateBookingInput, CreatedBooking, RehearsalPoint, TimeSlot } from '@/types/api';

export const rehearsalService = {
  points: (signal?: AbortSignal) => apiRequest<RehearsalPoint[]>('/rehearsal-points', { signal }),
  point: (slug: string, signal?: AbortSignal) =>
    apiRequest<RehearsalPoint>(`/rehearsal-points/${encodeURIComponent(slug)}`, { signal }),
  slots: (slug: string, from: string, to: string, signal?: AbortSignal) =>
    apiRequest<TimeSlot[]>(`/rehearsal-points/${encodeURIComponent(slug)}/slots?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`, { signal }),
  createBooking: (input: CreateBookingInput) =>
    apiRequest<CreatedBooking>('/bookings', { method: 'POST', body: JSON.stringify(input) }),
};
