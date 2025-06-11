// Função para buscar o clima com base no nome da cidade
function mostrarLoader() {
  document.getElementById('loader').style.display = 'flex';
}

function esconderLoader() {
  document.getElementById('loader').style.display = 'none';
}

async function buscarClima() {
  const cityName = document.getElementById('cityInput').value.trim();
  const weatherDiv = document.getElementById('weather');

  if (!cityName) {
      weatherDiv.innerHTML = "Por favor, digite o nome da cidade!";
      return;
  }

  mostrarLoader(); // Aparece só quando o usuário clica!

  const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1&language=pt&format=json`;

  try {
      const geoResponse = await fetch(geoUrl);
      const geoData = await geoResponse.json();

      if (!geoData.results || geoData.results.length === 0) {
          weatherDiv.innerHTML = `Cidade "${cityName}" não encontrada.`;
          return;
      }

      const { latitude, longitude, name, country } = geoData.results[0];

      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

      const weatherResponse = await fetch(weatherUrl);
      const weatherData = await weatherResponse.json();

      const weather = weatherData.current_weather;

      weatherDiv.innerHTML = `
          <h2>${name}, ${country}</h2>
          <p>Temperatura: ${weather.temperature}°C</p>
          <p>Velocidade do Vento: ${weather.windspeed} km/h</p>
          <p>Direção do Vento: ${weather.winddirection}°</p>
          <p>Hora da Leitura: ${weather.time}</p>
      `;
  } catch (error) {
      console.error(error);
      weatherDiv.innerHTML = "Erro ao buscar dados do clima.";
  } finally {
      esconderLoader(); // Some no final, seja sucesso ou erro
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const cepInput = document.getElementById('cep');

  cepInput.addEventListener('blur', function () {
      const cep = cepInput.value.replace(/\D/g, '');

      if (cep.length !== 8) {
          alert('CEP inválido! Digite 8 números.');
          return;
      }

      mostrarLoader();

      fetch(`https://viacep.com.br/ws/${cep}/json/`)
          .then(response => {
              if (!response.ok) {
                  throw new Error('Erro na requisição');
              }
              return response.json();
          })
          .then(data => {
              if (data.erro) {
                  alert('CEP não encontrado!');
                  return;
              }

              // Preenche automaticamente o campo da cidade
              document.getElementById('cityInput').value = data.localidade;

              // Busca o clima automaticamente após preencher a cidade
              buscarClima();
          })
          .catch(error => {
              console.error('Erro ao buscar o CEP:', error);
              alert('Erro ao buscar o CEP. Tente novamente.');
          })
          .finally(() => {
              esconderLoader();
          });
  });

  // Máscara do campo CEP
  IMask(cepInput, {
      mask: '00000-000'
  });
});

// Limpa todos os campos

const clearButton = document.getElementById('clearButton');
const cityInput = document.getElementById('cityInput');
const cep = document.getElementById('cep');
const weatherDisplay = document.getElementById('weather');

clearButton.addEventListener('click', () => {
  // Limpa o valor do input
  cityInput.value = '';

  // Limpa o conteúdo do weather
  weatherDisplay.innerHTML = 'Informe o CEP da sua cidade e confira a previsão do clima';

  // Limpa o valor de cep
  cep.value = '';
});

//Dark Mode Toggle
const toggleTheme = document.getElementById('toggle-theme');

toggleTheme.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');

    if (document.body.classList.contains('dark-theme')) {
        toggleTheme.textContent = '☀️';
    } else {
        toggleTheme.textContent = '🌙';
    }
});