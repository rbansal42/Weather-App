const API_KEY = "0bf91a646ff68cc39a33d2bf7ac853d3";

// Current Forecast
const getCurrentWeatherData = async () => {
	const city = "pune";
	const response = await fetch(
		`https://pro.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
	);

	return response.json();
};

const formatTemperature = (temp) => `${temp?.toFixed(1)}°`;
const createIconURL = (icon) => `http://openweathermap.org/img/wn/${icon}@2x.png`;

const loadCurrentForecast = ({
	name,
	main: { temp, temp_max, temp_min },
	weather: [{ description }],
}) => {
	const currentForecastElement = document.querySelector("#current-forecast");
	currentForecastElement.querySelector(".city").textContent = name;
	currentForecastElement.querySelector(".temp").textContent = formatTemperature(temp);
	currentForecastElement.querySelector(".description").textContent = description;
	currentForecastElement.querySelector(
		".min-max-temp"
	).textContent = `H: ${formatTemperature(temp_max)} L:${formatTemperature(temp_min)}`;
};

// Hourly Forecast

const getHourlyForecastData = async ({ name: city }) => {
	const response = await fetch(
		`https://pro.openweathermap.org/data/2.5/forecast/hourly?q=${city}&appid=${API_KEY}&units=metric`
	);
	const data = await response.json();
	// console.log(data);
	return data.list.map((forecast) => {
		const {
			main: { temp, temp_max, temp_min },
			dt,
			dt_txt,
			weather: [{ description, icon }],
		} = forecast;

		return { temp, temp_max, temp_min, dt, dt_txt, description, icon };
	});
};

const loadHourlyForecast = (hourlyForecast) => {
	// console.log(hourlyForecast);

	let dataFor12Hours = hourlyForecast.slice(1, 13);

	const hourlyContainer = document.querySelector(".hourly-container");
	let innerHTMLString = ``;

	for ({ temp, icon, dt_txt } of dataFor12Hours) {
		innerHTMLString += `<article>
				<h2 class="time">${dt_txt.split(" ")[1].split(":")[0]}</h2>
				<img
					src=${createIconURL(icon)}
					alt="${icon}"
					class="icon" />
				<p class="hourly-temp">${formatTemperature(temp)}</p>
				</article>`;
	}
	hourlyContainer.innerHTML = innerHTMLString;
};

const loadFeelsLike = ({ main: { feels_like } }) => {
	let container = document.querySelector("#feels-like");
	container.querySelector(".feels-like-temp").textContent =
		formatTemperature(feels_like);
};

const loadHumidity = ({ main: { humidity } }) => {
	let container = document.querySelector("#humidity");
	container.querySelector(".humidity-text").textContent = `${humidity}%`;
};

// Main function
document.addEventListener("DOMContentLoaded", async () => {
	// Calling functions one by one

	// Storing current weather data
	const currentWeather = await getCurrentWeatherData();

	// Populating fields using the current weather data
	loadCurrentForecast(currentWeather);
	loadFeelsLike(currentWeather);
	loadHumidity(currentWeather);

	// storing hourly forecast
	const hourlyForecast = await getHourlyForecastData(currentWeather);
	// Populating fields using the hourly weather data
	loadHourlyForecast(hourlyForecast);
});
