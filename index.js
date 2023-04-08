const apiRoot = "http://localhost:3000";
const searchButton = document.getElementById("search-btn");
function createConcertElements(concerts) {
	const container = document.getElementById("concert-container"); // Get the container element from the DOM
	concerts.forEach((concert) => {
		const concertState = concert.venue.state;
		const concertName = concert.venue.name_v2;
		const concertAddress = concert.venue.address;
		const concertCountry = concert.venue.country;
		const concertCity = concert.venue.city;
		const performers = concert.performers;

		const fullLocation = `${concertAddress} ${concertCity} ${concertState}, ${concertCountry}`;

		const concertElement = document.createElement("div"); // Create a new div element for the book

		const titleElement = document.createElement("h2"); // Create an h2 element for the book title
		titleElement.textContent = performers?.[0]; // Set the text content of the element to the book title
		concertElement.appendChild(titleElement); // Append the title element to the book element

		const locationElement = document.createElement("h2");
		locationElement.textContent = fullLocation;
		concertElement.appendChild(locationElement);

		container.appendChild(bookElement); // Append the book element to the container element
	});
}
searchButton.onclick((e) => {
	const performer = document.getElementByName("performer-search").value;
	fetch(apiRoot + "/events?q=" + performer)
		.then((response) => response.json())
		.then((data) =>
			// need to clear the previous searches
			createConcertElements(data)
		)
		.catch((error) => console.error(error));
});
