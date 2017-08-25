'use strict'
/*
 * @Author: ZhaoLei 
 * @Date: 2017-08-22 14:52:17 
 * @Last Modified by:   ZhaoLei 
 * @Last Modified time: 2017-08-22 14:52:17 
 */
var ejs = require('ejs')
var heredoc = require('heredoc')

var tpl = heredoc(function() {
    /* 
    <xml>
    <ToUserName><![CDATA[<%- toUserName %>]]></ToUserName>
    <FromUserName><![CDATA[<%- fromUserName %>]]></FromUserName>
    <CreateTime><%= createTime %></CreateTime>
    <MsgType><![CDATA[<%- msgType %>]]></MsgType>
    <% if (msgType ==='text') {%><Content>
        <![CDATA[<%- content %>]]></Content>
    <%} else if (msgType ==='image') {%>
        <Image>
         <MediaId><![CDATA[<%- content.mediaId %>]]></MediaId>
        </Image>
    <%} else if (msgType ==='voice') {%>
        <Voice>
        <MediaId><![CDATA[<%- content.mediaId %>]]></MediaId>
        </Voice>
    <%} else if (msgType ==='video') {%>
        <Video>
        <MediaId><![CDATA[<%- content.mediaId %>]]></MediaId>
        <Title><![CDATA[<%- content.title %>]]></Title>
        <Description><![CDATA[<%- content.description %>]]>
        </Description>
        </Video>
    <%} else if (msgType ==='music') {%>
        <Music>
        <Title><![CDATA[<%- content.title %>]]></Title>
        <Description><![CDATA[<%- content.description %>]]></Description>
        <MusicUrl><![CDATA[<%- content.musicUrl %>]]></MusicUrl>
        <HQMusicUrl><![CDATA[<%- content.hqMusicUrl %>]]></HQMusicUrl>
        <ThumbMediaId><![CDATA[<%- content.thumbMediaId %>]]></ThumbMediaId>
        </Music>
    <%} else if (msgType ==='news') {%>
        <ArticleCount><%= content.length %></ArticleCount>
        <Articles>
            <% content.forEach(function(item){ %>
                <item>
                <Title><![CDATA[<%- item.title %>]]></Title> 
                <Description><![CDATA[<%- item.description %>]]></Description>
                <PicUrl><![CDATA[<%- item.picUrl %>]]></PicUrl>
                <Url><![CDATA[<%- item.url %>]]></Url>
                </item>
            <%})%>
        </Articles>
   <%}%></xml>*/
})

var compiled = ejs.compile(tpl)

exports = module.exports = {
    compiled: compiled
}