const capitalize = (s) =>
  s.length === 0 ? "" : s[0]?.toUpperCase() + s.substring(1);

const getMonday = () => new Date(1970, 0, 5);

function range(a, b) {
  if (b === undefined) {
    b = a;
    a = 0;
  }

  return Array.from(Array(b).keys()).map((i) => a + i);
}

function updateWeekdays(lang, offset = 0) {
  const weekdays = getWeekdays(lang);
  const divs = range(7)
    .map((i) => weekdays[(i + offset) % 7])
    .map((day) => {
      const div = document.createElement("div");
      div.append(day);

      return div;
    });

  const week = document.querySelector(".week");
  clearElement(week);
  week.append(...divs);
}

function getWeekdays(lang) {
  const dayFmt = new Intl.DateTimeFormat(lang, {
    weekday: "long",
  });

  return range(7)
    .map(() => getMonday())
    .map((mon, i) => (mon.setDate(mon.getDate() + i), mon))
    .map(dayFmt.format)
    .map(capitalize);
}

function clearElement(el) {
  while (el.firstChild) {
    el.lastChild.remove();
  }
}

function setWeekOpts(lang) {
  const opts = getWeekdays(lang).map((day, index) => {
    const opt = document.createElement("option");
    opt.value = index;
    opt.append(day);

    return opt;
  });

  const firstDaySelect = document.querySelector("#first-day");
  clearElement(firstDaySelect);
  firstDaySelect.append(...opts);
}

document.addEventListener("DOMContentLoaded", () => {
  const firstDaySelect = document.querySelector("#first-day");
  const langSelect = document.querySelector("#language");

  const langOpts = navigator.languages.map((lang) => {
    const opt = document.createElement("option");
    opt.value = lang;
    opt.append(
      capitalize(new Intl.DisplayNames(lang, { type: "language" }).of(lang))
    );

    return opt;
  });

  langSelect.append(...langOpts);

  langSelect.addEventListener("change", ({ target: { value: lang } }) => {
    const dayOffset = firstDaySelect.value;
    setWeekOpts(lang);
    updateWeekdays(lang, dayOffset);
    firstDaySelect.value = dayOffset;
  });

  firstDaySelect.addEventListener("change", ({ target: { value: offset } }) => {
    const week = document.querySelector(".week");
    updateWeekdays(langSelect.value, Number(offset));
  });

  setWeekOpts(navigator.language);
  updateWeekdays(navigator.language);
});
