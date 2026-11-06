import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { AdminSchedule } from '@/components/admin/schedule';

const createSlot = vi.fn(); const updateStatus = vi.fn();
vi.mock('@/hooks/use-admin-schedule', () => ({ useAdminSchedule: () => ({ data: { data: [{ point: { id: 'point-1', name: 'Точка 1', address: 'Москва', images: [] }, slots: [{ id: 'slot-1', startAt: '2099-05-12T10:00:00.000Z', endAt: '2099-05-12T11:00:00.000Z', status: 'AVAILABLE', bookings: [] }] }], range: {} }, isPending: false, isError: false }), useAdminScheduleMutations: () => ({ createSlot: { mutate: createSlot, isPending: false }, updateStatus: { mutate: updateStatus, isPending: false } }) }));
vi.mock('next/link', () => ({ default: ({ children, ...props }: Record<string, unknown>) => <a {...props}>{children}</a> }));

describe('admin / schedule', () => {
  it('создаёт слот и блокирует доступный слот', async () => {
    const user = userEvent.setup(); render(<AdminSchedule />);
    await user.click(screen.getByRole('button', { name: '+ Добавить слот' }));
    expect(createSlot).toHaveBeenCalledWith(expect.objectContaining({ rehearsalPointId: 'point-1' }));
    await user.click(screen.getByRole('button', { name: 'Закрыть' }));
    expect(updateStatus).toHaveBeenCalledWith({ id: 'slot-1', status: 'BLOCKED' });
  });
});
