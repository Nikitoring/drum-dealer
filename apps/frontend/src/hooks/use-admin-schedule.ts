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

export function useAdminPoint(id: string) {
  return useQuery({
    queryKey: ['admin-rehearsal-point', id],
    queryFn: ({ signal }) => rehearsalService.adminPoint(id, signal),
    enabled: Boolean(id),
  });
}

export function useAdminPointMutations(id: string) {
  const queryClient = useQueryClient();
  const refresh = () => {
    void queryClient.invalidateQueries({ queryKey: ['admin-rehearsal-point', id] });
    void queryClient.invalidateQueries({ queryKey: ['admin-schedule'] });
    void queryClient.invalidateQueries({ queryKey: ['rehearsal-points'] });
    void queryClient.invalidateQueries({ queryKey: ['rehearsal-point'] });
  };
  const update = useMutation({
    mutationFn: (input: Parameters<typeof rehearsalService.updateAdminPoint>[1]) =>
      rehearsalService.updateAdminPoint(id, input),
    onSuccess: (point) => {
      queryClient.setQueryData(['admin-rehearsal-point', id], point);
      refresh();
    },
  });
  const uploadImage = useMutation({
    mutationFn: ({ type, file }: { type: 'POINT' | 'EQUIPMENT'; file: File }) =>
      rehearsalService.uploadAdminPointImage(id, type, file),
    onSuccess: refresh,
  });
  const deleteImage = useMutation({
    mutationFn: (imageId: string) => rehearsalService.deleteAdminPointImage(id, imageId),
    onSuccess: refresh,
  });
  return { update, uploadImage, deleteImage };
}
