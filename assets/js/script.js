// global var
var savedCities = [];
var placeForecastCard = document.querySelector('#place-forecast-card');
var placeTodayContainer = document.querySelector('#put-today-here');
var todaysDate = document.querySelector('#todays-date');
var postCityName = document.querySelector('#post-city');
var searchBtn = document.querySelector('#search-button');
var historyContainer = document.querySelector('#history');
var cityName = document.querySelector('#city');

var apiWeatherRoot = 'https://api.openweathermap.org';
var apiKey = 'b0af02ce6d6578e341aee9bf7fa71ce7';

dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);


function makeHistoryBtn() {
    console.log(localStorage);
    historyContainer.innerHTML = '';

    for( var i = savedCities.length - 1; i >= 0; i--) {

        var button = document.createElement('button');
        button.setAttribute('class', 'history-btn col-sm-12');
        button.setAttribute('data-search', savedCities[i]);
        button.textContent = savedCities[i];


        historyContainer.append(button);
    }
}

function loadSavedSearches() {
    var lookInsideHistory = localStorage.getItem('history');

    if (lookInsideHistory) {
        savedCities = JSON.parse(lookInsideHistory);
    }

    makeHistoryBtn();
}

function addToHistory(search) {

    if (savedCities.indexOf(search) !== -1) {
        return;
    }
    
    savedCities.push(search);

    localStorage.setItem('history', JSON.stringify(savedCities));
    makeHistoryBtn();
}

function todaysWeather(city, weather, timezone) {
    placeTodayContainer.innerHTML = '';
    console.log(city, weather);

    var date = dayjs().tz(timezone).format('M/D/YYYY');

    var temp = weather.temp;
    var wind = weather.wind_speed;
    var humidity = weather.humidity;

    todaysDate.setAttribute('class', 'ml-5 font-weight-bold');
    todaysDate.textContent = `${date}`;

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

function createTheCard(forecast, timezone) {
    console.log(forecast);

    var unixTs = forecast.dt;

    var iconUrl = `https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`;
    var iconDescription = forecast.weather[0].description;

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

    var cardImg = document.createElement('img');
    cardImg.setAttribute('src', iconUrl);
    cardImg.setAttribute('alt', iconDescription);
    cardImg.classList.add('icon', 'section', 'media');

    var dateOf = document.createElement('h5');
    dateOf.setAttribute('class', 'card-title text-primary');
    dateOf.textContent =dayjs.unix(unixTs).tz(timezone).format('M/D/YYYY');

    card.append(dateOf, minEl, maxEl, windEL, humidityEl, cardImg);
    cardContainer.append(card);
    placeForecastCard.append(cardContainer);
}

function fiveDay(dailyForecast, timezone) {

    var startDt = dayjs().tz(timezone).add(1, 'day').startOf('day').unix();
    var endDt = dayjs().tz(timezone).add(6, 'day').startOf('day').unix();
    
    // setup the look:
    var forecast = document.createElement('h3');
    forecast.textContent = `5-day forecast: `;
    placeForecastCard.innerHTML = '';
    placeForecastCard.append(forecast);

    for (var i = 0; i < dailyForecast.length; i++) {
        if (dailyForecast[i].dt >= startDt && dailyForecast[i].dt < endDt) {

            createTheCard(dailyForecast[i], timezone);
        }
        
    }
}

function showData(city, data) {
    todaysWeather(city, data.current, data.timezone);
    fiveDay(data.daily, data.timezone);
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
        addToHistory(search);
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

function historySearch(e) {
    console.log('here')
    if (!e.target.matches('.history-btn')) {
        return;
    }

    var btn = e.target;
    var search = btn.getAttribute('data-search');
    fetchGeoCode(search);
}

loadSavedSearches()
searchBtn.addEventListener('click', startSearch);
historyContainer.addEventListener('click', historySearch);