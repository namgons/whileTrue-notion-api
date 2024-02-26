import { SiteType } from "./enum";

export class Problem {
  site: SiteType;
  level: string;
  number: string;
  title: string;
  url: string;

  constructor(site: SiteType, level: string, number: string, title: string, url: string) {
    this.site = site;
    this.level = level;
    this.number = number;
    this.title = title;
    this.url = url;
  }
}

export class ProblemPage extends Problem {
  iconType: string;
  iconSrc: string;

  constructor(
    site: SiteType,
    level: string,
    number: string,
    title: string,
    url: string,
    iconType: string,
    iconSrc: string
  ) {
    super(site, level, number, title, url);
    this.iconType = iconType;
    this.iconSrc = iconSrc;
  }
}
