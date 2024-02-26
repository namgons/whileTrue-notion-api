import axios from "axios";
import { Client } from "@notionhq/client";
import { Problem, ProblemPage } from "../common/class";
import { IconType, RequiredColumnName } from "../common/enum";

export const requestToken = async (accessCode: string) => {
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
  const body: any = {
    parent: {
      type: "database_id",
      database_id: databaseId,
    },
    properties: {
      [RequiredColumnName.PROBLEM_SITE]: {
        select: {
          name: problemPage.siteType,
        },
      },
      [RequiredColumnName.PROBLEM_LEVEL]: {
        select: {
          name: problemPage.level,
        },
      },
      [RequiredColumnName.PROBLEM_NUMBER]: {
        number: Number(problemPage.number),
      },
      [RequiredColumnName.PROBLEM_TITLE]: {
        title: [
          {
            text: {
              content: problemPage.title,
            },
          },
        ],
      },
      [RequiredColumnName.PROBLEM_URL]: {
        url: problemPage.url,
      },
    },
  };

  if (problemPage.iconType == IconType.EMOJI) {
    body.icon = {
      type: "emoji",
      emoji: problemPage.iconSrc,
    };
  } else if (problemPage.iconType === IconType.EXTERNAL) {
    body.icon = {
      type: "external",
      external: {
        url: problemPage.iconSrc,
      },
    };
  }

  return await notion.pages.create(body);
};

export const queryDatabase = async ({
  notionApiKey,
  databaseId,
  startCursor,
}: {
  notionApiKey: string;
  databaseId: string;
  startCursor: string | undefined;
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
        { property: RequiredColumnName.PROBLEM_SITE, select: { equals: problem.siteType } },
        { property: RequiredColumnName.PROBLEM_NUMBER, number: { equals: Number(problem.number) } },
        { property: RequiredColumnName.PROBLEM_TITLE, rich_text: { contains: problem.title } },
      ],
    },
  });
};
