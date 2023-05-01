import express, { Request, Response } from "express";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";
import passport from "passport";
import path from "path";
import session from "express-session";
import { firestore } from "./firebase";
import { addDoc, collection } from "firebase/firestore";
require("./auth");
dotenv.config();

const app = express();

app.use(
	cors({
		origin: "*",
	})
);
app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());

const env = {
	rapidApiKey: process.env.rapidApiKey,
	rapidApiHost: process.env.rapidApiHost,
	clientId: process.env.seatGeekClientId,
};

const seatgeekApi = "https://api.seatgeek.com/2/events/";

app.get("/auth/google", passport.authenticate("google", { scope: ["email"] }));

app.get(
	"/auth/google/callback",
	passport.authenticate("google", {
		successRedirect: "/concerts",
		failureRedirect: "/auth/google/failure",
	})
);

//@ts-ignore
const isLoggedIn = (req, res, next) => {
	if (req.user) {
		next();
	} else {
		res.status(401).send({
			error: "Unauthorized",
		});
	}
};

app.use("/static", express.static(path.join(__dirname, "../FrontEnd/")));

app.get("/concerts", isLoggedIn, (req, res) => {
	res.sendFile(path.join(__dirname, "../FrontEnd/concerts.html"));
});

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "../FrontEnd/index.html"));
});

app.get("/login", (req, res) => {
	res.sendFile(path.join(__dirname, "../FrontEnd/login.html"));
});

app.get("/auth/google/failure", (req, res) => {
	res.send("failure");
});

app.get("/user_airports", isLoggedIn, (req, res) => {
	const data = {
		//@ts-ignore
		userid: req.user.email,

		//@ts-ignore
		icaoCode: req.user.icaoCode,

		//@ts-ignore
		airportName: req.user.airportName,

		// concert and passportjs
		//@ts-ignore
		concert: req.user.concert,
	};
	res.send(data);
});

app.post("/user_airports", isLoggedIn, async (req, res) => {
	const { airportName, concert, icaoCode } = req.body;
	const airportCollection = collection(firestore, "airports");
	const doc = await addDoc(airportCollection, {
		//@ts-ignore
		userid: req.user.email,
		airportName,
		concert,
		icaoCode,
	});
	res.send({
		status: "success",
	});
});

app.get("/events", (req, res) => {
	const eventUrl = "?q=";
	const performer = req.query.q;
	const getPerformerEventsUrl = `${seatgeekApi}${eventUrl}${performer}`;
	axios
		.get(getPerformerEventsUrl, {
			// @ts-ignore
			auth: {
				username: env.clientId,
			},
		})
		.then((response) => {
			res.send(response.data);
		})
		.catch((error) => {
			console.log(error);
		});
});
app.get("/nearest_airports", async (req, res) => {
	const aviationApiKey = process.env.AVIATION_STACK_KEY;
	//@ts-ignore
	const longitude = parseInt(req.query.long);
	//@ts-ignore
	const latitude = parseInt(req.query.lat);
	const getNearestAirport = async (
		longitude: number,
		latitude: number,
		api_key: string
	): Promise<any | null> => {
		const url = `http://api.aviationstack.com/v1/airports?access_key=${api_key}&limit=1&offset=0&lat=${latitude}&lon=${longitude}`;
		try {
			const response = await axios.get(url);
			let responseLength = response.data.data.length;
			let n = responseLength;
			let r = Math.floor(Math.random() * n) + 1;
			const c = response.data.data[r - 1].icao_code;
			const airportName = response.data.data[r - 1].airport_name;
			return {
				icaoCode: c,
				airportName,
			};
		} catch (error) {
			console.error(error);
			return null;
		}
	};
	const nearestAirport = await getNearestAirport(
		longitude,
		latitude,
		aviationApiKey
	);
	res.send(nearestAirport);
});

/*
app.get("/airports", async (req, res) => {
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
*/
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
