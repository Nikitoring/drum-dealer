import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { AdminRehearsalPointForm } from '@/components/admin/rehearsal-point-form';

const update = vi.fn();
vi.mock('next/link', () => ({ default: ({ children, ...props }: Record<string, unknown>) => <a {...props}>{children}</a> }));
vi.mock('@/hooks/use-admin-schedule', () => ({
  useAdminPoint: () => ({ data: { id: 'point-1', name: 'Старая точка', address: 'Старый адрес', description: 'Описание', images: [] }, isPending: false, isError: false }),
  useAdminPointMutations: () => ({ update: { mutate: update, isPending: false, isError: false }, uploadImage: { mutate: vi.fn(), isPending: false }, deleteImage: { mutate: vi.fn(), isPending: false } }),
}));

describe('admin / rehearsal-points', () => {
  it('редактирует название и адрес точки', async () => {
    const user = userEvent.setup(); render(<AdminRehearsalPointForm id="point-1" />);
    const name = screen.getByDisplayValue('Старая точка');
    await user.clear(name); await user.type(name, 'Новая точка');
    await user.click(screen.getByRole('button', { name: 'Сохранить' }));
    expect(update).toHaveBeenCalledWith({ name: 'Новая точка', address: 'Старый адрес', description: 'Описание' });
  });
});
