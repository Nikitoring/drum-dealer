import { create } from 'zustand';

type BookingState = {
  selectedPointId: string | null;
  selectedDate: string;
  selectedSlotId: string | null;
  setPoint: (id: string) => void;
  setDate: (date: string) => void;
  setSlot: (id: string | null) => void;
};

const today = new Date();
const localDate = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

export const useBookingStore = create<BookingState>((set) => ({
  selectedPointId: null,
  selectedDate: localDate(today),
  selectedSlotId: null,
  setPoint: (id) => set({ selectedPointId: id, selectedSlotId: null }),
  setDate: (date) => set({ selectedDate: date, selectedSlotId: null }),
  setSlot: (id) => set({ selectedSlotId: id }),
}));
