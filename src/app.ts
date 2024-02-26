require("dotenv").config();
import express, { Application, Request, Response } from "express";
import { NotionAccessTokenProps } from "./common/props";
import { createPage, queryDatabase } from "./service/notionapi";

const app: Application = express();

app.get("/notionapi/request-token/:code", async (req: Request, res: Response) => {
  const code = req.params.code;
  const token: NotionAccessTokenProps = await startOAuthProcess(code);
  res.send({
    response: token,
  });

  console.log("\n\n================================================\n\n");
  console.log("token :", token);
  console.log("\n\n================================================\n\n");
});

app.get("/retrieve-database", async (req: Request, res: Response) => {
  console.log("[REQ] Retrieve a Database");
  const response = await retrieveDatabae();
  res.send({
    response,
  });
});

app.get("/create-page", async (req: Request, res: Response) => {
  console.log("[REQ] Create a Page");
  const response = await createPage();
  res.send({
    response,
  });
});

app.get("/query-database", async (req: Request, res: Response) => {
  console.log("[REQ] Query a Database");
  const response = await queryDatabase(undefined);
  res.send({
    response,
  });
});

app.listen(process.env.PORT);
