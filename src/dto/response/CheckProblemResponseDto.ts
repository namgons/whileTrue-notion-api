class CheckProblemResponseDto {
  validCheck;
  isExists;

  constructor(validCheck: boolean, isExists?: boolean) {
    this.validCheck = validCheck;
    this.isExists = isExists;
  }
}

export default CheckProblemResponseDto;
