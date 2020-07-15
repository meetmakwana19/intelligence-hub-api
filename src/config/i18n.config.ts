import { registerAs } from '@nestjs/config';
import * as path from 'path';
import { I18nOptions } from 'src/utils';

export const I18nConfig = registerAs(
  'I18N',
  // eslint-disable-next-line @typescript-eslint/ban-types
  (): I18nOptions => {
    return {
      masterLanguage: 'en',
      messagesPath: path.resolve(__dirname, './../resources/messages'),
    };
  },
);
