const Controller = require('egg').Controller;
const crypto = require('crypto');
const wechatConfig = require('../../config/wechatConfig');

class IndexController extends Controller {
  async gateway() {
    const { ctx } = this;
    const { query } = this.ctx;
    const {
      signature,
      timestamp,
      nonce,
      echostr,
    } = query;

    console.log('---GET');
    console.log(query);

    const tmpArr = [wechatConfig.token, timestamp, nonce].sort();
    const tmpStr = tmpArr.join('');
    const sha1EncodeStr = crypto.createHash('sha1').update(tmpStr).digest('hex');

    console.log('---encode string: ', sha1EncodeStr);

    ctx.body = 'Hello world';
  }

  async gatewayPost() {
    const { ctx } = this;
    const { query } = this.ctx;

    console.log('---POST');
    console.log(ctx);

    ctx.body = 'Hello world';
  }
}

module.exports = IndexController;
