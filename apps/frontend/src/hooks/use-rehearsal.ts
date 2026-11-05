import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { rehearsalService } from '@/services/rehearsal-service';
import type { CreateBookingInput } from '@/types/api';

export function useRehearsalPoints() {
  return useQuery({
    queryKey: ['rehearsal-points'],
    queryFn: ({ signal }) => rehearsalService.points(signal),
  });
}

export function useRehearsalPoint(slug: string) {
  return useQuery({
    queryKey: ['rehearsal-point', slug],
    queryFn: ({ signal }) => rehearsalService.point(slug, signal),
  });
}

export function useRehearsalSlots(slug: string, date: string, from: string, to: string, enabled: boolean) {
  return useQuery({
    queryKey: ['rehearsal-slots', slug, date],
    queryFn: ({ signal }) => rehearsalService.slots(slug, from, to, signal),
    enabled,
  });
}

export function useCreateBooking(slug: string, date: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateBookingInput) => rehearsalService.createBooking(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['rehearsal-slots', slug, date] }),
  });
}
