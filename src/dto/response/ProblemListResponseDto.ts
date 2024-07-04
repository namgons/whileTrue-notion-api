import { ProblemPage } from "../../common/class";
import { RESP_STATUS } from "../../common/enum";

class ProblemListResponseDto {
  validCheck;
  problemPageList;

  constructor(validCheck: RESP_STATUS, problemPageList?: Array<ProblemPage>) {
    this.validCheck = validCheck;
    this.problemPageList = problemPageList;
  }
}

export default ProblemListResponseDto;
