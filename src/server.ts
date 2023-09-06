import express, { Express, Request, Response } from "express";
import admin from "firebase-admin";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";

import { indexRouter } from "@/routes";
import firebaseConfig from "@/config/firebase-config.json"
const app: Express = express();
const port = process.env.PORT || 8080;

app.use(helmet());
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));

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
