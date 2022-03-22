// global var
var historySearch = [];
var placeForecastCard = document.querySelector('#place-forecast-card');
var placeTodayContainer = document.querySelector('#put-today-here');
var todaysDate = document.querySelector('#todays-date');
var postCityName = document.querySelector('#post-city');
var searchBtn = document.querySelector('#search-button');
var historyContainer = document.querySelector('#history');
var cityName = document.querySelector('#city');

var apiWeatherRoot = 'https://api.openweathermap.org';
var apiKey = 'b0af02ce6d6578e341aee9bf7fa71ce7';

function todaysWeather(city, weather) {
    console.log(city, weather);

    var temp = weather.temp;
    var wind = weather.wind_speed;
    var humidity = weather.humidity;

    var today = document.createElement('ul');

    var tempList = document.createElement('li');
    tempList.textContent = `Temp: ${temp}`;

    var windEL = document.createElement('li');
    windEL.textContent = `Wind: ${wind} mph`;

    var huEl = document.createElement('li');
    huEl.textContent = `Humidity: ${humidity} %`;
    
    today.append(tempList, windEL, huEl);
    placeTodayContainer.append(today);
}

function createTheCard(forecast) {
    console.log(forecast);

    // set api data as variable
    var tempMin = forecast.temp.min;
    var tempMax = forecast.temp.max;
    var wind = forecast.wind_speed;
    var humidity = forecast.humidity;


    var cardContainer = document.createElement('div');
    cardContainer.setAttribute('class', 'row');

    var card = document.createElement('div');
    card.setAttribute('class', 'card fluid small warning section col-sm-12');

    var minEl = document.createElement('p');
    minEl.textContent = `Minimum Temp: ${tempMin}`;

    var maxEl = document.createElement('p');
    maxEl.textContent = `Maximum Temp: ${tempMax}`;

    var windEL = document.createElement('p');
    windEL.textContent = `Wind Speed: ${wind} mph`;

    var humidityEl = document.createElement('p');
    humidityEl.textContent = `Humidity: ${humidity} %`;


    card.append(minEl, maxEl, windEL, humidityEl);
    cardContainer.append(card);
    placeForecastCard.append(cardContainer);
}

function fiveDay(dailyForecast) {
    
    // setup the look:
    var forecast = document.createElement('h3');
    forecast.textContent = `5-day forecast: `;
    placeForecastCard.innerHTML = '';
    placeForecastCard.append(forecast);

    for (var i = 0; i < dailyForecast.length; i++) {
        createTheCard(dailyForecast[i]);
        if (i == 4) {
            break;
        }
    }
}

function showData(city, data) {
    todaysWeather(city, data.current);
    fiveDay(data.daily);
}

function fetchTheWeather(location) {

    var { lon } = location;
    var { lat } = location;
    var city = location.name;

    var apiForecast = `${apiWeatherRoot}/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly,alerts&appid=${apiKey}`;

    fetch(apiForecast)
    .then(function(response) {

        if (response.ok) {
            response.json().then(function(data) {
                postCityName.textContent = `${city}`;
                showData(city, data);
            })
        }
    })
}

function fetchGeoCode(search) {

    // variable for the api info that we are looking for, this api will give us the coordinates of any given city name, if not, it'll console.log an error
    var apiUrl = `${apiWeatherRoot}/geo/1.0/direct?q=${search}&limit=1&appid=${apiKey}`;

    fetch(apiUrl)
    .then(function(response) {
     // request was successful
     if (response.ok) {
       response.json().then(function(data) {
        console.log(data[0]);
        fetchTheWeather(data[0]);
       });
     } else {
       alert('Error: Location doesn`t exist!');
     }
   })
}

function startSearch(e) {
    if(!cityName.value) {
        return;
    }
    e.preventDefault();
    var search = cityName.value.trim();
    fetchGeoCode(search);
    cityName.value = '';
}

searchBtn.addEventListener('click', startSearch);