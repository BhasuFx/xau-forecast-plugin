const canvas = document.getElementById('forecastCanvas');
const ctx = canvas.getContext('2d');
const status = document.getElementById('status');

async function getForecast() {
    const timeframe = document.getElementById('timeframe').value;
    status.innerText = 'Simulating price fetch...';

    // Simulated bar data: random close prices around 1940
    const closePrices = [];
    let base = 1940 + Math.random();
    for (let i = 0; i < 20; i++) {
        base += (Math.random() - 0.5); // small fluctuation
        closePrices.push(base);
    }

    status.innerText = 'Calling AI prediction...';

    // Simulated forecast based on last close
    const lastClose = closePrices[closePrices.length - 1];
    const forecast = lastClose + (Math.random() * 2 - 1); // +/- $1 range

    drawChart(closePrices, forecast, timeframe);

    status.innerText = `Forecast for ${timeframe}: $${forecast.toFixed(2)}`;
}

function drawChart(prices, forecast, timeframe) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const w = canvas.width;
    const h = canvas.height;
    const padding = 30;
    const chartW = w - padding * 2;
    const chartH = h - padding * 2;

    const maxPrice = Math.max(...prices, forecast);
    const minPrice = Math.min(...prices, forecast);
    const range = maxPrice - minPrice;

    const pxPerUnit = chartH / range;

    // Draw line chart for prices
    ctx.beginPath();
    ctx.strokeStyle = '#4CAF50';
    prices.forEach((p, i) => {
        const x = padding + (i / (prices.length - 1)) * chartW;
        const y = h - padding - ((p - minPrice) * pxPerUnit);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Draw forecast point
    const forecastX = w - padding;
    const forecastY = h - padding - ((forecast - minPrice) * pxPerUnit);
    ctx.beginPath();
    ctx.arc(forecastX, forecastY, 5, 0, 2 * Math.PI);
    ctx.fillStyle = '#FF5722';
    ctx.fill();

    // Draw text
    ctx.fillStyle = '#000';
    ctx.fillText(`Forecast: $${forecast.toFixed(2)}`, forecastX - 100, forecastY - 10);
}
