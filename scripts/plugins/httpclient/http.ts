import fetch from 'node-fetch'

interface IRequestOptions {
    url: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    headers?: Record<string, string>;
    body?: Record<string, any> | string;
  }
interface IResponse {
    status: number;
    headers: Record<string, string>;
    body: Record<string, any> | string;
  }
type IBeforeRequestHook = (options: IRequestOptions) => IRequestOptions;
type IAfterResponseHook = (response: IResponse) => IResponse;
class HttpClient {
    private beforeRequestHooks: IBeforeRequestHook[] = [];
    private afterResponseHooks: IAfterResponseHook[] = [];
    public addBeforeRequestHook(hook: IBeforeRequestHook) {
      this.beforeRequestHooks.push(hook);
    }
    public addAfterResponseHook(hook: IAfterResponseHook) {
      this.afterResponseHooks.push(hook);
    }
    public async request(options: IRequestOptions): Promise<IResponse> {
      // 执行 beforeRequestHooks
      for (const hook of this.beforeRequestHooks) {
        options = hook(options);
      }
      // 发送请求
      const response = await fetch(options.url, {
        method: options.method ?? 'GET',
        headers: options.headers ?? {},
        body: options.body ? JSON.stringify(options.body) : undefined,
      });
      // 解析响应
      const headers: Record<string, string> = {};
      response.headers.forEach((value: string, key: string) => {
        headers[key] = value;
      });
      const body = await response.json();
      // 构造响应对象
      const result: IResponse = {
        status: response.status,
        headers,
        body,
      };
      // 执行 afterResponseHooks
      for (const hook of this.afterResponseHooks) {
        hook(result);
      }
      // 返回响应
      return result;
    }
  }

export default HttpClient;