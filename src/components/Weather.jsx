import { useState, useEffect, useRef } from "react";
import Lottie from "react-lottie";
import "./Weather.css";
import search_icon from "../assets/search.png";
import cloudysun from "../assets/cloudysun.json";
import sunny from "../assets/sunny.json";
import thunder from "../assets/thunder.json";
import rainy from "../assets/rainy.json";
import snow from "../assets/snow.json";
import wind from "../assets/wind.json";
import humidity from "../assets/humidity.json";

const Weather = () => {
   const inputRef = useRef();
   const [weatherData, setWeatherData] = useState(false);
   const [country, setCountry] = useState("Sweden");
   const [theme, setTheme] = useState("sweden");

   const allIcons = {
      "01d": { animationData: sunny },
      "01n": { animationData: sunny },
      "02d": { animationData: cloudysun },
      "02n": { animationData: cloudysun },
      "03d": { animationData: cloudysun },
      "03n": { animationData: cloudysun },
      "04d": { animationData: rainy },
      "04n": { animationData: rainy },
      "09d": { animationData: thunder },
      "09n": { animationData: thunder },
      "10d": { animationData: thunder },
      "10n": { animationData: thunder },
      "13d": { animationData: snow },
      "13n": { animationData: snow },
   };

   const weatherJokes = {
      clear: "Why did the weather report go to jail? For being too sunny!",
      cloud: "Why did the cloud go to school? To improve its cirrus-ness!",
      rain: "What do you call a rainy day in a desert? A wet dream!",
      snow: "Why don’t snowmen like the sun? Because it melts their hearts!",
      drizzle:
         "What does a drizzle say? Just a little bit more moisture, please!",
   };

   const cities = {
      Sweden: ["Stockholm", "Gothenburg", "Malmo", "Uppsala", "Vasteras"],
      Rwanda: ["Kigali", "Huye", "Nyamagabe", "Kayonza", "Rubavu"],
   };

   const search = async (city) => {
      try {
         const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&units=metric&appid=${
            import.meta.env.VITE_APP_ID
         }`;

         const response = await fetch(url);
         const data = await response.json();

         if (!response.ok) {
            alert(data.message);
            return;
         }

         const icon = allIcons[data.weather[0].icon] || allIcons["01d"];
         setWeatherData({
            humidity: data.main.humidity,
            windSpeed: data.wind.speed,
            temperature: Math.floor(data.main.temp),
            location: data.name,
            icon: icon,
            joke: getWeatherJoke(data.weather[0].icon),
         });
      } catch (error) {
         setWeatherData(false);
         console.error("Error in fetching the data", error);
      }
   };

   const getWeatherJoke = (iconCode) => {
      if (iconCode.includes("01") || iconCode.includes("02")) {
         return weatherJokes.clear;
      } else if (iconCode.includes("03") || iconCode.includes("04")) {
         return weatherJokes.cloud;
      } else if (iconCode.includes("09") || iconCode.includes("10")) {
         return weatherJokes.rain;
      } else if (iconCode.includes("13")) {
         return weatherJokes.snow;
      } else {
         return weatherJokes.drizzle;
      }
   };

   useEffect(() => {
      search(cities[country][0]);
   }, [country]);

   const changeCountry = (newCountry) => {
      setCountry(newCountry);
      setTheme(newCountry.toLowerCase());
   };

   const defaultOptions = {
      loop: true,
      autoplay: true,
      rendererSettings: {
         preserveAspectRatio: "xMidYMid slice",
      },
   };

   return (
      <div className={`weather ${theme}`}>
         <div className="country-selector">
            <button onClick={() => changeCountry("Sweden")}>Sweden</button>
            <button onClick={() => changeCountry("Rwanda")}>Rwanda</button>
         </div>
         <div className="search-bar">
            <select ref={inputRef}>
               {cities[country].map((city) => (
                  <option key={city} value={city}>
                     {city}
                  </option>
               ))}
            </select>
            <img
               src={search_icon}
               alt=""
               onClick={() => search(inputRef.current.value)}
            />
         </div>

         {weatherData ? (
            <>
               <Lottie
                  options={{
                     ...defaultOptions,
                     animationData: weatherData.icon.animationData,
                  }}
                  height={200}
                  width={200}
               />
               <p className="temperature">{weatherData.temperature}°C</p>
               <p className="location">
                  {weatherData.location}, {country}
               </p>
               <p className="weather-joke">{weatherData.joke}</p> {}
               <div className="weather-data">
                  <div className="col">
                     <Lottie
                        options={{ ...defaultOptions, animationData: humidity }}
                        height={60}
                        width={60}
                     />
                     <div>
                        <p>{weatherData.humidity}%</p>
                        <span>Humidity</span>
                     </div>
                  </div>
                  <div className="col">
                     <Lottie
                        options={{ ...defaultOptions, animationData: wind }}
                        height={60}
                        width={60}
                     />
                     <div>
                        <p>{weatherData.windSpeed} km/h</p>
                        <span>Wind speed</span>
                     </div>
                  </div>
               </div>
            </>
         ) : (
            <p>Loading...</p>
         )}
      </div>
   );
};

export default Weather;
