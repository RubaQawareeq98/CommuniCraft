const fetch = require('node-fetch');

async function getLocation(location) {
    try {
        const query = `${location}`;
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&accept-language=en`;
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            if (data && data.length > 0) {
                return {
                    latitude: data[0].lat,
                    longitude: data[0].lon,
                    displayName: data[0].display_name
                };
            } else {
                return "Restaurant not found";
            }
        } else {
            throw new Error("Failed to fetch data");
        }
    } catch (error) {
        console.error("Error:", error.message);
    }
}


    module.exports= getLocation