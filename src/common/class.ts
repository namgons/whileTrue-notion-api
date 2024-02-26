import { IconType, SiteType } from "./enum";

export class Problem {
  site;
  level;
  number;
  title;
  url;

  constructor(site: SiteType, level: string, number: string, title: string, url: string) {
    this.site = site;
    this.level = level;
    this.number = number;
    this.title = title;
    this.url = url;
  }
}

export class ProblemPage extends Problem {
  iconType;
  iconSrc;

  constructor(
    site: SiteType,
    level: string,
    number: string,
    title: string,
    url: string,
    iconType: IconType.EMOJI | IconType.EXTERNAL,
    iconSrc: string
  ) {
    super(site, level, number, title, url);
    this.iconType = iconType;
    this.iconSrc = iconSrc;
  }
}
