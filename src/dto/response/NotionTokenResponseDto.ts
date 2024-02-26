import { NotionAccessTokenProps } from "../../common/props";

class NotionTokenResponseDto {
  notionApiKey: string;
  tokenType: string;
  workspaceName: string;
  workspaceIcon: string;
  workspaceId: string;
  notionUserId: string;
  notionUserName: string;
  notionUserAvatarUrl: string;

  constructor(response: NotionAccessTokenProps) {
    this.notionApiKey = response.access_token;
    this.tokenType = response.token_type;
    this.workspaceName = response.workspace_name;
    this.workspaceIcon = response.workspace_icon;
    this.workspaceId = response.workspace_id;
    this.notionUserId = response.owner.user.id;
    this.notionUserName = response.owner.user.name;
    this.notionUserAvatarUrl = response.owner.user.avatar_url;
  }
}

export default NotionTokenResponseDto;
