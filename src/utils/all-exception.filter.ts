import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';

import { I18nService } from './i18n';

@Catch(HttpException)
export class AllExceptionsFilter implements ExceptionFilter<HttpException> {
  private readonly i18n: I18nService;
  constructor(i18n: I18nService) {
    this.i18n = i18n;
  }

  async catch(exception: HttpException, host: ArgumentsHost): Promise<void> {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();
    //const req = ctx.getRequest();

    res.code(500).send({
      error_message: this.i18n.translate('en', 'errors.TODO'),
    });
  }
}
