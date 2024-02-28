export default interface ProblemPageRequestDto {
  notionApiKey: string;
  databaseId: string;
  problemPage: {
    siteType: string;
    level: string;
    number: string;
    title: string;
    url: string;
    iconType: string;
    iconSrc: string;
  };
}
