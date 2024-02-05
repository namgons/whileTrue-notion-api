require("dotenv").config();
import express, { Application, Request, Response } from "express";
import startOAuthProcess from "./oauth";
import { NotionAccessTokenProps } from "./notion/props";
import { printProblems } from "./notion/utils";

const app: Application = express();

app.get("/oauth/:code", async (req: Request, res: Response) => {
  const code = req.params.code;
  const token: NotionAccessTokenProps = await startOAuthProcess(code);
  console.log("token", token);

  printProblems(token.access_token);
});

app.listen(process.env.PORT);
