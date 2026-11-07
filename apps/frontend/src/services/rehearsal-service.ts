import { apiRequest } from '@/lib/api';
import type {
  Booking,
  BookingStatus,
  CreateBookingInput,
  CreatedBooking,
  Paginated,
  RehearsalPoint,
  TimeSlot,
  AdminSchedule,
  RehearsalPointInput,
} from '@/types/api';

export const rehearsalService = {
  points: (signal?: AbortSignal) => apiRequest<RehearsalPoint[]>('/rehearsal-points', { signal }),
  point: (slug: string, signal?: AbortSignal) =>
    apiRequest<RehearsalPoint>(`/rehearsal-points/${encodeURIComponent(slug)}`, { signal }),
  adminPoints: (signal?: AbortSignal) =>
    apiRequest<RehearsalPoint[]>('/admin/rehearsal-points', { signal }),
  adminPoint: (id: string, signal?: AbortSignal) =>
    apiRequest<RehearsalPoint>(`/admin/rehearsal-points/${encodeURIComponent(id)}`, { signal }),
  createAdminPoint: (input: RehearsalPointInput & { slug: string }) =>
    apiRequest<RehearsalPoint>('/admin/rehearsal-points', {
      method: 'POST',
      body: JSON.stringify(input),
    }),
  updateAdminPoint: (id: string, input: RehearsalPointInput) =>
    apiRequest<RehearsalPoint>(`/admin/rehearsal-points/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    }),
  uploadAdminPointImage: (id: string, type: 'POINT' | 'EQUIPMENT', file: File) => {
    const body = new FormData();
    body.append('type', type);
    body.append('file', file);
    return apiRequest<RehearsalPoint['images'][number]>(
      `/admin/rehearsal-points/${encodeURIComponent(id)}/images`,
      { method: 'POST', body },
    );
  },
  deleteAdminPointImage: (id: string, imageId: string) =>
    apiRequest<{ success: boolean }>(
      `/admin/rehearsal-points/${encodeURIComponent(id)}/images/${encodeURIComponent(imageId)}`,
      { method: 'DELETE' },
    ),
  slots: (slug: string, from: string, to: string, signal?: AbortSignal) =>
    apiRequest<TimeSlot[]>(
      `/rehearsal-points/${encodeURIComponent(slug)}/slots?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`,
      { signal },
    ),
  createBooking: (input: CreateBookingInput) =>
    apiRequest<CreatedBooking>('/bookings', {
      method: 'POST',
      body: JSON.stringify(input),
    }),
  adminBookings: (status?: BookingStatus, signal?: AbortSignal) => {
    const params = new URLSearchParams({ page: '1', pageSize: '20' });
    if (status) params.set('status', status);
    return apiRequest<Paginated<Booking>>(`/admin/bookings?${params}`, { signal });
  },
  adminBookingCount: (status?: BookingStatus, signal?: AbortSignal) => {
    const params = new URLSearchParams({ page: '1', pageSize: '1' });
    if (status) params.set('status', status);
    return apiRequest<Paginated<Booking>>(`/admin/bookings?${params}`, { signal });
  },
  updateBookingStatus: (id: string, status: BookingStatus) =>
    apiRequest<Booking>(`/admin/bookings/${encodeURIComponent(id)}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  adminSchedule: (from: string, to: string, signal?: AbortSignal) => {
    const params = new URLSearchParams({ from, to });
    return apiRequest<AdminSchedule>(`/admin/schedule?${params}`, { signal });
  },
  createAdminSlot: (input: { rehearsalPointId: string; startAt: string; endAt?: string }) =>
    apiRequest<TimeSlot>('/admin/schedule/slots', {
      method: 'POST',
      body: JSON.stringify(input),
    }),
  updateAdminSlotStatus: (id: string, status: 'AVAILABLE' | 'BLOCKED') =>
    apiRequest<TimeSlot>(`/admin/schedule/slots/${encodeURIComponent(id)}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};
