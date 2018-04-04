const Controller = require('egg').Controller;

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
