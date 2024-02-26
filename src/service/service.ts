import { ProblemPage } from "../common/class";
import { IconType, RequiredColumnName, RequiredColumnType } from "../common/enum";
import { isDatabaseValid } from "../common/utils";
import DefaultDatabaseRequestDto from "../dto/request/DefaultDatabaseRequestDto";
import ProblemPageRequestDto from "../dto/request/ProblemPageRequestDto";
import ProblemRequestDto from "../dto/request/ProblemRequestDto";
import CheckDatabaseResponseDto from "../dto/response/CheckDatabaseResponseDto";
import CheckProblemResponseDto from "../dto/response/CheckProblemResponseDto";
import NotionTokenResponseDto from "../dto/response/NotionTokenResponseDto";
import ProblemListResponseDto from "../dto/response/ProblemListResponseDto";
import SuccessResponseDto from "../dto/response/SuccessResponseDto";
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
  const databaseIconType = response.icon.type;
  let databaseIconSrc;
  if (databaseIconType === IconType.EMOJI) {
    databaseIconSrc = response.icon.emoji;
  } else if (databaseIconType === IconType.EXTERNAL) {
    databaseIconSrc = response.icon.external.url;
  } else if (databaseIconType === IconType.FILE) {
    databaseIconSrc = response.icon.file.url;
  }
  const databaseTitle = response.title[0].plain_text;
  const properties = response.properties;

  if (!isDatabaseValid(properties)) {
    return new CheckDatabaseResponseDto(false);
  }

  return new CheckDatabaseResponseDto(
    true,
    newDatabaseId,
    databaseIconType,
    databaseIconSrc,
    databaseTitle
  );
};

export const getAllProblemList = async ({
  notionApiKey,
  databaseId,
}: DefaultDatabaseRequestDto) => {
  let hasMore = true;
  let nextCursor: any = undefined;

  const problemPageList = [];

  while (hasMore) {
    const response: any = await queryDatabase({
      notionApiKey,
      databaseId,
      startCursor: nextCursor,
    });
    hasMore = response.has_more;
    nextCursor = response.next_cursor;

    for (let page of response.results) {
      const iconType = page?.icon?.type || null;
      let iconSrc = null;
      if (iconType === IconType.EMOJI) {
        iconSrc = page?.icon?.emoji;
      } else if (iconType === IconType.EXTERNAL) {
        iconSrc = page?.icon?.external?.url;
      } else if (iconType === IconType.FILE) {
        iconSrc = page?.icon?.file?.url;
      }

      const properties = page.properties;

      if (!isDatabaseValid(properties)) {
        return new ProblemListResponseDto(false);
      }

      const siteType = properties[RequiredColumnName.PROBLEM_SITE].select?.name;
      const level = properties[RequiredColumnName.PROBLEM_LEVEL].select?.name;
      const number = properties[RequiredColumnName.PROBLEM_NUMBER]?.number;
      const titleList = properties[RequiredColumnName.PROBLEM_TITLE]?.title;
      const url = properties[RequiredColumnName.PROBLEM_URL]?.url;

      if (
        siteType === null ||
        level === null ||
        number === null ||
        titleList === null ||
        titleList.length === 0 ||
        titleList[0]?.plain_text === null ||
        url === null
      ) {
        continue;
      }

      problemPageList.push(
        new ProblemPage(siteType, level, number, titleList[0].plain_text, url, iconType, iconSrc)
      );
    }
  }

  return new ProblemListResponseDto(true, problemPageList);
};

export const insertNewProblem = async ({
  notionApiKey,
  databaseId,
  problemPage,
}: ProblemPageRequestDto) => {
  try {
    await createPage({ notionApiKey, databaseId, problemPage });
    return new SuccessResponseDto(true);
  } catch {
    return new SuccessResponseDto(false);
  }
};

export const isProblemExists = async ({ notionApiKey, databaseId, problem }: ProblemRequestDto) => {
  try {
    const response = await filterDatabase({ notionApiKey, databaseId, problem });
    return new CheckProblemResponseDto(true, response.results.length !== 0);
  } catch {
    return new CheckProblemResponseDto(false);
  }
};
