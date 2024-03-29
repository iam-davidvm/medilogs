const iconSettings = document.querySelector('#btn-results-settings');
const settings = document.querySelector('#results-settings');

iconSettings.addEventListener('click', () => {
  settings.classList.toggle('invisible');
  if (settings.classList.contains('invisible')) {
    iconSettings.innerText = 'Toon instellingen';
  } else {
    iconSettings.innerText = 'Verberg instellingen';
  }
});

const iconStats = document.querySelector('#icon-stats');
const imgStats = iconStats.querySelector('img');
const stats = document.querySelector('.stats');

iconStats.addEventListener('click', function () {
  stats.classList.toggle('invisible');
  if (stats.classList.contains('invisible')) {
    imgStats.src = '/assets/icons/plus.svg';
    imgStats.alt = 'Toon gemiddelden';
  } else {
    imgStats.src = '/assets/icons/minus.svg';
    imgStats.alt = 'Verberg gemiddelden';
  }
});

const iconResults = document.querySelector('#icon-results');
const imgResults = iconResults.querySelector('img');
const tableResults = document.getElementById('table-results');

iconResults.addEventListener('click', function () {
  tableResults.classList.toggle('invisible');
  if (tableResults.classList.contains('invisible')) {
    imgResults.src = '/assets/icons/plus.svg';
    imgResults.alt = 'Toon tabel';
  } else {
    imgResults.src = '/assets/icons/minus.svg';
    imgResults.alt = 'Verberg tabel';
  }
});

const iconGraph = document.querySelector('#icon-graph');
const imgGraph = iconGraph.querySelector('img');
const graph = document.getElementById('graph');

iconGraph.addEventListener('click', () => {
  console.log('click');
  graph.classList.toggle('invisible');
  if (graph.classList.contains('invisible')) {
    imgGraph.src = '/assets/icons/plus.svg';
    imgGraph.alt = 'Toon grafiek';
  } else {
    imgGraph.src = '/assets/icons/minus.svg';
    imgGraph.alt = 'Verberg grafiek';
  }
});
