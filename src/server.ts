import express, { Express, Request, Response } from "express";
import admin from "firebase-admin";
import cookieParser from "cookie-parser";
import dotenv from "dotenv"
import helmet from "helmet";
import cors from "cors";

import { indexRouter } from "@/routes";
import firebaseConfig from "@/config/firebase-config.json"
const app: Express = express();
const port = process.env.PORT || 8080;

app.use(helmet());
// setup cors
app.use(cors({ credentials: true }));

let ALLOWED_ORIGINS = ["http://localhost:5173", "https://retro-pgf-hub.vercel.app"];
app.use((req, res, next) => {
  let origin = req.headers.origin || "https://retro-pgf-hub.vercel.app";
  let theOrigin = (ALLOWED_ORIGINS.indexOf(origin) >= 0) ? origin : ALLOWED_ORIGINS[0];
  res.header("Access-Control-Allow-Origin", theOrigin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  next();
})

app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));
dotenv.config();

admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig),
  storageBucket: "retropgf-hub.appspot.com",
});

app.get("/", (req: Request, res: Response) => {
  res.send("Express TypeScript Server is Running");
});

app.use(indexRouter);

app.listen(port, () => {
  console.log(`✨[server]: Server is running at http://localhost:${port}`);
});
