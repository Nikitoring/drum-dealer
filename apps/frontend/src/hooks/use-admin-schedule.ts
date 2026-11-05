import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { rehearsalService } from '@/services/rehearsal-service';

export function useAdminSchedule(from: string, to: string) {
  return useQuery({
    queryKey: ['admin-schedule', from, to],
    queryFn: ({ signal }) => rehearsalService.adminSchedule(from, to, signal),
  });
}

export function useAdminScheduleMutations() {
  const queryClient = useQueryClient();
  const refresh = () => queryClient.invalidateQueries({ queryKey: ['admin-schedule'] });

  const createSlot = useMutation({
    mutationFn: rehearsalService.createAdminSlot,
    onSuccess: refresh,
  });
  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'AVAILABLE' | 'BLOCKED' }) =>
      rehearsalService.updateAdminSlotStatus(id, status),
    onSuccess: refresh,
  });

  return { createSlot, updateStatus };
}
