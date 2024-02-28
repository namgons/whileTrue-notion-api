export default interface ProblemRequestDto {
  notionApiKey: string;
  databaseId: string;
  problem: {
    siteType: string;
    level: string;
    number: string;
    title: string;
    url: string;
  };
}
