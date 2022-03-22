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