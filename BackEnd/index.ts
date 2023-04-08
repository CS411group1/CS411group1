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

app.listen(3000, () => {
	console.log("Server listening on port 3000");
});
