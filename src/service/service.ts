import { ProblemPage } from "../common/class";
import { IconType, RequiredColumnName, SiteType } from "../common/enum";
import { convertStringToIconType, convertStringToSiteType, isDatabaseValid } from "../common/utils";
import DefaultDatabaseRequestDto from "../dto/request/DefaultDatabaseRequestDto";
import ProblemPageRequestDto from "../dto/request/ProblemPageRequestDto";
import CheckDatabaseResponseDto from "../dto/response/CheckDatabaseResponseDto";
import ProblemListResponseDto from "../dto/response/ProblemListResponseDto";
import SuccessResponseDto from "../dto/response/SuccessResponseDto";
import { createPage, queryDatabase, retrieveDatabase } from "./notionapi";

export const checkDatabase = async ({
  notionApiKey,
  databaseId,
}: DefaultDatabaseRequestDto): Promise<CheckDatabaseResponseDto> => {
  let response: any;
  try {
    response = await retrieveDatabase({ notionApiKey, databaseId });
  } catch (error: any) {
    if (error.status === 404) {
      return new CheckDatabaseResponseDto("NOT_FOUND");
    }
  }

  if (response.object !== "database") {
    return new CheckDatabaseResponseDto("NOT_FOUND");
  }

  const newDatabaseId = response.id;
  const databaseIconType = convertStringToIconType(response?.icon?.type);
  const databaseIconSrc = getIconSrcByType(databaseIconType, response);

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
}: DefaultDatabaseRequestDto): Promise<ProblemListResponseDto> => {
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
      const iconSrc = getIconSrcByType(iconType, page);

      const properties = page.properties;

      if (!isDatabaseValid(properties)) {
        return new ProblemListResponseDto(false);
      }

      const { siteType, level, number, titleList, url } = parseProperty(properties);

      if (!isColumnDataIncluded(siteType, level, number, titleList, url)) {
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
}: ProblemPageRequestDto): Promise<SuccessResponseDto> => {
  try {
    await createPage({ notionApiKey, databaseId, problemPage });
    return new SuccessResponseDto(true);
  } catch {
    return new SuccessResponseDto(false);
  }
};

const parseProperty = (properties: any) => {
  return {
    siteType: convertStringToSiteType(properties[RequiredColumnName.PROBLEM_SITE].select?.name),
    level: properties[RequiredColumnName.PROBLEM_LEVEL].select?.name,
    number: properties[RequiredColumnName.PROBLEM_NUMBER]?.number,
    titleList: properties[RequiredColumnName.PROBLEM_TITLE]?.title,
    url: properties[RequiredColumnName.PROBLEM_URL]?.url,
  };
};

const getIconSrcByType = (iconType: IconType | null, data: any) => {
  switch (iconType) {
    case IconType.EMOJI:
      return data.icon.emoji;

    case IconType.EXTERNAL:
      return data.icon.external.url;

    case IconType.FILE:
      return data.icon.file.url;

    default:
      return null;
  }
};

const isColumnDataIncluded = (siteType: any, level: any, number: any, titleList: any, url: any) => {
  return !(
    siteType === null ||
    level === null ||
    number === null ||
    titleList === null ||
    titleList.length === 0 ||
    titleList[0]?.plain_text === null ||
    url === null
  );
};
