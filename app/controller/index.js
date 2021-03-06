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

const userMap = {};

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
    const { MsgType, FromUserName, EventKey, Content } = request.body;

    console.log('---POST');
    console.log(query);
    console.log('---Request');
    console.log(request.body);

    if (!isSignatureValid(query)) {
      ctx.status = 400;
    } else {
      if (MsgType === 'text') {
        if (Content === 'magic') {
          ctx.body = buildResponseTemplate.imageText({
            toUser: FromUserName,
            fromUser: wechatConfig.userName,
            content: 'Received text message',
          });
        } else {
          if (userMap['1'] && FromUserName === userMap['1'].username && userMap['2']) {
            this.sendMessage('2', Content);
          }
          if (userMap['2'] && FromUserName === userMap['2'].username && userMap['1']) {
            this.sendMessage('1', Content);
          }

          ctx.body = '';
        }
      } else if (MsgType === 'event') {
        const eventKeyArray = EventKey.split('_');
        const id = eventKeyArray[eventKeyArray.length - 1];
        userMap[id] = {
          username: FromUserName,
        };
        console.log('---Users');
        console.log(userMap);
        ctx.body = buildResponseTemplate.text({
          toUser: FromUserName,
          fromUser: wechatConfig.userName,
          content: `Welcome to our offical account, User${id}!`,
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
        action_name: 'QR_STR_SCENE',
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

  async sendMessage(id, message) {
    const { ctx } = this;
    const { query } = this.ctx;
    const toUserId = id || '1';
    const content = message || query.message;

    const result = await ctx.curl(`https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=${wechatConfig.accessToken}`, {
      method: 'POST',
      contentType: 'json',
      dataType: 'json',
      data: {
        touser: userMap[toUserId].username,
        msgtype: 'text',
        text: {
          content: content,
        },
      },
    });

    console.log(result.data);

    ctx.body = `You just sent ${query.message}`;
    ctx.status = 200;
  }
}

module.exports = IndexController;
