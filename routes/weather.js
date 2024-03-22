// const city = "Awarta";
// const date = "2024-03-22"; // Example date in YYYY-MM-DD format

const { get } = require("mongoose");

const getData = async function(city = "Nablus", date = "2024-03-29") {
  try {
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
    );
    const geoData = await geoRes.json();

    if (!geoData.results) throw new Error("Location not found");

    const { latitude, longitude, timezone, name, country_code } =
      geoData.results[0];

    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&date=${date}&timezone=${timezone}&daily=weathercode,temperature_2m_max,temperature_2m_min`
    );
    const weatherData = await weatherRes.json();
    let i =-1
    // console.log(weatherData["daily"].time)
    weatherData["daily"].time.map((time, ind)=> {
      if(time == date){
        i = ind;
        return i
      } 
    })

    if(i == -1) return("There is no available data")
    else{
      const min = Math.floor(weatherData.daily.temperature_2m_min[i])
      const max = Math.ceil(weatherData.daily.temperature_2m_max[i])
    return({"minimum": min, "maximum":max});
    }
    // Handle weather data as needed
  } catch (error) {
    console.error("Error:", error);
  }
};

getData();

module.exports = getData