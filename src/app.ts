require("dotenv").config();
import express, { Application, Request, Response } from "express";
import bodyParser from "body-parser";
import {
  checkDatabase,
  getAllProblemList,
  insertNewProblem,
  isProblemExists,
  requestAccessToken,
} from "./service/service";
import DefaultDatabaseRequestDto from "./dto/request/DefaultDatabaseRequestDto";
import ProblemPageRequestDto from "./dto/request/ProblemPageRequestDto";
import ProblemRequestDto from "./dto/request/ProblemRequestDto";

const app: Application = express();
app.use(bodyParser.json());

app.get("/notion/token/:code", async (req: Request, res: Response) => {
  const code = req.params.code;
  const responseDto = await requestAccessToken(code);
  res.send(responseDto);
});

app.post("/notion/database/check", async (req: Request, res: Response) => {
  const requestDto: DefaultDatabaseRequestDto = req.body;
  const responseDto = await checkDatabase(requestDto);
  res.send(responseDto);
});

app.post("/notion/problem/list", async (req: Request, res: Response) => {
  const requestDto: DefaultDatabaseRequestDto = req.body;
  const responseDto = await getAllProblemList(requestDto);
  res.send(responseDto);
});

app.post("/notion/problem/insert", async (req: Request, res: Response) => {
  const requestDto: ProblemPageRequestDto = req.body;
  const responseDto = await insertNewProblem(requestDto);
  res.send(responseDto);
});

app.post("/notion/problem/check", async (req: Request, res: Response) => {
  const requestDto: ProblemRequestDto = req.body;
  const responseDto = await isProblemExists(requestDto);
  res.send(responseDto);
});

app.listen(process.env.PORT);
