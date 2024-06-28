require("dotenv").config();
import express, { Application, Request, Response } from "express";
import bodyParser from "body-parser";
import { checkDatabase, getAllProblemList, saveNewProblem } from "./service/service";
import DefaultDatabaseRequestDto from "./dto/request/DefaultDatabaseRequestDto";
import ProblemPageRequestDto from "./dto/request/ProblemPageRequestDto";

const app: Application = express();
app.use(bodyParser.json());

app.post("/api/notion/database/check", async (req: Request, res: Response) => {
  const requestDto: DefaultDatabaseRequestDto = req.body;
  const responseDto = await checkDatabase(requestDto);
  res.send(responseDto);
});

app.post("/api/notion/problem/list", async (req: Request, res: Response) => {
  const requestDto: DefaultDatabaseRequestDto = req.body;
  const responseDto = await getAllProblemList(requestDto);
  res.send(responseDto);
});

app.post("/api/notion/problem/save", async (req: Request, res: Response) => {
  const requestDto: ProblemPageRequestDto = req.body;
  const responseDto = await saveNewProblem(requestDto);
  res.send(responseDto);
});

app.listen(process.env.PORT);
