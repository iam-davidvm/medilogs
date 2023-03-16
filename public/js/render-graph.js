if (!isSorted) {
  results.reverse();
}

const bovendruk = results.map((result) => result.bovendruk);
const onderdruk = results.map((result) => result.onderdruk);
const hartslag = results.map((result) =>
  result.hartslag ? result.hartslag : null
);
const tijdstip = results.map((result) => {
  const date = new Date(result.tijdstip);
  const day = date.getDate() < 10 ? `0${date.getDate()}` : `${date.getDate()}`;
  const month =
    date.getMonth() + 1 < 10
      ? `0${date.getMonth() + 1}`
      : `${date.getMonth() + 1}`;
  const year = date.getFullYear();
  const hours =
    date.getHours() < 10 ? `0${date.getHours()}` : `${date.getHours()}`;
  const minutes =
    date.getMinutes() < 10 ? `0${date.getMinutes()}` : `${date.getMinutes()}`;
  return `${day}/${month}/${year.toString().substring(2)}
  ${hours}:${minutes}`;
});

const ctx = document.getElementById('myChart');

new Chart(ctx, {
  type: 'line',
  data: {
    labels: tijdstip,
    datasets: [
      {
        label: 'Bovendruk',
        data: bovendruk,
        borderWidth: 2,
        borderColor: '#ff6e6b',
      },
      {
        label: 'Onderdruk',
        data: onderdruk,
        borderWidth: 2,
        borderColor: '#00b749',
      },
      {
        label: 'Hartslag',
        data: hartslag,
        borderWidth: 2,
        borderColor: '#00a7ff',
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    responsive: true,
  },
});
