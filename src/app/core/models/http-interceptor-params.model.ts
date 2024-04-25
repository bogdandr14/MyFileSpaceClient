import { HttpParams } from '@angular/common/http';
import { HttpInterceptorConfig } from './http-interceptor-config.model';

export class HttpInterceptorParams extends HttpParams {
  constructor(
    public interceptorConfig?: HttpInterceptorConfig,
    params?: { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean> }
  ) {
    super({ fromObject: params });
  }
}
