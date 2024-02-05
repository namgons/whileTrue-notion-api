import { ParentDatebase, ParentPage } from "./class";

const createDatabase = async (notionClient: any, parent: ParentDatebase | ParentPage) => {
  return await notionClient.databases.create({
    parent,
    icon: {
      type: "emoji",
      emoji: "📝",
    },
    title: [
      {
        type: "text",
        text: {
          content: "데이터베이스",
          link: null,
        },
      },
    ],
    properties: {
      Name: {
        title: {},
      },
    },
  });
};

const retrieveDatabase = async (notionClient: any, databaseId: string) => {
  return await notionClient.databases.retrieve({
    database_id: databaseId,
  });
};

const queryDatabase = async (notionClient: any, databaseId: string | undefined) => {
  return await notionClient.databases.query({
    database_id: databaseId,
    sorts: [
      {
        property: "Random Number",
        direction: "ascending",
      },
    ],
    page_size: 100,
  });
};

export { createDatabase, retrieveDatabase, queryDatabase };
