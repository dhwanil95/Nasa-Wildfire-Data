// onSubmit function retrieves data on wildfire incidents, 
// gets the country name associated with each incident, 
// sorts the incidents alphabetically by country name, and displays the results on an wildfireCards div.
async function onSubmit() {
    wildFireDict = {}
    totalWildFires = 0
    
    await getWildFireData();
    for (let key in wildFireDict) {
        await getCountryName(wildFireDict[key]["longitude"], wildFireDict[key]["latitude"], key)
    }
    let sortedDict = {};
    Object.keys(wildFireDict)
        .sort((a, b) => wildFireDict[a].title.localeCompare(wildFireDict[b].title))
        .forEach(key => sortedDict[key] = wildFireDict[key])
    for (let key in sortedDict) {
        let countryName = sortedDict[key]["country"].toUpperCase().substr(0, 3)

        document.getElementById('wildfireCards').innerHTML += `
                            <div class="item">
                                <p style="font-size: 18px; font-weight: bold; color: #333;">${sortedDict[key]["title"]},  ${countryName}</p>
                            </div>
                        `;
    }
}


// getWildFireData retrieves data on wildfire incidents based on a selected date from NASA API.
async function getWildFireData() {
    let selectedDate = document.getElementById("datepicker1").value;

    // if date is not selected by user
    if(selectedDate == ''){
        Swal.fire({
            title: 'Warning!',
            text: 'Please enter month and year',
            icon: 'warning',
            confirmButtonText: 'OK'
          })
        return;
    }
    // getting month and year from date
    let selectedMonth = selectedDate.split("-")[0];
    let selectedYear = selectedDate.split("-")[1];

    let monthMap = {
        Jan: "01",
        Feb: "02",
        Mar: "03",
        Apr: "04",
        May: "05",
        Jun: "06",
        Jul: "07",
        Aug: "08",
        Sep: "09",
        Oct: "10",
        Nov: "11",
        Dec: "12"
    };

    let fullMonth = monthMap[selectedMonth];

    // Construct the API URL with the selected month and year
    let apiUrl =
        "https://eonet.gsfc.nasa.gov/api/v3/events?start=" +
        selectedYear +
        "-" +
        fullMonth +
        "-01" +
        "&end=" +
        selectedYear +
        "-" +
        fullMonth +
        "-31" +
        "&category=wildfires";

    // fetching data from API
    await fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
            document.getElementById("wildfireCards").innerHTML = "";
            let totalWildFires = data.events.length
            // if no wildFire found
            if (totalWildFires > 0) {
                for (let i = 0; i < data.events.length; i++) {
                    let event = data.events[i];
                    let title = event.title;
                    // add value to the wildFireDict
                    wildFireDict[event.id] = {
                        "title": title,
                        "longitude": event.geometry[0].coordinates[1],
                        "latitude": event.geometry[0].coordinates[0]
                    }
                }
            } else {
                // If there are no events, print "Oh No!"
                document.getElementById("wildfireCards").innerHTML = `
                <div style="width: 400px; height: auto; background-color: #f2f2f2; border-radius: 10px; box-shadow: 0px 0px 10px #ccc; padding: 20px; margin: 20px 0; text-align: center;">
                    <p style="font-size: 18px; font-weight: bold; color: #333;">Oh No!</p>
                </div>
                `;
            }


        })
        .catch((error) => console.error(error));
}


//get the country name from latitude longitude using geonames API
async function getCountryName(eventLatitude, eventLongitude, key) {

    let countryApiUrl = "http://api.geonames.org/countryCodeJSON?lat=" + eventLatitude + "&lng=" + eventLongitude + "&username=dhwanil243"

    return fetch(countryApiUrl)
        .then((countryResponse) => countryResponse.json())
        .then((countryData) => {
            // get the country name from the received data
            wildFireDict[key]["country"] = countryData.countryName
        })
        .catch((error) => console.error(error));
}