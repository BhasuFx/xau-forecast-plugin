// 1. Ensure we have a bridge to Automate
const ctrader = window.cTrader || window.cT;  

// 2. UI elements
const tfSelect   = document.getElementById('tf-select');
const btnForecast = document.getElementById('btn-forecast');
const statusEl    = document.getElementById('status');
const chartCanvas = document.getElementById('chart');
const ctx         = chartCanvas.getContext('2d');

// 3. Handler
btnForecast.addEventListener('click', async () => {
  const tf = tfSelect.value;
  statusEl.textContent = `Fetching ${tf} bars…`;

  try {
    // 4. Fetch historical bars from cTrader
    const bars = await ctrader.symbols.getBars({
      symbol: 'XAU/USD',
      timeframe: tf,
      count: tf === '1d' ? 48 : 100  // e.g. last 100 bars / 2 days for daily
    });

    statusEl.textContent = 'Calling AI prediction…';

    // 5. Prepare payload
    const payload = {
      symbol: 'XAUUSD',
      timeframe: tf,
      bars: bars.map(b => ({
        time: b.time, open: b.open, high: b.high, low: b.low, close: b.close
      }))
    };

    // 6. Call your AI-forecast API
    const resp = await fetch('https://api.deepseek.ai/forecast', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'YOUR_API_KEY_HERE'
      },
      body: JSON.stringify(payload)
    });
    const { forecast, target } = await resp.json();

    statusEl.textContent = `Forecast: ${forecast.toFixed(2)}   Target: ${target.toFixed(2)}`;

    // 7. (Optional) Draw simple chart of recent closes + forecast point
    const closes = bars.map(b => b.close);
    drawChart(closes, forecast);

  } catch (err) {
    console.error(err);
    statusEl.textContent = 'Error: ' + err.message;
  }
});

// 8. Simple line chart
function drawChart(data, forecast) {
  ctx.clearRect(0,0,chartCanvas.width,chartCanvas.height);
  ctx.beginPath();
  const step = chartCanvas.width / (data.length);
  data.forEach((v,i) => {
    const y = chartCanvas.height - (v - Math.min(...data)) / (Math.max(...data)-Math.min(...data)) * chartCanvas.height;
    if (i === 0) ctx.moveTo(0, y);
    else       ctx.lineTo(i*step, y);
  });
  ctx.stroke();

  // forecast marker
  const fxX = data.length*step;
  const fxY = chartCanvas.height - (forecast - Math.min(...data)) / (Math.max(...data)-Math.min(...data)) * chartCanvas.height;
  ctx.fillStyle = 'red';
  ctx.beginPath();
  ctx.arc(fxX, fxY, 5, 0, 2*Math.PI);
  ctx.fill();
}
