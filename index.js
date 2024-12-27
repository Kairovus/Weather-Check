const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");
const apiKey = "5d8eed0ae6c2ee6d474938ee54ad86dd";

weatherForm.addEventListener("submit", async event => {

    event.preventDefault();

    const city = cityInput.value.trim();

    if (city) {
        try {
            const weatherData = await getWeatherData(city);
            displayWeatherInfo(weatherData);
        }
        catch (e) {
            console.error(e);
            displayError(e);
        }
    } else {
        displayError("Please enter a city");
    }

});

async function getWeatherData(city) {

    const apiurl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    const response = await fetch(apiurl);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
}

function displayWeatherInfo(data) {

    const{  name : city,
            main: {temp, humidity},
            weather: [{description, id}]} = data;

    card.textContent = "";
    card.style.display = "flex";

    const cityDisplay = document.createElement("h1");
    const tempDisplay = document.createElement("p");
    const humidityDisplay = document.createElement("p");
    const descDisplay = document.createElement("p");
    const weatherEmoji = document.createElement("p");

    cityDisplay.textContent = city;
    tempDisplay.textContent = `${(temp - 273.15).toFixed(2)}°C`;
    humidityDisplay.textContent = `Humidity: ${humidity}%`;
    descDisplay.textContent = `Description: ${description}`;
    weatherEmoji.textContent = getWeatherEmoji(id);

    cityDisplay.classList.add("city");
    tempDisplay.classList.add("temperature");
    humidityDisplay.classList.add("humidity");
    descDisplay.classList.add("description");
    weatherEmoji.classList.add("weatherEmoji");

    card.appendChild(cityDisplay);
    card.appendChild(tempDisplay);
    card.appendChild(humidityDisplay);
    card.appendChild(descDisplay);
    card.appendChild(weatherEmoji);
}

function getWeatherEmoji(weatherID) {

    switch(true){
        case weatherID >= 200 && weatherID < 300:
            return "⛈️";
        case weatherID >= 300 && weatherID < 400:
            return "🌦️";
        case weatherID >= 500 && weatherID < 600:
            return "🌧️";
        case weatherID >= 600 && weatherID < 700:
            return "🌨️";
        case weatherID >= 700 && weatherID < 800:
            return "🌫️";
        case weatherID === 800:
            return "☀️";
        case weatherID >= 801 && weatherID < 810:
            return "🌤️";
        default:
            return "❓";
    }

}

function displayError(message) {

    const errorDisplay = document.createElement("p");
    errorDisplay.textContent = message;
    errorDisplay.classList.add("error");

    card.textContent = "";
    card.style.display = "flex";
    card.appendChild(errorDisplay);
}