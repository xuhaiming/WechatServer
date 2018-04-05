const Controller = require('egg').Controller;
const crypto = require('crypto');
const wechatConfig = require('../../config/wechatConfig');
const buildResponseTemplate = require('../helpers/buildResponseTemplate');

const isSignatureValid = ({
  signature,
  timestamp,
  nonce,
}) => {
  const tmpArr = [wechatConfig.token, timestamp, nonce].sort();
  const tmpStr = tmpArr.join('');
  const sha1EncodeStr = crypto.createHash('sha1').update(tmpStr).digest('hex');
  return signature === sha1EncodeStr;
};

class IndexController extends Controller {
  async gateway() {
    const { ctx } = this;
    const { query } = this.ctx;
    const {
      echostr,
    } = query;

    console.log('---GET');
    console.log(query);

    if (isSignatureValid(query)) {
      ctx.body = echostr;
      ctx.status = 200;
    } else {
      ctx.status = 400;
    }
  }

  async gatewayPost() {
    const { ctx } = this;
    const { query, request } = this.ctx;
    const { MsgType, FromUserName } = request.body;

    console.log('---POST');
    console.log(query);
    console.log('---Request');
    console.log(request.body);

    if (!isSignatureValid(query)) {
      ctx.status = 400;
    } else {
      if (MsgType === 'text') {
        ctx.body = buildResponseTemplate.imageText({
          toUser: FromUserName,
          fromUser: wechatConfig.userName,
          content: 'Received text message',
        });
      } else {
        ctx.body = '';
      }

      ctx.status = 200;
    }
  }

  async getAccessToken() {
    const { ctx } = this;

    const result = await app.curl('https://api.weixin.qq.com/cgi-bin/token', {
      grant_type: 'client_credential',
      appid: wechatConfig.appId,
      secret: wechatConfig.appsecret,
    });

    console.log(result);

    ctx.body = 'success';
    ctx.status = 200;
  }
}

module.exports = IndexController;
