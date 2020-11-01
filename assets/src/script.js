// Open Weather API Key 
var API_KEY = "cda1f07925ad0cdc3c871ac042890bef";
var cityName = "Toronto";
var weatherObj = [];
var weatherForcastObj = [];
var currentTime = "";
var currentCity = "";
var tempinF = ""; // Temperature conversion
var feelsLike = "";
var humidity = "";
var visibility = "";
var imgSrc = "";
var uvIndex = 1;

// Load default location
function getWeatherByDefaultLoc() {
    // Default query request if user denies to share location
    console.log("Weather for University of Toronto coordinates");

    // Coordinates for University of Toronto
    var defaultLat = 43.7;
    var defaultLon = -79.42;

    //build the openWeatherAPI query url
    var openWeatherAPI = `https://api.openweathermap.org/data/2.5/weather?lat=${defaultLat}&lon=${defaultLon}&units=imperial&appid=${API_KEY}`;

    // Make the AJAX request to the API - Get weather by location coordinates
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": openWeatherAPI,
        "method": "GET",
    }

    $.ajax(settings).done(function (response) {
        if(response){
            $(".weather-results").empty();
            $(".weather-details").empty();
            $('.forecast').empty();
            clearObj();
            renderWeather(response);
            cityName = response.name;

            // Forecast API
            var forecastAPI = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=imperial&appid=" + API_KEY;

            // Make the AJAX request to the API - Get weather forecast by city name
            var settings = {
                "async": true,
                "crossDomain": true,
                "url": forecastAPI,
                "method": "GET",
            }
            
            $.ajax(settings).done(function (res) {
                if(res){
                    console.log(res.list);
                    addForecastToStorage(res.list);
                    renderWeatherForecast(res.list);
                }
            });
        }
    });
}

// Retrieving from Browser Local Storage
function getDataFromStorage() {
    let cities = [];
    const getCity = localStorage.getItem('City');
    if (getCity) cities = JSON.parse(getCity);
    return cities;
}

// Store Weather response data into Browser Local Storage
function addToLocalStorage(response){

    weatherObj.push({
        city: response.name,
        country: response.sys.country,
        timezone: response.timezone,
        sunrise: response.sys.sunrise,
        sunset: response.sys.sunset,
        coordLat: response.coord.lat,
        coordLon: response.coord.lon,
        visibility: response.visibility,
        weatherDesc: response.weather[0].description,
        weatherIcon: response.weather[0].icon,
        weatherMain: response.weather[0].main,
        windDeg: response.wind.deg,
        windSpeed: response.wind.speed,
        mainFeelsLike: response.main.feels_like,
        mainGrndLevel: response.main.grnd_level,
        mainHumidity: response.main.humidity,
        mainPressure: response.main.pressure,
        mainSeaLevel: response.main.sea_level,
        mainTemp: response.main.temp,
        mainTempMax: response.main.temp_max,
        mainTempMin: response.main.temp_min,
      });

      // Store Stock Summary Data into Browser Local Storage
      localStorage.setItem('weatherResultObj', JSON.stringify(weatherObj));
}

// Store Weather response data into Browser Local Storage
function addForecastToStorage(response){

    weatherForcastObj.push({
      });

      // Store Stock Summary Data into Browser Local Storage
      localStorage.setItem('weatherForecastObj', JSON.stringify(weatherForcastObj));
}


// Clear the elements
function clearObj(){
    $('#weather-icon').attr('src', '');
    currentTime = "";
    currentCity = "";
    tempinF = ""; // Temperature conversion
    feelsLike = "";
    humidity = "";
    visibility = "";
    uvIndex = "";
    imgSrc = "";
}

// Temperature conversion to metric units
function tempToMetric(tempF){
    return parseInt( (tempF - 32) * (5 / 9) );
}


