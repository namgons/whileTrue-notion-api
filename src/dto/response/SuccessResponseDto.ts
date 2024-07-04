import { RESP_STATUS } from "../../common/enum";

class SuccessResponseDto {
  isSucceed;

  constructor(isSucceed: RESP_STATUS) {
    this.isSucceed = isSucceed;
  }
}

export default SuccessResponseDto;
