class CheckDatabaseResponseDto {
  checkValid;
  databaseId;
  databaseIcon;
  databaseTitle;

  constructor(
    checkValid: boolean,
    databaseId?: string,
    databaseIcon?: string,
    databaseTitle?: string
  ) {
    this.checkValid = checkValid;
    this.databaseId = databaseId;
    this.databaseIcon = databaseIcon;
    this.databaseTitle = databaseTitle;
  }
}

export default CheckDatabaseResponseDto;
