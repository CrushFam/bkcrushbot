import { URL } from 'url';

import { DateUtil } from '../../util/date-util';
import { SiteResolver } from '../resolver/site-resolver.enum';
import { RandomUtil } from './../../util/random-util';

export class Message {
  public static readonly AUDIOBOOK_TAG = 'audiobook';
  private static readonly PUBLICATION_DATE_MINIMUM_AGE_DAYS = 0;

  private site: SiteResolver;
  private tags: string[];
  private title: string | null;
  private author: string | null;
  private publisher: string;
  private publicationDate: Date | null;
  private url: URL;

  constructor(site: SiteResolver, url: URL) {
    this.site = site;
    this.tags = ['ebook'];
    this.title = null;
    this.author = null;
    this.publisher = 'Self-Published';
    this.publicationDate = null;
    this.url = url;
  }

  clone(): Message {
    const clone: Message = new Message(this.site, this.url);

    clone.tags = [];
    for (const tag of this.tags) {
      clone.tags.push(tag);
    }

    clone.title = this.title;
    clone.author = this.author;
    clone.publisher = this.publisher;
    clone.publicationDate = this.publicationDate;

    return clone;
  }

  private getSiteName(): string {
    const name: string = SiteResolver[this.site];

    const firstLetter = name[0].toUpperCase();
    const otherLetters = name.substr(1).toLowerCase();

    return firstLetter + otherLetters;
  }

  addTag(tag: string): void {
    if (this.tags[0] == 'ebook') {
      this.tags.pop();
    }
    this.tags.push(tag);
  }

  setTitle(title: string): void {
    this.title = title;
  }

  getTitle(): string | null {
    return this.title;
  }

  setAuthor(author: string): void {
    this.author = author;
  }

  getAuthor(): string | null {
    return this.author;
  }

  setPublisher(publisher: string | null | undefined): void {
    if (publisher != null && publisher != undefined) {
      this.publisher = publisher;
    }
  }

  getPublisher(): string | null {
    return this.publisher;
  }

  setPublicationDate(publicationDate: Date): void {
    const now: Date = new Date();
    const allowedRequestDate: Date = DateUtil.addDays(
      publicationDate,
      Message.PUBLICATION_DATE_MINIMUM_AGE_DAYS
    );
    if (now.getTime() >= allowedRequestDate.getTime()) {
      this.publicationDate = publicationDate;
    } else {
      throw (
        'Unable to generate the request. This title is scheduled to be released on ' +
        DateUtil.dateToString(allowedRequestDate) +
        '.' +
        this.getEasterEgg()
      );
    }
  }

  private getEasterEgg(): string {
    const random: number = RandomUtil.getRandom(6);

    return random == 0
      ? ' Wait until then or request now manually to get a free warning.'
      : '';
  }

  private getPublicationDate(): string {
    let result = '';

    if (this.publicationDate != null) {
      result = DateUtil.dateToString(this.publicationDate);
    }

    return result;
  }

  setUrl(url: URL): void {
    this.url = url;
  }

  private toTagsString(): string {
    let tags = '';

    for (let i = 0; i < this.tags.length; i++) {
      if (i > 0) {
        tags += ' ';
      }
      tags += '#' + this.tags[i];
    }

    return tags;
  }

  toString(): string {
    let message = '';

    message += '#request';

    message += '\n\n';

    // info
    message += '<code>' + this.title + '</code>' + '\n';
    message += '<code>' + this.author + '</code>' + '\n';
    message += '<i>' + this.publisher + '</i> ';
    if (this.publicationDate != null) {
      message += '(' + this.getPublicationDate() + ')';
    }
    message += '\n\n';
    message +=
      '<a href="' +
      this.url.toString() +
      '">' +
      this.getSiteName() +
      ' Link</a>';

    message += '\n\n';
    // tags
    message += this.toTagsString();

    return message;
  }

  toTileString(): string {
    return this.toTagsString();
  }

  toDetailsString(): string {
    return this.title as string;
  }

  toTagString(): string {
    return this.tags[0] as string;
  }
}
