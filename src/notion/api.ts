require("dotenv").config();
const { Client } = require("@notionhq/client");

const notion = new Client({ auth: process.env.NOTION_API_KEY });

export const retrieveDatabae = async () => {
  return await notion.databases.retrieve({ database_id: process.env.DATABASE_ID });
};

export const createPage = async () => {
  return await notion.pages.create({
    parent: {
      type: "database_id",
      database_id: process.env.DATABASE_ID,
    },
    properties: {
      "문제 사이트": {
        select: {
          name: "SWEA",
        },
      },
      "문제 이름": {
        title: [
          {
            text: {
              content: "Tuscan kale",
            },
          },
        ],
      },
      "문제 번호": {
        number: 999999999,
      },
      URL: {
        url: "www.naver.com",
      },
    },
  });
};

export const queryDatabase = async () => {
  return await notion.databases.query({
    database_id: process.env.DATABASE_ID,
  });
};
