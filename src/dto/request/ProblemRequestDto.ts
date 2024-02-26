import { Problem } from "../../common/class";

class ProblemRequestDto {
  notionApiKey;
  databaseId;
  problem;

  constructor(notionApiKey: string, databaseId: string, problem: Problem) {
    this.notionApiKey = notionApiKey;
    this.databaseId = databaseId;
    this.problem = problem;
  }
}

export default ProblemRequestDto;
