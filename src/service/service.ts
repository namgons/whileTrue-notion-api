import { ProblemPage } from "../common/class";
import { IconType, RequiredColumnName, RequiredColumnType } from "../common/enum";
import DefaultDatabaseRequestDto from "../dto/request/DefaultDatabaseRequestDto";
import ProblemPageRequestDto from "../dto/request/ProblemPageRequestDto";
import ProblemRequestDto from "../dto/request/ProblemRequestDto";
import CheckDatabaseResponseDto from "../dto/response/CheckDatabaseResponseDto";
import NotionTokenResponseDto from "../dto/response/NotionTokenResponseDto";
import ProblemListResponseDto from "../dto/response/ProblemListResponseDto";
import {
  createPage,
  filterDatabase,
  queryDatabase,
  requestToken,
  retrieveDatabase,
} from "./notionapi";

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
    !properties.hasOwnProperty(RequiredColumnName.PROBLEM_SITE) ||
    !properties.hasOwnProperty(RequiredColumnName.PROBLEM_LEVEL) ||
    !properties.hasOwnProperty(RequiredColumnName.PROBLEM_NUMBER) ||
    !properties.hasOwnProperty(RequiredColumnName.PROBLEM_TITLE) ||
    !properties.hasOwnProperty(RequiredColumnName.PROBLEM_URL)
  ) {
    return new CheckDatabaseResponseDto(false);
  }

  if (
    properties[RequiredColumnName.PROBLEM_SITE].type !== RequiredColumnType.PROBLEM_SITE ||
    properties[RequiredColumnName.PROBLEM_LEVEL].type !== RequiredColumnType.PROBLEM_LEVEL ||
    properties[RequiredColumnName.PROBLEM_NUMBER].type !== RequiredColumnType.PROBLEM_NUMBER ||
    properties[RequiredColumnName.PROBLEM_TITLE].type !== RequiredColumnType.PROBLEM_TITLE ||
    properties[RequiredColumnName.PROBLEM_URL].type !== RequiredColumnType.PROBLEM_URL
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
        if (iconType === IconType.EMOJI) {
          iconSrc = page.icon.emoji;
        } else if (iconType === IconType.EXTERNAL) {
          iconSrc = page.icon.external.url;
        }

        const properties = page.properties;
        const site = properties[RequiredColumnName.PROBLEM_SITE].select.name;
        const level = properties[RequiredColumnName.PROBLEM_LEVEL].select.name;
        const number = properties[RequiredColumnName.PROBLEM_NUMBER].number;
        const titleList = properties[RequiredColumnName.PROBLEM_TITLE].title;
        const url = properties[RequiredColumnName.PROBLEM_URL].url;

        if (
          site === null ||
          level === null ||
          number === null ||
          titleList.length === 0 ||
          titleList[0].plain_text === null ||
          url === null
        ) {
          continue;
        }

        problemPageList.push(
          new ProblemPage(site, level, number, titleList[0].plain_text, url, iconType, iconSrc)
        );
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
}: ProblemPageRequestDto) => {
  const response = await createPage({ notionApiKey, databaseId, problemPage });
};

export const isProblemExists = async ({ notionApiKey, databaseId, problem }: ProblemRequestDto) => {
  const response = await filterDatabase({ notionApiKey, databaseId, problem });
  return new CheckProblemResponseDto(response.results.length !== 0);
};
