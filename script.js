// Select DOM elements
const tfSelect   = document.getElementById('tf-select');
const btnForecast = document.getElementById('btn-forecast');
const statusEl    = document.getElementById('status');
const chartCanvas = document.getElementById('chart');
const ctx         = chartCanvas.getContext('2d');

// Add click handler
btnForecast.addEventListener('click', () => {
  const tf = tfSelect.value;
  statusEl.textContent = `Generating mock forecast for ${tf}...`;


  console.log("Clicked the button");


  // Generate mock price data
  const prices = [];
  let base = 1940 + Math.random();
  for (let i = 0; i < 50; i++) {
    base += (Math.random() - 0.5); // small variation
    prices.push(base);
  }

  // Generate mock forecast
  const last = prices[prices.length - 1];
  const forecast = last + (Math.random() * 2 - 1); // +/- $1

  drawChart(prices, forecast);
  statusEl.textContent = `Forecasted price: $${forecast.toFixed(2)} (${tf})`;
});

// Simple chart drawing
function drawChart(data, forecast) {
  ctx.clearRect(0, 0, chartCanvas.width, chartCanvas.height);
  const step = chartCanvas.width / (data.length + 1);
  const min = Math.min(...data, forecast);
  const max = Math.max(...data, forecast);
  const scale = chartCanvas.height / (max - min);

  // Draw price line
  ctx.beginPath();
  ctx.strokeStyle = 'blue';
  data.forEach((val, i) => {
    const x = i * step;
    const y = chartCanvas.height - (val - min) * scale;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  // Draw forecast point
  const fx = data.length * step;
  const fy = chartCanvas.height - (forecast - min) * scale;
  ctx.fillStyle = 'red';
  ctx.beginPath();
  ctx.arc(fx, fy, 5, 0, 2 * Math.PI);
  ctx.fill();
}
