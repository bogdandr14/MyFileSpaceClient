import { Guid } from 'guid-typescript';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpInterceptorParams } from '../models/http-interceptor-params.model';
import { PaginatedResultModel } from '../models/paginated-result.model';
import { HttpInterceptorConfig } from '../models/http-interceptor-config.model';

export abstract class BaseService {
  protected url: string;
  protected static noLoadingConfig: HttpInterceptorConfig = {
    hideLoading: true,
  };
  constructor(
    public http: HttpClient,
    private urlString: string,
    private baseUrl?: string
  ) {
    if (!baseUrl) {
      this.url =
        this.urlString === ''
          ? environment.baseApiUrl
          : `${environment.baseApiUrl}/${urlString}`;
    } else {
      this.url =
        this.urlString === '' ? this.baseUrl! : `${this.baseUrl}/${urlString}`;
    }
  }

  protected turnFilterIntoUrl(filter: any) {
    let urlFilter = '';
    if (filter && Object.entries(filter).length) {
      Object.entries(filter).forEach(([key, value], index) => {
        urlFilter += index === 0 ? '?' : '&';
        urlFilter += `${key}=${value}`;
      })
    }
    return urlFilter;
  }

  private getOne<T>(
    url: string,
    params?: HttpInterceptorConfig
  ): Observable<T> {
    const options = {
      params: new HttpInterceptorParams(params),
    };
    return this.http.get<T>(url, options);
  }

  public getOneById<T>(
    id: number | Guid | string,
    path?: string,
    params?: HttpInterceptorConfig
  ): Observable<T> {
    const url = path ? `${this.url}/${path}/${id}` : `${this.url}/${id}`;
    return this.getOne<T>(url, params);
  }

  public getOneByPath<T>(
    path: string,
    params?: HttpInterceptorConfig
  ): Observable<T> {
    const url = `${this.url}/${path}`;
    return this.getOne<T>(url, params);
  }

  public getMany<T>(
    path?: string,
    params?: HttpInterceptorConfig
  ): Observable<T[]> {
    const url = path ? `${this.url}/${path}` : `${this.url}`;
    const options = {
      params: new HttpInterceptorParams(params),
    };

    return this.http.get<T[]>(url, options);
  }

  public getAll<T>(params?: HttpInterceptorConfig): Observable<T[]> {
    return this.getMany<T>('', params);
  }

  public update<T>(
    data: any,
    path?: string,
    params?: HttpInterceptorConfig
  ): Observable<T> {
    const body = data ? JSON.stringify(data) : {};
    const url = path ? `${this.url}/${path}` : `${this.url}`;
    const options = {
      params: new HttpInterceptorParams(params),
    };
    return this.http.put<T>(url, body, options);
  }

  public updateById<T>(
    id: number | Guid,
    data: any,
    path?: string,
    params?: HttpInterceptorConfig
  ): Observable<T> {
    const url = path ? `${path}/${id}` : `${id}`;
    return this.update<T>(data, url, params);
  }

  public updateMultiple<T>(
    array: any[],
    path?: string,
    params?: HttpInterceptorConfig
  ): Observable<T> {
    const body = JSON.stringify(array);
    const url = path ? `${this.url}/${path}` : `${this.url}`;
    const options = {
      params: new HttpInterceptorParams(params),
    };

    return this.http.put<T>(url, body, options);
  }

  public add<T>(
    data: any,
    path?: string,
    params?: HttpInterceptorConfig
  ): Observable<T> {
    const body = data ? JSON.stringify(data) : {};
    const url = path ? `${this.url}/${path}` : `${this.url}`;
    const options = {
      params: new HttpInterceptorParams(params),
    };

    return this.http.post<T>(url, body, options);
  }

  public remove(
    id: number | Guid,
    path?: string,
    params?: HttpInterceptorConfig
  ): Observable<any> {
    const url = path ? `${this.url}/${path}/${id}` : `${this.url}/${id}`;
    const options = {
      params: new HttpInterceptorParams(params),
    };
    return this.http.delete<any>(url, options);
  }

  public removeMultiple(
    ids: number[],
    path?: string,
    params?: HttpInterceptorConfig
  ): Observable<any> {
    const body = JSON.stringify(ids);
    const url = path ? `${this.url}/${path}` : `${this.url}`;
    const options = { params: new HttpInterceptorParams(params), body };
    return this.http.delete<any>(url, options);
  }

  public getPaginated<T>(
    pageIndex: number,
    itemsNumber: number,
    searchKey: string,
    apiPath?: string,
    params?: HttpInterceptorConfig
  ): Observable<PaginatedResultModel<T>> {
    let path = apiPath ? `paginated/${apiPath}` : 'paginated';
    path = `${path}?pageIndex=${pageIndex}&itemsNumber=${itemsNumber}&key=${searchKey}`;

    return this.add<PaginatedResultModel<T>>({}, path, params);
  }

  /*
  This method is not REST-compliant as it sends the filter in the body of a POST request.
  However, in practice this is a viable solution when the filter is larger than the limit specified by the browser or web server.
  */
  public getPaginatedWithFilter<T, V>(
    pageIndex: number,
    itemsNumber: number,
    sortField: string,
    sortDirection?: string,
    filter?: V,
    params?: HttpInterceptorConfig
  ): Observable<PaginatedResultModel<T>> {
    if (!sortField) {
      sortField = '';
    }
    if (!sortDirection) {
      sortDirection = '';
    }
    const path = `paginated?pageIndex=${pageIndex}&itemsNumber=${itemsNumber}&sortField=${sortField}&sortDirection=${sortDirection}`;

    return this.add<PaginatedResultModel<T>>(filter, path, params);
  }
}
