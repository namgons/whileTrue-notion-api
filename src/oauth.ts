import axios from "axios";

const startOAuthProcess = async (accessCode: string) => {
  await requestToken(accessCode);
};

const requestToken = async (accessCode: string) => {
  const NotionEndPoint = "https://api.notion.com/v1/oauth/token";

  const encoded = Buffer.from(
    `${process.env.OAUTH_CLIENT_ID}:${process.env.OAUTH_CLIENT_SECRET}`
  ).toString("base64");

  const response = await axios.post(
    NotionEndPoint,
    {
      grant_type: "authorization_code",
      code: accessCode,
      redirect_uri: "https://github.com",
    },
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Basic ${encoded}`,
      },
    }
  );

  console.log(response.data);
};

export default startOAuthProcess;
