"use client";

import { useState, type FormEvent } from "react";

const slots = ["10:00 — 11:00", "11:00 — 12:00", "14:00 — 15:00", "15:00 — 16:00"];
const days = Array.from({ length: 35 }, (_, index) => index < 1 || index > 30 ? null : index);

export function RehearsalBooking() {
  const [selectedDay, setSelectedDay] = useState(16);
  const [selectedSlot, setSelectedSlot] = useState("14:00 — 15:00");
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function submitBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <section className="booking-area" aria-labelledby="booking-title">
      <h2 id="booking-title">Выберите дату и время</h2>
      <div className="booking-picker">
        <div className="calendar">
          <div className="calendar-head"><button aria-label="Предыдущий месяц" type="button">‹</button><span>Апрель 2025</span><button aria-label="Следующий месяц" type="button">›</button></div>
          <div aria-label="Календарь на апрель 2025" className="calendar-grid" role="group">
            {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((day) => <span key={day}>{day}</span>)}
            {days.map((day, index) => day ? <button aria-label={`${day} апреля`} aria-pressed={selectedDay === day} className={index % 7 > 4 ? "is-weekend" : ""} key={day} onClick={() => { setSelectedDay(day); setSubmitted(false); }} type="button">{day}</button> : <span aria-hidden="true" key={`empty-${index}`} />)}
          </div>
        </div>
        <div className="slot-list" aria-label="Свободные временные слоты">
          {slots.map((slot) => <button aria-pressed={selectedSlot === slot} className="slot-button" key={slot} onClick={() => { setSelectedSlot(slot); setSubmitted(false); }} type="button">{slot}</button>)}
          <button className="button button-red" onClick={() => setShowForm((visible) => !visible)} type="button">Записаться <span aria-hidden="true">→</span></button>
        </div>
      </div>

      {showForm && <form className="booking-form" onSubmit={submitBooking}>
        <h3>Заявка на {selectedDay} апреля, {selectedSlot}</h3>
        <label>Ваше имя<input autoComplete="name" name="name" required /></label>
        <label>Телефон<input autoComplete="tel" name="phone" required type="tel" /></label>
        <label className="consent"><input required type="checkbox" /> Согласен на обработку персональных данных</label>
        <button className="button button-red" type="submit">Отправить заявку</button>
        {submitted && <p role="status">Заявка отправлена. Администратор подтвердит запись.</p>}
      </form>}
    </section>
  );
}
