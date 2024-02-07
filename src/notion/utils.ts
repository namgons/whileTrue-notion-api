import { Client } from "@notionhq/client";
import { queryDatabase } from "./database";

const createNotionClient = (accessToken: string | undefined) => {
  return new Client({
    auth: accessToken,
  });
};

const printProblems = async (token: string | undefined) => {
  const resp = await queryDatabase(createNotionClient(token), process.env.DATEBASE_ID);

  const array = [];

  for (const selected of resp.results) {
    array.push(selected.properties["Problem Name"].title[0].plain_text);
  }

  console.log(array);
  console.log(resp.results.length);
};

export { createNotionClient, printProblems };
