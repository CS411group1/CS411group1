import express, { Request, Response } from "express";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
const app = express();

const env = {
	rapidApiKey: process.env.rapidApiKey,
	rapidApiHost: process.env.rapidApiHost,
};

app.get("/", (req: Request, res: Response) => {
	res.send("Hello World!");
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
