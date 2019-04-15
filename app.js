window.addEventListener('load', ()=> {  
    let long;
    let lat;
    let locationTimezone = document.querySelector(".location-timezone");
    let temperatureDegree = document.querySelector(".temperature-degree");
    let temperatureDescription = document.querySelector(".temperature-description");
    let temperatureSection = document.querySelector(".degree-section");
    let temperatureSpan = document.querySelector(".degree-section span");

    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(position => {
        //console.log(position);
        long = position.coords.longitude;
        lat = position.coords.latitude;

        const proxy = "https://cors-anywhere.herokuapp.com/";
        const api = `${proxy}https://api.darksky.net/forecast/4e4af64e900d0df370ef314a0591b7b5/${lat},${long}`;
        const apiTown = `http://www.mapquestapi.com/geocoding/v1/reverse?key=RPeEA4ZRjzkVdkMvF7HkhiSAtRYcqya2&location=${lat},${long}&includeRoadMetadata=true&includeNearestIntersection=true`;

        //get town from lat and alt
        fetch(apiTown)
          .then(responset =>{
            return responset.json();
          })
          .then(datat =>{
            console.log(datat);
            const city = datat.results[0].locations[0].adminArea5;
            locationTimezone.textContent = city;
          });
        
        //get other info from alt and lat
        fetch(api)
          .then(response =>{
            return response.json();
          })
          .then(data =>{
            const {temperature, summary, icon} = data.currently;
            temperatureDegree.textContent = Math.floor(temperature);
            temperatureDescription.textContent = summary;
            setIcon(icon, document.querySelector(".icon"));

            let celsius = (temperature - 32)*(5/9);

            //change background colour depneding temperature
            if(celsius < 5){
              document.body.style.background = "linear-gradient(rgb(0,211,238), rgb(62,86,185))";
            }
            else if(celsius >= 5 && celsius < 15){
              document.body.style.background = "linear-gradient(rgb(15,230,154), rgb(117,156,228))";
            }
            else if(celsius >= 15 && celsius < 25){
              document.body.style.background = "linear-gradient(rgb(208,230,15), rgb(117,228,217))";
            }
            else{
              document.body.style.background = "linear-gradient(rgb(186,39,1), rgb(228,218,117))";
            }


            temperatureSection.addEventListener("click", () => {
              if(temperatureSpan.textContent === "F"){
                temperatureSpan.textContent = "C";
                temperatureDegree.textContent = Math.floor(celsius);
              }
              else {
                temperatureSpan.textContent = "F";
                temperatureDegree.textContent = Math.floor(temperature);
              }
            });

          });
      });
    }

    function setIcon(icon, iconID){
      const skycons = new Skycons({color: "white"});
      const currentIcon = icon.replace(/-/g, "_").toUpperCase();
      skycons.play();
      return skycons.set(iconID, Skycons[currentIcon]);
    }


});

