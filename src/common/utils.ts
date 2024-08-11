import { IconType, RequiredColumnName, RequiredColumnType, SiteType } from "./enum";

export const isDatabaseValid = (properties: any) => {
  return (
    properties.hasOwnProperty(RequiredColumnName.PROBLEM_SITE) &&
    properties.hasOwnProperty(RequiredColumnName.PROBLEM_LEVEL) &&
    properties.hasOwnProperty(RequiredColumnName.PROBLEM_NUMBER) &&
    properties.hasOwnProperty(RequiredColumnName.PROBLEM_TITLE) &&
    properties.hasOwnProperty(RequiredColumnName.PROBLEM_URL) &&
    properties[RequiredColumnName.PROBLEM_SITE].type === RequiredColumnType.PROBLEM_SITE &&
    properties[RequiredColumnName.PROBLEM_LEVEL].type === RequiredColumnType.PROBLEM_LEVEL &&
    properties[RequiredColumnName.PROBLEM_NUMBER].type === RequiredColumnType.PROBLEM_NUMBER &&
    properties[RequiredColumnName.PROBLEM_TITLE].type === RequiredColumnType.PROBLEM_TITLE &&
    properties[RequiredColumnName.PROBLEM_URL].type === RequiredColumnType.PROBLEM_URL
  );
};

export const convertIconTypeToString = (input: IconType) => {
  switch (input) {
    case IconType.EMOJI:
      return "emoji";
    case IconType.EXTERNAL:
      return "external";
    case IconType.FILE:
      return "file";
  }
};

export const convertStringToIconType = (input: string) => {
  switch (input) {
    case "emoji":
      return IconType.EMOJI;
    case "external":
      return IconType.EXTERNAL;
    case "file":
      return IconType.FILE;
    default:
      return null;
  }
};

export const convertSiteTypeToString = (input: SiteType) => {
  switch (input) {
    case SiteType.BOJ:
      return "백준";
    case SiteType.PROGRAMMERS:
      return "프로그래머스";
    case SiteType.PROGRAMMERS_SQL:
      return "프로그래머스 SQL";
  }
};

export const convertStringToSiteType = (input: string) => {
  switch (input) {
    case "백준":
      return SiteType.BOJ;
    case "프로그래머스":
      return SiteType.PROGRAMMERS;
    case "프로그래머스 SQL":
      return SiteType.PROGRAMMERS_SQL;
  }
};
