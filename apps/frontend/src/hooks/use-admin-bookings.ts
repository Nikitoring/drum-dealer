import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { rehearsalService } from '@/services/rehearsal-service';
import type { BookingStatus } from '@/types/api';

export function useAdminBookings(status?: BookingStatus) {
  return useQuery({
    queryKey: ['admin-bookings', status ?? 'all'],
    queryFn: ({ signal }) => rehearsalService.adminBookings(status, signal),
  });
}

export function useAdminBookingCount(status?: BookingStatus) {
  return useQuery({
    queryKey: ['admin-booking-count', status ?? 'all'],
    queryFn: ({ signal }) => rehearsalService.adminBookingCount(status, signal),
  });
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: BookingStatus }) =>
      rehearsalService.updateBookingStatus(id, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
      void queryClient.invalidateQueries({ queryKey: ['admin-booking-count'] });
    },
  });
}
