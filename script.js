function* rangeGen(a, b) {
  if (b === undefined) {
    b = a;
    a = 0;
  }

  for (let i = a; i < b; i++) {
    yield i;
  }
}

const capitalize = (s) =>
  s.length === 0 ? "" : s[0]?.toUpperCase() + s.substring(1);

const range = (a, b) => Array.from(rangeGen(a, b));
const getMonday = () => new Date(1970, 0, 5);

function buildWeek(weekdays, offset = 0) {
  const week = document.querySelector(".week");

  range(7).forEach((i) => {
    const index = (i + offset) % 7;
    const day = weekdays[index];
    const div = document.createElement("div");
    div.append(day);
    week.append(div);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const firstDaySelect = document.querySelector("select#first-day");
  const dayFmt = new Intl.DateTimeFormat("sv-SE", {
    weekday: "long",
  });

  const weekdays = range(7).map((index) => {
    const day = getMonday();
    day.setDate(day.getDate() + index);

    return capitalize(dayFmt.format(day));
  });

  const opts = weekdays.map((day, index) => {
    const opt = document.createElement("option");
    opt.value = index;
    opt.append(day);

    return opt;
  });

  opts.forEach((opt) => {
    firstDaySelect.appendChild(opt);
  });

  buildWeek(weekdays);

  firstDaySelect.addEventListener("change", ({ target: { value: offset } }) => {
    const week = document.querySelector(".week");
    while (week.firstChild) {
      week.lastChild.remove();
    }

    buildWeek(weekdays, Number(offset));
  });
});
