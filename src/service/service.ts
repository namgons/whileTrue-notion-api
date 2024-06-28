import { ProblemPage } from "../common/class";
import { IconType, RequiredColumnName } from "../common/enum";
import { convertStringToIconType, convertStringToSiteType, isDatabaseValid } from "../common/utils";
import DefaultDatabaseRequestDto from "../dto/request/DefaultDatabaseRequestDto";
import ProblemPageRequestDto from "../dto/request/ProblemPageRequestDto";
import CheckDatabaseResponseDto from "../dto/response/CheckDatabaseResponseDto";
import ProblemListResponseDto from "../dto/response/ProblemListResponseDto";
import SuccessResponseDto from "../dto/response/SuccessResponseDto";
import { createPage, queryDatabase, retrieveDatabase } from "./notionapi";

export const checkDatabase = async ({ notionApiKey, databaseId }: DefaultDatabaseRequestDto) => {
  let response: any;
  try {
    response = await retrieveDatabase({ notionApiKey, databaseId });
  } catch (error: any) {
    if (error.status === 404) {
      return new CheckDatabaseResponseDto("NOT_FOUND");
    }
    return;
  }

  if (response.object !== "database") {
    return new CheckDatabaseResponseDto("NOT_FOUND");
  }

  const newDatabaseId = response.id;
  const databaseIconType = convertStringToIconType(response?.icon?.type);
  let databaseIconSrc = null;
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
    return new CheckDatabaseResponseDto("INVALID");
  }

  return new CheckDatabaseResponseDto(
    "OK",
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
      const iconType = convertStringToIconType(page?.icon?.type);
      let iconSrc = null;
      if (iconType === IconType.EMOJI) {
        iconSrc = page.icon.emoji;
      } else if (iconType === IconType.EXTERNAL) {
        iconSrc = page.icon.external.url;
      } else if (iconType === IconType.FILE) {
        iconSrc = page.icon.file.url;
      }

      const properties = page.properties;

      if (!isDatabaseValid(properties)) {
        return new ProblemListResponseDto(false);
      }

      const siteType = convertStringToSiteType(
        properties[RequiredColumnName.PROBLEM_SITE].select?.name
      );
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

export const saveNewProblem = async ({
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
