exports.keys = 'my key';

exports.security = {
  csrf: {
    ignore: ctx => true,
  },
};

exports.middleware = ['interceptor'];
