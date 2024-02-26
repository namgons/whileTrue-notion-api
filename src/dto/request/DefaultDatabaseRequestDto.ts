class DefaultDatabaseRequestDto {
  notionApiKey: string;
  databaseId: string;

  constructor(notionApiKey: string, databaseId: string) {
    this.notionApiKey = notionApiKey;
    this.databaseId = databaseId;
  }
}

export default DefaultDatabaseRequestDto;
