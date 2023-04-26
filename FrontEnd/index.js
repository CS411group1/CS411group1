const apiRoot = "http://localhost:3000";
const searchButton = document.getElementById("search-btn");

window.addEventListener("load", async () => {
	const savedConcerts = document.getElementById("saved-concerts");
	const username = document.getElementById("username");
	const response = await fetch(apiRoot + "/user_airports");
	const data = await response.json();
	username.innerHTML = data.userid;
	data.airports.forEach((airport) => {
		let div = document.createElement("div");
		div.innerHTML = "ICAO_CODE Airport:" + airport;
		savedConcerts.appendChild(div);
	});
});

function createConcertElements(concerts) {
	const container = document.getElementById("concert-container"); // Get the container element from the DOM
	concerts.forEach(async (concert) => {
		const concertState = concert.venue.state;
		const concertName = concert.venue.name_v2;
		const concertAddress = concert.venue.address;
		const concertCountry = concert.venue.country;
		const concertCity = concert.venue.city;
		const performers = concert.performers;
		// input longitude and latitude here
		const long = concert.venue.location.lon;
		const lat = concert.venue.location.lat;

		const response = await fetch(
			apiRoot + `/airports?long=${long}&lat=${lat}`
		);
		const data = await response.json();
		console.log("response data", data);
		const icao_code = data;
		const fullLocation = `${concertAddress} ${concertCity} ${concertState}, ${concertCountry}`;

		const concertElement = document.createElement("div"); // Create a new div element for the book

		const titleElement = document.createElement("h2"); // Create an h2 element for the book title
		titleElement.textContent = performers?.[0].name; // Set the text content of the element to the book title
		concertElement.appendChild(titleElement); // Append the title element to the book element

		const locationElement = document.createElement("h2");
		locationElement.textContent = fullLocation;
		concertElement.appendChild(locationElement);

		const button = document.createElement("button");
		button.textContent = "Save Airport and Concert";
		button.onclick = (e) => {
			fetch(apiRoot + "/user_airports", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					airport: icao_code,
					concert: concertName,
				}),
			});
		};

		const airportElement = document.createElement("div");
		airportElement.textContent = icao_code;
		airportElement.appendChild(button);

		concertElement.append(airportElement);

		container.appendChild(concertElement); // Append the book element to the container element
	});
}
searchButton.onclick = (e) => {
	const performer = document.getElementsByName("performer-search")[0].value;
	fetch(apiRoot + "/events?q=" + performer)
		.then((response) => response.json())
		.then((data) => {
			console.log(data);
			// need to clear the previous searches
			createConcertElements(data.events);
		})
		.catch((error) => console.error(error));
};
