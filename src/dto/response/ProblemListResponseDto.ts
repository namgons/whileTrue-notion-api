import { ProblemPage } from "../../common/class";

class ProblemListResponseDto {
  validCheck;
  problemPageList;

  constructor(validCheck: boolean, problemPageList?: Array<ProblemPage>) {
    this.validCheck = validCheck;
    this.problemPageList = problemPageList;
  }
}

export default ProblemListResponseDto;
