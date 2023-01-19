const form = document.querySelector('#results-settings-form');

form.addEventListener('submit', function (e) {
  e.preventDefault();
  const data = new FormData(form);

  const days = data.get('days');
  const sort = data.get('sort');

  console.log(days, sort, patientId);
  window.location.assign(
    `/${patientId}/bloeddruk/overzicht?days=${days}&sort=${sort}`
  );
});
