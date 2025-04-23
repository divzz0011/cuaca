
const apiKey = 'dcb31590f12db6c25ad4eaff0060f9e1';

function toggleMode() {
  document.body.classList.toggle('dark');
}

async function getWeather() {
  const city = document.getElementById('cityInput').value;
  const resultDiv = document.getElementById('weatherResult');

  if (!city) {
    resultDiv.innerHTML = 'Tolong masukkan nama kota.';
    return;
  }

  try {
    const currentRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=id`
    );
    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=id`
    );

    const currentData = await currentRes.json();
    const forecastData = await forecastRes.json();

    if (currentData.cod !== 200) {
      resultDiv.innerHTML = 'Kota tidak ditemukan 😕';
      return;
    }

    const currentWeatherHTML = `
      <div class="fade-in">
        <h2>${currentData.name}, ${currentData.sys.country}</h2>
        <p>${currentData.weather[0].description}</p>
        <p>🌡️ ${currentData.main.temp} °C</p>
        <img src="animated/${mapToAnimatedIcon(currentData.weather[0].icon)}.svg" width="100" alt="icon cuaca" />
        <h3>Prakiraan 5 Hari</h3>
        <div class="forecast-container">
          ${getFiveDayForecast(forecastData.list)}
        </div>
      </div>
    `;

    resultDiv.innerHTML = currentWeatherHTML;
  } catch (error) {
    resultDiv.innerHTML = 'Terjadi kesalahan saat mengambil data.';
  }
}

function getFiveDayForecast(dataList) {
  const daily = {};

  dataList.forEach(entry => {
    const date = entry.dt_txt.split(" ")[0];
    const time = entry.dt_txt.split(" ")[1];
    if (time === "12:00:00" && !daily[date]) {
      daily[date] = entry;
    }
  });

  return Object.keys(daily).slice(0, 5).map(date => {
    const entry = daily[date];
    const icon = entry.weather[0].icon;
    const desc = entry.weather[0].description;
    const temp = entry.main.temp;
    const day = new Date(date).toLocaleDateString("id-ID", { weekday: 'long' });

    return `
      <div class="forecast-day fade-in">
        <p><strong>${day}</strong></p>
        <img src="animated/${mapToAnimatedIcon(icon)}.svg" width="60" alt="cuaca">
        <p>${Math.round(temp)} °C</p>
        <p style="font-size: 14px">${desc}</p>
      </div>
    `;
  }).join('');
}

function mapToAnimatedIcon(code) {
  const iconMap = {
    '01d': 'day',
    '01n': 'night',
    '02d': 'cloudy-day-1',
    '02n': 'cloudy-night-1',
    '03d': 'cloudy',
    '03n': 'cloudy',
    '04d': 'cloudy',
    '04n': 'cloudy',
    '09d': 'rainy-6',
    '09n': 'rainy-6',
    '10d': 'rainy-3',
    '10n': 'rainy-4',
    '11d': 'thunder',
    '11n': 'thunder',
    '13d': 'snowy-6',
    '13n': 'snowy-6',
    '50d': 'weather',
    '50n': 'weather',
  };
  return iconMap[code] || 'weather';
}
