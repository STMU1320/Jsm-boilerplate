import * as moment from 'moment';

export function upperCase(inStr: string, length: number = 1) {
  const str = inStr.toString();
  if (!str) return '';
  if (str.length < length) return str.toUpperCase();
  return str.slice(0, length).toUpperCase() + str.slice(length);
}

export function number(num: any, length: number = 2, suffix?: string) {
  let numStr;
  switch (typeof num) {
    case 'number':
      numStr = `${num.toFixed(length)}${suffix ? suffix : ''}`;
      break;

    case 'string':
      numStr = `${(+num).toFixed(length)}${suffix ? suffix : ''}`;
      break;

    default:
      numStr = '-';
      break;
  }
  return numStr;
}

export function currency(money: string | number, unit: string = '￥') {
  if (money == null) return;
  const _m = +money ;
  let moneyStr = number(Math.abs(_m), 2);
  let suffix = '';
  const prefix = _m < 0 ? '-' : '';
  if (_m > 1000000) {
    suffix = '万';
    moneyStr = (_m / 10000).toFixed(2);
  }
  moneyStr = `${prefix}${unit}${moneyStr}${suffix}`;
  return moneyStr.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function date(format = 'YYYY-MM-DD', date: any) {
  let dateStr = '-';
  if (date) {
    dateStr = moment(date).format(format);
  }
  return dateStr;
}
