const Controller = require('egg').Controller;

class IndexController extends Controller {
  async gateway() {
    this.ctx.body = 'Hello world';
  }
}

module.exports = IndexController;
