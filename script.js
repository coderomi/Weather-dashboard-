const apiKey = "20825e16cfeeecccd99b727d6ea46157";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const carousel = document.getElementById("carousel");
const toggle = document.getElementById("themeToggle");
const body = document.body;

// Map weather to image names
const weatherImgs = {
    Clear: "clear.png",
    Clouds: "clouds.png",
    Drizzle: "drizzle.png",
    Rain: "rain.png",
    Snow: "snow.png",
    Mist: "mist.png",
    Wind: "wind.png",
    Humidity: "humidity.png"
};

// Weather API
async function checkWeather(city) {
    if (!city) return;
    try {
        const res = await fetch(apiUrl + city + `&appid=${apiKey}`);
        if (!res.ok) { document.querySelector(".error").style.display = "block"; return; }
        const data = await res.json();
        document.querySelector(".city").innerHTML = `${data.name}, ${data.sys.country}`;
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "℃";
        document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
        document.querySelector(".wind").innerHTML = Math.round(data.wind.speed * 3.6) + " km/h";
        document.querySelector(".condition").innerHTML = data.weather[0].description;
        document.querySelector(".pressure").innerHTML = data.main.pressure + " hPa";
        document.querySelector(".visibility").innerHTML = (data.visibility / 1000).toFixed(1) + " km";
        document.querySelector(".feels_like").innerHTML = Math.round(data.main.feels_like) + "℃";
        const temp = data.main.temp;
        body.classList.remove("cold", "mild", "hot", "very-hot");
        if (temp < 15) body.classList.add("cold");
        else if (temp < 25) body.classList.add("mild");
        else if (temp < 35) body.classList.add("hot");
        else body.classList.add("very-hot");
        document.querySelector(".error").style.display = "none";
        const iconImg = weatherImgs[data.weather[0].main] || "clear.png";
        document.querySelector(".weather-icon").style.backgroundImage = `url('images/${iconImg}')`;
    } catch (err) { console.error(err); }
}

// Bottom Carousel
const cities = ["Mumbai", "Delhi", "Bangalore", "Kolkata", "Chennai", "Hyderabad", "Pune", "Jaipur", "Goa", "Nagpur"];
async function loadCarousel() {
    carousel.innerHTML = "";
    const allCards = [];
    for (let city of cities) {
        try {
            const res = await fetch(apiUrl + city + `&appid=${apiKey}`);
            const data = await res.json();
            const imgSrc = weatherImgs[data.weather[0].main] || "clear.png";
            const card = document.createElement("div");
            card.className = "weather-card";
            card.innerHTML = `
        <h4>${data.name}</h4>
        <img src="images/${imgSrc}" alt="">
        <p>${Math.round(data.main.temp)}°C</p>
        <span>${data.weather[0].description}</span>
        <span>Humidity: ${data.main.humidity}%</span>
        <span>Wind: ${Math.round(data.wind.speed * 3.6)} km/h</span>
        <span>Pressure: ${data.main.pressure} hPa</span>
        <span>Visibility: ${(data.visibility / 1000).toFixed(1)} km</span>
        <span>Feels Like: ${Math.round(data.main.feels_like)}℃</span>
      `;
            card.addEventListener("click", () => checkWeather(city));
            allCards.push(card.outerHTML);
        } catch (err) { console.error(err); }
    }
    carousel.innerHTML = allCards.join('') + allCards.join('');
}

// Events
searchBtn.addEventListener("click", () => checkWeather(searchBox.value.trim()));
searchBox.addEventListener("keypress", (e) => { if (e.key === "Enter") checkWeather(searchBox.value.trim()); });
toggle.addEventListener("change", () => {
    if (toggle.checked) { body.classList.remove("day"); body.classList.add("night"); }
    else { body.classList.remove("night"); body.classList.add("day"); }
});

// Load default
checkWeather("Pune");
loadCarousel();
