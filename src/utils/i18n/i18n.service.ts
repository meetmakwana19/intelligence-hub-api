import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

import { I18nMessages, I18nOptions } from './i18n.interface';

@Injectable()
export class I18nService implements OnApplicationBootstrap {
  private readonly masterLanguage: string;
  private readonly messagesPath: string;
  private readonly messages: Map<string, I18nMessages>;
  private matcher: RegExp;

  constructor(options: I18nOptions) {
    this.masterLanguage = options.masterLanguage;
    this.messagesPath = options.messagesPath;
    this.messages = new Map<string, I18nMessages>();
    //this.loadMessages();
  }

  onApplicationBootstrap(): void {
    console.log('22222222222');
    this.matcher = /\{(\w+)\}/g;
    this.loadMessages();
  }

  //  onModuleInit(): void {
  //     console.log('22222222222');
  //     this.matcher = /\{(\w+)\}/g;
  //     this.loadMessages();
  //   }

  private loadMessages() {
    const json = /^(.+)\.json$/;
    const files = fs.readdirSync(this.messagesPath);
    files.forEach(file => {
      if (json.test(file)) {
        const { name, fallbackLanguage, messages } = JSON.parse(fs.readFileSync(path.resolve(this.messagesPath, file), 'utf8'));
        this.messages.set(name, {
          name,
          fallbackLanguage,
          messages,
        });
      }
    });
  }

  private render(template: string, options: Record<string, string>): string {
    if (!options) {
      return template;
    }

    (template.match(this.matcher) || []).forEach((key: string) => {
      template = template.replace(key, options[key.substring(1, key.length - 1)]);
    });

    return template;
  }

  public translate(lang: string, code: string, options?: Record<string, string>): string {
    if (!this.messages.get(lang)) {
      lang = this.masterLanguage;
    }

    let template: string;
    try {
      template = code.split('.').reduce((obj, key) => {
        return obj[key];
      }, this.messages.get(lang).messages);
    } catch (e) {}

    return template ? this.render(template, options) : code;
  }
}
