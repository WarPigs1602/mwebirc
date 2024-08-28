<%-- 
    Document   : webchat
    Created on : 17.08.2024, 13:27:04
    Author     : Andreas Pschorn
--%>

<%@page import="java.util.ArrayList"%>
<%@page import = "net.midiandmore.community.*" %>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@include file="init.jsp"%>
<%
    var nick = (String) session.getAttribute("nick");
    session.setAttribute("webchat_session_timout", webchatSessionTimeout);
    session.setAttribute("webchat_host", webchatHost);
    session.setAttribute("webchat_port", webchatPort);
    session.setAttribute("webchat_ssl", webchatSsl);
    session.setAttribute("webchat_server_password", webchatServerPassword);
    session.setAttribute("webchat_ident", webchatIdent);
    session.setAttribute("webchat_user", webchatUser);
    session.setAttribute("webchat_password", webchatPassword);
    session.setAttribute("webchat_realname", webchatRealname);
    session.setAttribute("webchat_mode", webircMode);
    session.setAttribute("webchat_cgiirc", webircCgi);
    session.setAttribute("hmac_temporal", hmacTemporal);
    session.setAttribute("hostname", request.getRemoteHost());
    session.setAttribute("ip", request.getRemoteAddr());
    session.setAttribute("forwarded_for_header", forwardedForHeader);
    session.setAttribute("forwarded_for_ips", forwardedForIps);
    var paramC = request.getParameter("channels");
    var paramN = request.getParameter("name");
    if (paramC == null) {
        paramC = "";
    } else if (!paramC.startsWith("#") && !paramC.startsWith("&")) {
        paramC = "#" + paramC;
    }
    if (paramN == null) {
        paramN = "";
    } else {
        paramN = paramN.replace("%", String.valueOf((int) (Math.random() * 9)));
    }
    var paramConnect = request.getParameter("connect");
    if (paramConnect != null) {
        var paramNick = request.getParameter("nick");
        if (paramNick == null) {
            paramNick = "";
        }
        session.setAttribute("param-nick", paramNick);
        var paramChannel = request.getParameter("channel");
        if (paramChannel == null) {
            paramChannel = "";
        } else {
            paramChannel = paramChannel.replace("#", "");
        }
        session.setAttribute("param-channel", paramChannel);
%>
<jsp:include page="header-webchat.jsp"/> 
<div class="top_frame" id="nav_window">
</div>
<div class="topic_frame" id="topic_window">
</div>
<div class="chat_frame" id="chat_window">
</div>
<div class="right_frame" id="right">
</div>
<div class="post_frame post_field input-group">
    <input type="text" class="form-control form-control-sm" autocomplete="off" id="message" maxlength="400" value="" onkeydown="return submitChatInput(event);"></input>
    <input type="button" value="Send" class="input-group-append btn btn-secondary btn-sm" onclick="sendText();"></input>
</div>   
<script>
    var user = "<% out.print(paramNick); %>";
    const chan = "<% out.print(paramChannel); %>";
</script>
<script src="file/chat.js"></script>
<script src="file/irc.js"></script> 
<script src="file/post.js"></script> 
<jsp:include page="footer-webchat.jsp"/> 
<%
} else {
%>
<jsp:include page="header.jsp"/> 
<form method="POST" name="login" action="" target="_top" accept-charset="utf-8">

    <input name="connect" value="true" type="hidden">
    <input class="form-control form-control-sm" maxlength="20" name="nick" value="<% out.print(paramN); %>" placeholder="Nickname">
    <input class="form-control form-control-sm" maxlength="255" name="channel" value="<% out.print(paramC); %>" placeholder="Channel">
    <input class="input-group-append btn btn-secondary btn-sm" value="Login" type="submit">
</form>
<jsp:include page="footer.jsp"/> 
<%
    }
%>
