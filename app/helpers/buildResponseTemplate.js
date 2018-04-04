const text = ({ toUser, fromUser, content }) => (
  `<xml>
    <ToUserName><![CDATA[${toUser}]]></ToUserName>
    <FromUserName><![CDATA[${fromUser}]]></FromUserName>
    <CreateTime>${Date.now()}</CreateTime>
    <MsgType><![CDATA[text]]></MsgType>
    <Content><![CDATA[${content}]]></Content>
  </xml>`);

const imageText = ({ toUser, fromUser, content }) => (
  `<xml>
    <ToUserName><![CDATA[${toUser}]]></ToUserName>
    <FromUserName>< ![CDATA[${fromUser}] ]></FromUserName>
    <CreateTime>12345678</CreateTime><MsgType>< ![CDATA[news] ]>
    </MsgType><ArticleCount>2</ArticleCount>
    <Articles>
      <item>
        <Title><![CDATA[first title]]></Title>
        <Description><![CDATA[${content + '1'}]]></Description>
        <PicUrl><![CDATA[https://avatars2.githubusercontent.com/u/11340399?s=460&v=4]]></PicUrl>
        <Url><![CDATA[http://xuhaiming.github.io]]></Url>
      </item>
      <item>
        <Title><![CDATA[second title]]></Title>
        <Description>< ![CDATA[${content + '2'}] ]></Description>
        <PicUrl><![CDATA[https://avatars2.githubusercontent.com/u/11340399?s=460&v=4]]></PicUrl>
        <Url><![CDATA[http://xuhaiming.github.io]]></Url>
      </item>
    </Articles>
  </xml>`);

module.exports = {
  text,
  imageText,
};
