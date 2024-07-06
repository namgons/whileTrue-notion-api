import { Client } from "@notionhq/client";
import { IconType, RequiredColumnName } from "../common/enum";
import { convertSiteTypeToString } from "../common/utils";

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
  problemPage: any;
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
          name: convertSiteTypeToString(problemPage.siteType),
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

  if (problemPage.iconType === IconType.EMOJI) {
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
