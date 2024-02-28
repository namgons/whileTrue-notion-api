import { IconType } from "../../common/enum";

class CheckDatabaseResponseDto {
  validCheck;
  databaseId;
  databaseIconType;
  databaseIconSrc;
  databaseTitle;

  constructor(
    validCheck: boolean,
    databaseId?: string,
    databaseIconType?: IconType,
    databaseIconSrc?: string,
    databaseTitle?: string
  ) {
    this.validCheck = validCheck;
    this.databaseId = databaseId;
    this.databaseIconType = databaseIconType;
    this.databaseIconSrc = databaseIconSrc;
    this.databaseTitle = databaseTitle;
  }
}

export default CheckDatabaseResponseDto;
