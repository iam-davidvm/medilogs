const iconResults = document.querySelector('#icon-results');
const imgResults = iconResults.querySelector('img');
const tableResults = document.getElementById('table-results');

iconResults.addEventListener('click', function () {
  tableResults.classList.toggle('invisible');
  if (tableResults.classList.contains('invisible')) {
    imgResults.src = '/assets/eye.svg';
    imgResults.alt = 'Toon tabel';
  } else {
    imgResults.src = '/assets/eye-off.svg';
    imgResults.alt = 'Verberg tabel';
  }
});

const iconStats = document.querySelector('#icon-stats');
const imgStats = iconStats.querySelector('img');
const stats = document.querySelector('.stats');

iconStats.addEventListener('click', function () {
  stats.classList.toggle('invisible');
  if (stats.classList.contains('invisible')) {
    imgStats.src = '/assets/eye.svg';
    imgStats.alt = 'Toon gemiddelden';
  } else {
    imgStats.src = '/assets/eye-off.svg';
    imgStats.alt = 'Verberg gemiddelden';
  }
});

const iconGraph = document.querySelector('#icon-graph');
const imgGraph = iconGraph.querySelector('img');
// const stats = document.querySelector('.stats');
