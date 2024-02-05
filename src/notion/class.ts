class ParentDatebase {
  type: string;
  database_id: string;

  constructor(datebase_id: string) {
    this.type = "database_id";
    this.database_id = datebase_id;
  }
}

class ParentPage {
  type: string;
  page_id: string;

  constructor(page_id: string) {
    this.type = "page_id";
    this.page_id = page_id;
  }
}

export { ParentDatebase, ParentPage };
