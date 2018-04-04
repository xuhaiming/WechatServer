const text = ({ toUser, fromUser, content }) => (
  `<xml> <ToUserName>< ![CDATA[${toUser}] ]></ToUserName> <FromUserName>< ![CDATA[${fromUser}] ]></FromUserName> <CreateTime>1522855306</CreateTime> <MsgType>< ![CDATA[text] ]></MsgType> <Content>< ![CDATA[${content}] ]></Content> </xml>`);

module.exports = {
  text,
};
