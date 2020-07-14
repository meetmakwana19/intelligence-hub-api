import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';

import { I18nService } from './i18n/i18n.service';

// const statusMessageMap:Record<number, any>={
//   500:{message:'ERROR.INTERNAL_SERVER_ERROR',status:500},
//   404:{message:'ERROR.NOT_FOUND',status:404},
//   504:{message:'ERROR.GATEWAY_TIMEOUT',status:504},
//   400:{message:'ERROR.BAD_REQUEST',status:400}
// };
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly i18n: I18nService;
  constructor(i18n: I18nService) {
    this.i18n = i18n;
  }

  async catch(exception: HttpException, host: ArgumentsHost): Promise<void> {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus != undefined ? exception.getStatus() : 500;
    // let msg=exception.message || '';

    //search for error status in statusMessageMap
    // const statusObj=statusMessageMap[status];
    // if(statusObj){
    //     msg=statusObj.message;
    //     status=statusObj.status;
    // }

    // const errResponse={
    //     code:status,
    //     timestamp: Date.now(),
    //     path: request.req.url,
    //     method:request.req.method,
    //     error:await this.i18n.get('en',msg)
    // };

    const errResponse = this.i18n.translate('en', 'greetings.hello_world');

    Logger.error(`${request.req.method} ${request.req.url}`, JSON.stringify(exception.stack), 'ExceptionFilter');

    response.code(status).send(errResponse);
  }
}
