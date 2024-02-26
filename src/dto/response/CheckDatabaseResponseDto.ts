import { IconType } from "../../common/enum";

class CheckDatabaseResponseDto {
  checkValid;
  databaseId;
  databaseIconType;
  databaseIconSrc;
  databaseTitle;

  constructor(
    checkValid: boolean,
    databaseId?: string,
    databaseIconType?: IconType,
    databaseIconSrc?: string,
    databaseTitle?: string
  ) {
    this.checkValid = checkValid;
    this.databaseId = databaseId;
    this.databaseIconType = databaseIconType;
    this.databaseIconSrc = databaseIconSrc;
    this.databaseTitle = databaseTitle;
  }
}

export default CheckDatabaseResponseDto;
