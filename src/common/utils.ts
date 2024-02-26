import { RequiredColumnName, RequiredColumnType } from "./enum";

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
