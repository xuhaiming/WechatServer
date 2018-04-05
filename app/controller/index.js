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
      } else if (MsgType === 'event') {
        ctx.body = buildResponseTemplate.text({
          toUser: FromUserName,
          fromUser: wechatConfig.userName,
          content: 'Welcome to our offical account!',
        });
      } else {
        ctx.body = '';
      }

      ctx.status = 200;
    }
  }

  async getAccessToken() {
    const { ctx } = this;

    const result = await ctx.curl(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${wechatConfig.appId}&secret=${wechatConfig.appsecret}`, {
      method: 'GET',
      contentType: 'json',
      dataType: 'json',
    });

    console.log(result.data);

    ctx.body = 'success';
    ctx.status = 200;
  }

  async getQrCode() {
    const { ctx } = this;
    const { query } = this.ctx;

    const result = await ctx.curl(`https://api.weixin.qq.com/cgi-bin/qrcode/create?access_token=${wechatConfig.accessToken}`, {
      method: 'POST',
      contentType: 'json',
      dataType: 'json',
      data: {
        expire_seconds: 100000,
        action_name: 'QR_SCENE',
        action_info: {
          scene: {
            scene_str: `user_${query.id}`,
          },
        },
      },
    });

    console.log(result.data);

    ctx.body = `https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=${result.data.ticket}`;
    ctx.status = 200;
  }
}

module.exports = IndexController;
