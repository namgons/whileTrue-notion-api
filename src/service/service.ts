import { ProblemPage } from "../common/class";
import DefaultDatabaseRequestDto from "../dto/request/DefaultDatabaseRequestDto";
import InsertProblemRequestDto from "../dto/request/InsertProblemRequestDto";
import CheckDatabaseResponseDto from "../dto/response/CheckDatabaseResponseDto";
import NotionTokenResponseDto from "../dto/response/NotionTokenResponseDto";
import ProblemListResponseDto from "../dto/response/ProblemListResponseDto";
import { createPage, queryDatabase, requestToken, retrieveDatabase } from "./notionapi";

export const requestAccessToken = async (accessCode: string) => {
  const response = await requestToken(accessCode);
  return new NotionTokenResponseDto(response);
};

export const checkDatabase = async ({ notionApiKey, databaseId }: DefaultDatabaseRequestDto) => {
  const response: any = await retrieveDatabase({ notionApiKey, databaseId });

  if (response.object !== "database") {
    return new CheckDatabaseResponseDto(false);
  }

  const newDatabaseId = response.id;
  const databaseIcon = response.icon.emoji;
  const databaseTitle = response.title.plain_text;
  const properties = response.properties;

  if (
    !properties.hasOwnProperty("출처") ||
    !properties.hasOwnProperty("난이도") ||
    !properties.hasOwnProperty("문제 번호") ||
    !properties.hasOwnProperty("문제 이름") ||
    !properties.hasOwnProperty("URL")
  ) {
    return new CheckDatabaseResponseDto(false);
  }

  if (
    properties["출처"].type !== "select" ||
    properties["난이도"].type !== "select" ||
    properties["문제 번호"].type !== "number" ||
    properties["문제 이름"].type !== "title" ||
    properties["URL"].type !== "url"
  ) {
    return new CheckDatabaseResponseDto(false);
  }

  return new CheckDatabaseResponseDto(true, newDatabaseId, databaseIcon, databaseTitle);
};

export const getAllProblemList = async ({
  notionApiKey,
  databaseId,
}: DefaultDatabaseRequestDto) => {
  let hasMore = true;
  let nextCursor: any = "";

  const problemPageList = [];

  while (hasMore) {
    const response: any = await queryDatabase({
      notionApiKey,
      databaseId,
      startCursor: nextCursor === "" ? nextCursor : undefined,
    });
    hasMore = response.has_more;
    nextCursor = response.next_cursor;
    try {
      for (let page of response.results) {
        const iconType = page.icon.type;
        let iconSrc = "";
        if (iconType === "emoji") {
          iconSrc = page.icon.emoji;
        } else if (iconType === "external") {
          iconSrc = page.icon.external.url;
        }

        const properties = page.properties;
        const site = properties["출처"].select.name;
        const level = properties["난이도"].select.name;
        const number = properties["문제 번호"].number;
        const title = properties["문제 이름"].title[0].plain_text;
        const url = properties["URL"].url;

        problemPageList.push(new ProblemPage(site, level, number, title, url, iconType, iconSrc));
      }
    } catch (error) {
      return new ProblemListResponseDto(false);
    }
  }

  return new ProblemListResponseDto(true, problemPageList);
};

export const insertNewProblem = async ({
  notionApiKey,
  databaseId,
  problemPage,
}: InsertProblemRequestDto) => {
  const response = await createPage({ notionApiKey, databaseId, problemPage });
};
