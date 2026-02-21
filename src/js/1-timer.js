// 1-timer.js

import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

// Отримуємо елементи DOM
const startBtn = document.querySelector('[data-start]');
const dateInput = document.querySelector('#datetime-picker');

const daysEl = document.querySelector('[data-days]');
const hoursEl = document.querySelector('[data-hours]');
const minutesEl = document.querySelector('[data-minutes]');
const secondsEl = document.querySelector('[data-seconds]');

let userSelectedDate = null;
let timerId = null;

// Додаємо ведучі нулі
function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

// Перетворення мс у дні/год/хв/сек
function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

// Оновлення таймера на сторінці
function updateTimer(ms) {
  const { days, hours, minutes, seconds } = convertMs(ms);

  daysEl.textContent = addLeadingZero(days);
  hoursEl.textContent = addLeadingZero(hours);
  minutesEl.textContent = addLeadingZero(minutes);
  secondsEl.textContent = addLeadingZero(seconds);
}

// Ініціалізація flatpickr після завантаження DOM
document.addEventListener('DOMContentLoaded', () => {
  flatpickr(dateInput, {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,

    onClose(selectedDates) {
      const selectedDate = selectedDates[0];
      const currentDate = new Date();

      if (!selectedDate || selectedDate <= currentDate) {
        iziToast.error({
          message: 'Please choose a date in the future',
          position: 'topRight',
        });
        startBtn.disabled = true;
        userSelectedDate = null;
        return;
      }

      userSelectedDate = selectedDate;
      startBtn.disabled = false;
    },
  });
});

// Обробка кнопки Start
startBtn.addEventListener('click', () => {
  if (!userSelectedDate) return;

  startBtn.disabled = true;
  dateInput.disabled = true;

  timerId = setInterval(() => {
    const currentTime = new Date();
    const timeLeft = userSelectedDate - currentTime;

    if (timeLeft <= 0) {
      clearInterval(timerId);
      updateTimer(0);
      dateInput.disabled = false; // дозволяємо вибрати нову дату
      return;
    }

    updateTimer(timeLeft);
  }, 1000);
});
