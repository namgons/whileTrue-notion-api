require("dotenv").config();
import axios from "axios";
import { NotionAccessTokenProps } from "../common/props";
import { Client } from "@notionhq/client";
import { Problem, ProblemPage } from "../common/class";

export const requestToken = async (accessCode: string): Promise<NotionAccessTokenProps> => {
  const NotionEndPoint = "https://api.notion.com/v1/oauth/token";

  const encoded = Buffer.from(
    `${process.env.OAUTH_CLIENT_ID}:${process.env.OAUTH_CLIENT_SECRET}`
  ).toString("base64");

  return await axios
    .post(
      NotionEndPoint,
      {
        grant_type: "authorization_code",
        code: accessCode,
        redirect_uri: process.env.REDIRECT_URI,
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Basic ${encoded}`,
        },
      }
    )
    .then((resp) => resp.data);
};

export const retrieveDatabase = async ({
  notionApiKey,
  databaseId,
}: {
  notionApiKey: string;
  databaseId: string;
}) => {
  const notion = new Client({ auth: notionApiKey });
  return await notion.databases.retrieve({ database_id: databaseId });
};

export const createPage = async ({
  notionApiKey,
  databaseId,
  problemPage,
}: {
  notionApiKey: string;
  databaseId: string;
  problemPage: ProblemPage;
}) => {
  const notion = new Client({ auth: notionApiKey });
  const properties: any = {
    "문제 사이트": {
      select: {
        name: problemPage.site,
      },
    },
    난이도: {
      select: {
        name: problemPage.level,
      },
    },
    "문제 이름": {
      title: [
        {
          text: {
            content: problemPage.title,
          },
        },
      ],
    },
    "문제 번호": {
      number: Number(problemPage.number),
    },
    URL: {
      url: problemPage.url,
    },
  };

  if (problemPage.iconType == "emoji") {
    properties.icon = {
      type: "emoji",
      emoji: problemPage.iconSrc,
    };
  } else if (problemPage.iconType === "external") {
    properties.icon = {
      type: "external",
      external: {
        url: problemPage.iconSrc,
      },
    };
  }

  return await notion.pages.create({
    parent: {
      type: "database_id",
      database_id: databaseId,
    },
    properties,
  });
};

export const queryDatabase = async ({
  notionApiKey,
  databaseId,
  startCursor,
}: {
  notionApiKey: string;
  databaseId: string;
  startCursor?: string;
}) => {
  const notion = new Client({ auth: notionApiKey });
  return await notion.databases.query({
    database_id: databaseId,
    start_cursor: startCursor,
  });
};

export const filterDatabase = async ({
  notionApiKey,
  databaseId,
  problem,
}: {
  notionApiKey: string;
  databaseId: string;
  problem: Problem;
}) => {
  const notion = new Client({ auth: notionApiKey });
  return await notion.databases.query({
    database_id: databaseId,
    filter: {
      and: [
        { property: "문제 사이트", select: { equals: problem.site } },
        { property: "문제 번호", number: { equals: Number(problem.number) } },
        { property: "문제 이름", rich_text: { contains: problem.title } },
      ],
    },
  });
};
