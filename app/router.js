module.exports = app => {
  const { router, controller } = app;
  router.get('/gateway', controller.index.gateway);
  router.post('/gateway', controller.index.gatewayPost);
};
