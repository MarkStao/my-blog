import request from '../utils/request';
import { CSDN_RSS_URL } from '../constants';

/** 把常量从外面引进来，统一管理思想 */
export const getRssList = () => request({
  url: CSDN_RSS_URL,
  method: 'get'
});