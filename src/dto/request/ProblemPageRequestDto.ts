import { ProblemPage } from "../../common/class";

class ProblemPageRequestDto {
  notionApiKey;
  databaseId;
  problemPage;

  constructor(notionApiKey: string, databaseId: string, problemPage: ProblemPage) {
    this.notionApiKey = notionApiKey;
    this.databaseId = databaseId;
    this.problemPage = problemPage;
  }
}

export default ProblemPageRequestDto;
