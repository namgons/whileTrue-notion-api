type NotionAccessTokenProps = {
  access_token: string;
  token_type: string;
  bot_id: string;
  workspace_name: string;
  workspace_icon: string;
  workspace_id: string;
  owner: {
    type: string;
    user: {
      object: string;
      id: string;
      name: string;
      avatar_url: string;
      type: string;
      person: {};
    };
  };
  duplicated_template_id: string | null;
  request_id: string;
};

export { NotionAccessTokenProps };