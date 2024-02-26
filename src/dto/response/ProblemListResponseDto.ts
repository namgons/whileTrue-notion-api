import { ProblemPage } from "../../common/class";

class ProblemListResponseDto {
  checkValid;
  problemPageList;

  constructor(checkValid: boolean, problemPageList?: Array<ProblemPage>) {
    this.checkValid = checkValid;
    this.problemPageList = problemPageList;
  }
}

export default ProblemListResponseDto;
