const Controller = require('egg').Controller;

class IndexController extends Controller {
  async gateway() {
    const { ctx } = this;
    const { query } = this.ctx;

    console.log(query);

    ctx.body = 'Hello world';
  }
}

module.exports = IndexController;
