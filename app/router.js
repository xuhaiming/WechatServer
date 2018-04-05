module.exports = app => {
  const { router, controller } = app;
  router.get('/gateway', controller.index.gateway);
  router.post('/gateway', controller.index.gatewayPost);
  router.get('/token', controller.index.getAccessToken);
  router.get('/qrcode', controller.index.getQrCode);
  router.get('/send', controller.index.sendMessage);
};
