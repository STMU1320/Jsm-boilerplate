import 'whatwg-fetch';
import * as reg from './reg';
import * as config from './config';
import { objToString, getToken } from './toolFunc';
import history from './history';

const defaultHeaders: any = {
  'Content-Type': 'application/json'
};

async function ajax (url: string, options: any) {

  // 设置headers
  let headersOptions = { ...defaultHeaders };
  const token = getToken();
  if (options && options.headers) {
    headersOptions = Object.assign(headersOptions, options.headers);
  }
  if (token) {
    headersOptions['token'] = token;
  }

  // 设置request
  const requestOptions = { ...options, headers: headersOptions };
  if (typeof requestOptions.body === 'object') {
    requestOptions.body = JSON.stringify(requestOptions.body);
  }
  const requestUrl = reg.isUrl(url) ? url : config.getApiUrl(url);
  const request = new Request(requestUrl, requestOptions );

  const response: any = await fetch(request);
  const contentType = response.headers.get('Content-Type') || '';
  let data: any;
  switch (true) {
    case contentType.includes('json') > -1:
      data = await response.json();
      break;
    case contentType.includes('text') > -1:
      data = await response.text();
      break;
    default:
      data = await response.blob();
      break;
    }
  if (response.status === 403 || response.status === 401) {
    // 这里处理没有权限的情况
    history.push('/login');
    throw { Message: data.Message || 'Forbidden', code: response.status };
  } else if (response.status === 400) {
    throw { Message: data.Message, code: response.status };
  } else if (response.status === 500) {
    history.push('/error/500');
    throw { Message: data.Message, code: response.status };
  } else {
    // 处理服务器约定的请求错误
    // if (data.State === 0) {
    //   throw data;
    // }
    return data;
  }
}

export interface Request {
  get: Function;
  post: Function;
}

const request: Request = {
  get (url: string, params?: any, options?: any) {
    let apiUrl = url;
    const join = ~apiUrl.indexOf('?') ? '&' : '?';
    const paramsStr = objToString(params);
    if (paramsStr) {
      apiUrl = `${url}${join}${paramsStr}`;
    }
    return ajax(apiUrl, Object.assign({ method: 'GET' }, options));
  },
  post (url: string, params?: any, options?: any) {
    const defaultOptions = {
      method: 'POST',
      body: params
    };
    return ajax(url, Object.assign(defaultOptions, options));
  }
};

export default request;
