import express, { Request, Response } from "express";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

const app = express();

app.use(
	cors({
		origin: "*",
	})
);
app.use(express.json());
const env = {
	rapidApiKey: process.env.rapidApiKey,
	rapidApiHost: process.env.rapidApiHost,
	clientId: process.env.seatGeekClientId,
};

console.log(env.rapidApiHost);
console.log(env.rapidApiKey);
console.log(env.clientId);
app.get("/", (req: Request, res: Response) => {
	res.send("Hello World!");
});

const seatgeekApi = "https://api.seatgeek.com/2/events/";

app.get("/events", (req, res) => {
	const eventUrl = "?q=";
	const performer = req.query.q;
	const getPerformerEventsUrl = `${seatgeekApi}${eventUrl}${performer}`;
	console.log("Performer Event Url", getPerformerEventsUrl);
	axios
		.get(getPerformerEventsUrl, {
			auth: {
				// @ts-ignore
				username: env.clientId,
			},
		})
		.then((response) => {
			console.log("SeatGeek Response Data", response.data);
			res.send(response.data);
		})
		.catch((error) => {
			console.log(error);
		});
});

app.post("/airports", async (req, res) => {
	const getNearestAirport = async (
		longitude: number,
		latitude: number,
		api_key: string
	): Promise<string | null> => {
		const url = `http://api.aviationstack.com/v1/airports?access_key=${api_key}&limit=1&offset=0&lat=${latitude}&lon=${longitude}`;
		try {
			const response = await axios.get(url);
			const c = response.data.data[0].icao_code;
			return c;
		} catch (error) {
			console.error(error);
			return null;
		}
	};

	const getAirportFromICAOCode = async (
		icaoCode: string,
		api_key: string
	) => {
		const url = `https://aeroapi.flightaware.com/aeroapi/airports/${icaoCode}`;
		//console.log("Before try/catch axios - url");
		try {
			//console.log("Before axios call to flightaware");
			const response = await axios.get(url, {
				headers: {
					Accept: "application/json; charset=UTF-8",
					"x-apikey": api_key,
				},
			});
			//console.log("AFteraxios call to flightaware");
			return response.data;
		} catch (error) {
			console.error(error);
			return null;
		}
	};

	//@ts-ignore
	const longitude = parseInt(req.query.long);
	//@ts-ignore
	const latitude = parseInt(req.query.lat);
	const aviationApiKey = process.env.AVIATION_STACK_KEY;
	const flightAwareApiKey = process.env.FLIGHT_AWARE_KEY;
	const code = await getNearestAirport(
		longitude,
		latitude,
		//@ts-ignore
		aviationApiKey
	);
	if (code) {
		const airportData = await getAirportFromICAOCode(
			code,
			//@ts-ignore
			flightAwareApiKey
		);
		res.json(airportData);
	} else {
		res.send({});
	}
});

/*
app.get("/users", () => {
	console.log(env.rapidApiHost);
	console.log(env.rapidApiKey);
	const options = {
		method: "GET",
		url: "https://skyscanner50.p.rapidapi.com/api/v1/searchAirport",
		params: { query: "london" },
		headers: {
			"X-RapidAPI-Key": env.rapidApiKey,
			"X-RapidAPI-Host": env.rapidApiHost,
		},
	};
	console.log("received a response");
	axios
		.request(options)
		.then(function (response) {
			console.log(response.data);
		})
		.catch(function (error) {
			console.error(error);
		});
});
*/

app.listen(3000, () => {
	console.log("Server listening on port 3000");
});
