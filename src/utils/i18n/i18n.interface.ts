export interface I18nOptions {
  masterLanguage: string;
  messagesPath: string;
}

export interface I18nMessages {
  name: string;
  fallbackLanguage?: string;
  messages: Map<string, string>;
}
