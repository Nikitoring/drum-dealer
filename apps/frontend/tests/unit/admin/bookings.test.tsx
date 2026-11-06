import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { AdminBookings } from '@/components/admin/bookings';

const update = vi.fn();
vi.mock('@/hooks/use-admin-bookings', () => ({ useAdminBookings: () => ({ data: { data: [{ id: 'b1', customerName: 'Иван', customerPhone: '+7999', status: 'PENDING', createdAt: '2099-05-12T09:00:00Z', customerEmail: null, comment: null, timeSlot: { startAt: '2099-05-12T10:00:00Z', endAt: '2099-05-12T11:00:00Z', rehearsalPoint: { name: 'Точка 1' } } }] }, isPending: false, isError: false }), useAdminBookingCount: () => ({ data: { meta: { total: 1 } } }), useUpdateBookingStatus: () => ({ mutate: update, isPending: false }) }));

describe('admin / bookings', () => {
  it('подтверждает заявку на бронирование', async () => {
    const user = userEvent.setup(); render(<AdminBookings />);
    await user.click(screen.getByRole('button', { name: 'Подтвердить' }));
    expect(update).toHaveBeenCalledWith({ id: 'b1', status: 'CONFIRMED' });
  });
});
