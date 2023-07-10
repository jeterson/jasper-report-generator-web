import { Axios, AxiosError } from 'axios';
import { api } from 'boot/axios';
import { Loading, Notify } from 'quasar';
export abstract class HttpServiceBase {
  constructor(private serviceUrl: string) {}

  protected api: Axios = api;

  protected get<T>(url: string, showLoading = true): Promise<T> {
    return new Promise(async (resolve, reject) => {
      try {
        if (showLoading) Loading.show();
        const response = await api.get(`/${this.serviceUrl}${url}`);
        resolve(response.data);
      } catch (err: unknown) {
        const axiosError = this.extractErrorFromAxios(
          err as AxiosError<{ code: string; message: string }>
        );
        Notify.create({ message: axiosError?.message, type: 'negative' });
        reject({ message: axiosError?.message, err });
      } finally {
        if (showLoading) Loading.hide();
      }
    });
  }

  protected put<T = unknown, R = unknown>(url: string, body: T): Promise<R> {
    return new Promise(async (resolve, reject) => {
      try {
        Loading.show();
        const response = await api.put<R>(`/${this.serviceUrl}${url}`, body);
        resolve(response.data);
      } catch (err: unknown) {
        const axiosError = this.extractErrorFromAxios(
          err as AxiosError<{ code: string; message: string }>
        );
        Notify.create({ message: axiosError?.message, type: 'negative' });
        reject({ message: axiosError?.message, err });
      } finally {
        Loading.hide();
      }
    });
  }

  protected patch<T = unknown, R = unknown>(
    url: string,
    body: T | undefined = undefined
  ): Promise<R> {
    return new Promise(async (resolve, reject) => {
      try {
        Loading.show();
        const response = await api.patch<R>(`/${this.serviceUrl}${url}`, body);
        resolve(response.data);
      } catch (err: unknown) {
        const axiosError = this.extractErrorFromAxios(
          err as AxiosError<{ code: string; message: string }>
        );
        Notify.create({ message: axiosError?.message, type: 'negative' });
        reject({ message: axiosError?.message, err });
      } finally {
        Loading.hide();
      }
    });
  }

  protected post<T = unknown, R = unknown>(url: string, body: T): Promise<R> {
    return new Promise(async (resolve, reject) => {
      try {
        Loading.show();
        const response = await api.post<R>(`/${this.serviceUrl}${url}`, body);
        resolve(response.data);
      } catch (err: unknown) {
        const axiosError = this.extractErrorFromAxios(
          err as AxiosError<{ code: string; message: string }>
        );
        Notify.create({ message: axiosError?.message, type: 'negative' });
        reject({ message: axiosError?.message, err });
      } finally {
        Loading.hide();
      }
    });
  }

  private extractErrorFromAxios(
    err: AxiosError<{ code: string; message: string }>
  ) {
    if (!err) return { code: 'Unknown', message: 'Unknown Error', status: 0 };
    if (!err.response)
      return { code: err.code, message: err.message, status: err.status };
    if (!err.response.data)
      return { code: err.code, message: err.message, status: err.status };
    return {
      code: err.response.data.code,
      message: err.response.data.message,
      status: err.status,
    };
  }

  protected delete(url: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        Loading.show();
        const response = await api.delete(`/${this.serviceUrl}${url}`);
        resolve(response.data);
      } catch (err: unknown) {
        const axiosError = this.extractErrorFromAxios(
          err as AxiosError<{ code: string; message: string }>
        );
        console.log(axiosError);
        Notify.create({ message: axiosError?.message, type: 'negative' });
        reject({ message: axiosError?.message, err });
      } finally {
        Loading.hide();
      }
    });
  }
}
