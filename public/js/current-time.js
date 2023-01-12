const currentDate = new Date();
// Get the current values
const currentDay = currentDate.getDate();
const currentMonth = currentDate.getMonth();
const currentYear = currentDate.getFullYear();
const currentHours = currentDate.getHours();
const currentMinutes = currentDate.getMinutes();

// Get the elements
const dag = document.getElementById('dag');
const maand = document.getElementById('maand');
const jaar = document.getElementById('jaar');
const uur = document.getElementById('uur');
const min = document.getElementById('min');

dag.value = currentDay < 10 ? `0${currentDay}` : currentDay;

for (const i = 0; i < maand.options.length; i++) {
  if (maand.options[i].value == currentMonth) {
    maand.options[i].selected = true;
    break;
  }
}

jaar.value = currentYear;
uur.value = currentHours < 10 ? `0${currentHours}` : currentHours;
min.value =
  currentMinutes < 10
    ? `0${currentMinutes.toString()}`
    : currentMinutes.toString();
