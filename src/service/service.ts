import { error } from "console";
import { ProblemPage } from "../common/class";
import { IconType, RequiredColumnName, RESP_STATUS } from "../common/enum";
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
  try {
    const response: any = await retrieveDatabase({ notionApiKey, databaseId });

    if (response.object !== "database") {
      return new CheckDatabaseResponseDto(RESP_STATUS.NOT_FOUND);
    }

    const databaseIconType = convertStringToIconType(response?.icon?.type);
    const databaseIconSrc = getIconSrcByType(databaseIconType, response);
    const databaseTitle = response.title[0].plain_text;

    if (!isDatabaseValid(response.properties)) {
      return new CheckDatabaseResponseDto(RESP_STATUS.INVALID);
    }

    return new CheckDatabaseResponseDto(
      RESP_STATUS.SUCCESS,
      response.id,
      databaseIconType,
      databaseIconSrc,
      databaseTitle
    );
  } catch (error: any) {
    if (error.status === 404) {
      return new CheckDatabaseResponseDto(RESP_STATUS.NOT_FOUND);
    }
    throw error;
  }
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

    try {
      problemPageList.push(...parseProblemPages(response.results));
    } catch {
      return new ProblemListResponseDto(RESP_STATUS.INVALID);
    }
  }

  return new ProblemListResponseDto(RESP_STATUS.SUCCESS, problemPageList);
};

export const saveNewProblem = async ({
  notionApiKey,
  databaseId,
  problemPage,
}: ProblemPageRequestDto): Promise<SuccessResponseDto> => {
  try {
    await createPage({ notionApiKey, databaseId, problemPage });
    return new SuccessResponseDto(RESP_STATUS.SUCCESS);
  } catch {
    return new SuccessResponseDto(RESP_STATUS.FAILED);
  }
};

const parseProblemPages = (results: any): Array<ProblemPage> => {
  const problemPageList = [];

  for (const page of results) {
    const properties = page.properties;

    if (!isDatabaseValid(properties)) {
      throw error;
    }

    const problemData = parseProperty(properties);

    if (isValidProblemData(problemData)) {
      const iconType = convertStringToIconType(page?.icon?.type);
      const iconSrc = getIconSrcByType(iconType, page);

      problemPageList.push(
        new ProblemPage(
          problemData.siteType,
          problemData.level,
          problemData.number,
          problemData.titleList[0].plain_text,
          problemData.url,
          iconType,
          iconSrc
        )
      );
    }
  }
  return problemPageList;
};

const parseProperty = (properties: any) => ({
  siteType: convertStringToSiteType(properties[RequiredColumnName.PROBLEM_SITE].select?.name),
  level: properties[RequiredColumnName.PROBLEM_LEVEL].select?.name,
  number: properties[RequiredColumnName.PROBLEM_NUMBER]?.number,
  titleList: properties[RequiredColumnName.PROBLEM_TITLE]?.title,
  url: properties[RequiredColumnName.PROBLEM_URL]?.url,
});

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

const isValidProblemData = ({ siteType, level, number, titleList, url }: any) => {
  return (
    siteType !== null &&
    level !== null &&
    number !== null &&
    titleList !== null &&
    titleList.length > 0 &&
    titleList[0]?.plain_text !== null &&
    url !== null
  );
};
