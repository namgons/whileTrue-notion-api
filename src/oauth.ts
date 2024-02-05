import axios from "axios";
import { NotionAccessTokenProps } from "./notion/props";

const startOAuthProcess = async (accessCode: string): Promise<NotionAccessTokenProps> => {
  return await requestToken(accessCode);
};

const requestToken = async (accessCode: string): Promise<NotionAccessTokenProps> => {
  const NotionEndPoint = "https://api.notion.com/v1/oauth/token";

  const encoded = Buffer.from(
    `${process.env.OAUTH_CLIENT_ID}:${process.env.OAUTH_CLIENT_SECRET}`
  ).toString("base64");

  const response = await axios.post(
    NotionEndPoint,
    {
      grant_type: "authorization_code",
      code: accessCode,
      redirect_uri: process.env.REDIRECT_URI,
    },
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Basic ${encoded}`,
      },
    }
  );

  return response.data;
};

export default startOAuthProcess;
