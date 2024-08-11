export enum RequiredColumnName {
  PROBLEM_SITE = "출처",
  PROBLEM_LEVEL = "난이도",
  PROBLEM_NUMBER = "문제 번호",
  PROBLEM_TITLE = "문제 제목",
  PROBLEM_URL = "URL",
}

export enum RequiredColumnType {
  PROBLEM_SITE = "select",
  PROBLEM_LEVEL = "select",
  PROBLEM_NUMBER = "number",
  PROBLEM_TITLE = "title",
  PROBLEM_URL = "url",
}

export enum IconType {
  EMOJI = "EMOJI",
  EXTERNAL = "EXTERNAL",
  FILE = "FILE",
}

export enum SiteType {
  BOJ = "BOJ",
  PROGRAMMERS = "PROGRAMMERS",
  PROGRAMMERS_SQL = "PROGRAMMERS_SQL",
}

export enum RESP_STATUS {
  SUCCESS = "success",
  FAILED = "failed",
  NOT_FOUND = "not_found",
  INVALID = "invalid",
  UNAUTHORIZED = "unauthorized",
}
