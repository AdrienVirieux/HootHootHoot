

function graph() {
  let arraysJSON = JSON.parse(localStorage.getItem('TEMPERATURE'));

  new Chart("myChart", {
    type: 'line',
    data: {
      datasets: [{
        data: [{
          x: '2021-11-06 23:39:30',
          y: 50
        }, {
          x: '2021-11-07 01:00:28',
          y: 60
        }, {
          x: '2021-11-07 09:00:28',
          y: 20
        }]
      }],
    },
    options: {
      scales: {
        x: {
          min: '2021-11-07 00:00:00',
        }
      }
    }
  });
}


export { graph };