require("dotenv").config();
import express, { Application, Request, Response } from "express";
import startOAuthProcess from "./oauth";
import { NotionAccessTokenProps } from "./notion/props";
import { printProblems } from "./notion/utils";
import { retrieveDatabae } from "./notion/test";

const app: Application = express();

app.get("/oauth/:code", async (req: Request, res: Response) => {
  const code = req.params.code;
  const token: NotionAccessTokenProps = await startOAuthProcess(code);
  res.send({
    response: token,
  });
});

app.get("/retrieve-database", async (req: Request, res: Response) => {
  const response = await retrieveDatabae();
  res.send({
    response,
  });
});

app.listen(process.env.PORT);
