require("dotenv").config();
import express, { Application, Request, Response } from "express";
import startOAuthProcess from "./oauth";

const app: Application = express();

app.get("/oauth/:code", (req: Request, res: Response) => {
  const code = req.params.code;
  const token = startOAuthProcess(code);
  console.log("Received");
  console.log("code", code);
});

app.listen(process.env.PORT);
