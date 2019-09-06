
const chartData = {
  labels: [],
  datasets: [
    {
      name: 'Max',
      values: []
    },
    {
      name: 'Average',
      values: []
    },
    {
      name: 'Min',
      values: []
    }
  ]
};

const chart = new frappe.Chart('#chart', {
  title: 'generation score history',
  type: 'line',
  height: 200,
  data: chartData
});
