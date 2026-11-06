import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { RehearsalBookingForm } from '@/components/rehearsal/booking-form';

const mutate = vi.fn();
vi.mock('@/hooks/use-rehearsal', () => ({ useCreateBooking: () => ({ mutate, isPending: false, isSuccess: false }) }));

describe('rehearsal / заявка и бронирование слота', () => {
  it('отправляет имя, контакты, комментарий и согласие', async () => {
    const user = userEvent.setup();
    render(<RehearsalBookingForm date="2099-05-12" pointSlug="point" onClose={vi.fn()} slot={{ id: 'slot-1', startAt: '2099-05-12T10:00:00.000Z', endAt: '2099-05-12T11:00:00.000Z', status: 'AVAILABLE' }} />);
    await user.type(screen.getByLabelText('Ваше имя'), 'Иван');
    await user.type(screen.getByLabelText('Телефон'), '+79990000000');
    await user.type(screen.getByLabelText('Email (необязательно)'), 'ivan@example.com');
    await user.type(screen.getByLabelText('Комментарий'), 'Нужен микрофон');
    await user.click(screen.getByRole('checkbox'));
    await user.click(screen.getByRole('button', { name: 'Отправить заявку' }));
    expect(mutate).toHaveBeenCalledWith({ timeSlotId: 'slot-1', customerName: 'Иван', customerPhone: '+79990000000', customerEmail: 'ivan@example.com', comment: 'Нужен микрофон', personalDataConsent: true });
  });

  it('не отправляет форму без обязательных полей', async () => {
    const user = userEvent.setup();
    render(<RehearsalBookingForm date="2099-05-12" pointSlug="point" onClose={vi.fn()} slot={{ id: 'slot-1', startAt: '2099-05-12T10:00:00.000Z', endAt: '2099-05-12T11:00:00.000Z', status: 'AVAILABLE' }} />);
    await user.click(screen.getByRole('button', { name: 'Отправить заявку' }));
    expect(mutate).not.toHaveBeenCalled();
  });
});