// Render the weather to the page
function renderWeather(response) {
    imgSrc = `http://openweathermap.org/img/w/${response.weather[0].icon}.png`;

    visibilityInKms = (response.visibility/1000).toFixed(1);

    currentTime = moment().format('M/D/YYYY');
    currentCity = `${response.name}, ${response.sys.country}`;
    tempMetric = tempToMetric(response.main.temp); 
    feelsLike = `${response.main.feels_like}°`;
    humidity = `${response.main.feels_like}%`;
    visibility = `${visibilityInKms} km`;
    uvIndex = 1;

    $(".weather-results").append(
        `
            <li id="current-time"> ${currentTime} </li>
            <li id="current-city"> ${currentCity} </li>
            <li id="current-temp">
                <img class="weather-icon" src=${imgSrc} alt="weather icon">
                <p <span class="weather-temp">${tempMetric}</span>°C</p>
            </li>
        `
    )

    $(".weather-details").append(
        `
            <li>Feels like: <span class="weather-value">${feelsLike}</span> </li>
            <li>Humidity: <span class="weather-value"> ${humidity} </span> </li>
            <li>Visibility: <span class="weather-value"> ${visibility} </span> </li>
            <li>UV Index: <span class="weather-value">${uvIndex}</span> </li>
        `
    )
}

// Writes the 5 day forecast
function renderWeatherForecast(forecast) {
    // console.log(forecast.length);

    if(forecast.length > 0){
        for (let i = 0; i < 5; i++) {
            // Get date for current day iteration
            var forecastDate = moment().add((i + 1), 'days').format('M/D/YYYY');;
            // Get weather icon for current day iteration
            var foreWeatherIcon = 'https://openweathermap.org/img/w/' + forecast[i].weather[0].icon + '.png';
            // Get temperature  for current day iteration
            var forecastTemp = tempToMetric(forecast[i].main.temp);
            var forecastTempFeelLike = tempToMetric(forecast[i].main.feels_like);
            var forecastTempMax = tempToMetric(forecast[i].main.temp_max);
            var forecastTempMin = tempToMetric(forecast[i].main.temp_min);
            // Get Humidity for current day iteration
            var forecastHumidtiy = forecast[i].main.humidity;
    
            // Build forcast cards
            $(".forecast").append(
                `
                    <div id="card" class="card bg-primary">
                        <ul class="card-body">
                            <li class="card-title">${forecastDate}</li>
                            <li>
                            <img src=${foreWeatherIcon} alt="">
                            </li>
                            <li class="card-text"> Temp: <span class="card-label"> ${forecastTemp + String.fromCharCode(176) + "C"} </span> </li>
                            <li class="card-text"> Max Temp: <span class="card-label"> ${forecastTempMin + String.fromCharCode(176) + "C"} </span> </li>
                            <li class="card-text"> Min Temp: <span class="card-label"> ${forecastTempMax + String.fromCharCode(176) + "C"} </span> </li>
                            <li class="card-text"> Feel Like: <span class="card-label"> ${forecastTempFeelLike + String.fromCharCode(176) + "C"} </span> </li>
                            <li class="card-text"> Humidity: <span class="card-label"> ${forecastHumidtiy + "%"}</li>
                        </ul>
                    </div>
                `
            )
        }
    }
}


// Event listener for city search
$(".search-button").click((e) => {
    console.log("Search initaited");
    e.preventDefault();

    // search input
    cityName = $('.search-input').val();

    // If input is empty, do nothing
    if (cityName != "") {
        console.log("Search initaited");

        // Building the query URL
        var openWeatherAPI = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${API_KEY}`;

        // Make the AJAX request to the API - Get weather by city name
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": openWeatherAPI,
            "method": "GET",
        }

        $.ajax(settings).done(function (response) {
            if(response){
                console.log(response);
                $(".weather-results").empty();
                $(".weather-details").empty();
                $('.forecast').empty();
                clearObj();
                addToLocalStorage(response);
                renderWeather(response);

                // Forecast API
                var forecastAPI = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=imperial&appid=" + API_KEY;

                // Make the AJAX request to the API - Get weather forecast by city name
                var settings = {
                    "async": true,
                    "crossDomain": true,
                    "url": forecastAPI,
                    "method": "GET",
                }
                
                $.ajax(settings).done(function (res) {
                    if(res){
                        console.log(res.list);
                        addForecastToStorage(res.list);
                        renderWeatherForecast(res.list);
                    }
                });
            } else{
                console.log("Empty data responded from OpenWeather API");
            }
        });

    } else return;

});

// Init
getWeatherByDefaultLoc();