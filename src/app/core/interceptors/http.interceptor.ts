import { AuthService } from '../services/auth.service';
import { HttpInterceptorParams } from '../models/http-interceptor-params.model';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
  HttpStatusCode,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, filter, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { BadRequestError } from '../models/errors/bad-request-error';
import { NotFoundError } from '../models/errors/not-found-error';
import { ConflictError } from '../models/errors/conflict-error';
import { ForbiddenError } from '../models/errors/forbidden-error';
import { UnauthorizedError } from '../models/errors/unauthorized-error';
import { AppError } from '../models/errors/app-error';
import { AlertService } from '../services/alert.service';

@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {
  constructor(
    private alertService: AlertService,
    private authService: AuthService
  ) { }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const config = (req.params as HttpInterceptorParams).interceptorConfig;
    const successMessage = config?.successMessage ?? '';
    const showSuccessMessage = config?.showSuccessMessage;
    const request = req.clone(
      (req.url.includes('photo/') || req.url.includes('.png'))
        ? {
          ...req,
          headers: req.headers.delete('Content-Type').set('Access-Control-Allow-Origin', 'http://localhost:8100'),
        }
        : {
          ...req,
          headers: req.headers.set('Content-Type', 'application/json').set('Access-Control-Allow-Origin', 'http://localhost:8100'),//this.resolveHttpHeaders(config?.httpHeaders, req)
        }
    );

    return next.handle(request).pipe(
      filter((e) => e.type !== 0),
      tap(() => {
        if (showSuccessMessage) this.alertService.showSuccess(successMessage);
      }),
      catchError((err) => this.handleError(err))
    );
  }

  public handleError(errorResponse: HttpErrorResponse): Observable<never> {
    let error: AppError;
    switch (errorResponse?.status) {
      case HttpStatusCode.BadRequest: {
        error = new BadRequestError(errorResponse);
        break;
      }
      case HttpStatusCode.NotFound: {
        error = new NotFoundError(errorResponse);
        break;
      }
      case HttpStatusCode.Conflict: {
        error = new ConflictError(errorResponse);
        break;
      }
      case HttpStatusCode.Forbidden: {
        error = new ForbiddenError(errorResponse);
        break;
      }
      case HttpStatusCode.Unauthorized: {
        this.authService.logout();
        error = new UnauthorizedError(errorResponse);
        break;
      }
      case HttpStatusCode.InternalServerError: {
        error = new AppError('Invalid Request');
        break;
      }
      default: {
        error = new AppError(errorResponse);
      }
    }
    this.alertService.showError(error);
    throw error;
  }

  private resolveHttpHeaders(providedHttpHeaders: HttpHeaders | undefined, request: HttpRequest<any>): HttpHeaders {
    return providedHttpHeaders ? providedHttpHeaders : request.headers.set('Content-Type', 'application/json');
  }
}
