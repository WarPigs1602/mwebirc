<%-- 
    Document   : header
    Created on : 17.08.2024, 13:38:44
    Author     : Andreas Pschorn
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="de">
    <head>
        <title>MidiAndMore.Net - IRC Network</title>
        <meta content="Andreas Pschorn" name="author">
        <meta content="&copy;%SERVER_YEAR% by %SERVER_VENDOR%" name="description">
        <meta content="MidiAndMore.Net" name="software">
        <meta content="text/html; charset=UTF-8" http-equiv="content-type">
        <link rel="stylesheet" href="file/bootstrap/css/bootstrap.min.css" type="text/css">  
        <link rel="stylesheet" media="screen" href="file/style.css" type="text/css">  
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"> 
        <script src="file/jquery.js"></script>
        <script src="file/popper/js/popper.min.js"></script>
        <script src="file/bootstrap/js/bootstrap.min.js"></script>
    </head>
    <body>
        <div id="logo"></div>
        <nav>
            <menu>
                <menuitem id="Start">
                <a>Start</a>
                <menu>
                    <menuitem><a href="index.jsp">Start</a></menuitem>		          
                    <menuitem><a href="https://scratch.midiandmore.net/bugzilla/">Submit a bug!</a></menuitem>
                    <menuitem><a href="rules.jsp">Rules</a></menuitem>
                </menu>				  
                </menuitem>
                <menuitem><a href="webchat.jsp">Webchat</a></menuitem>
                <menuitem id="Login">
                <a>Login to M</a>
                <menu>
                    <menuitem style="background:#666666;">
                    <form method="POST" name="login" action="login.jsp" target="_top" accept-charset="utf-8">
                        <input
                            class="form-control form-control-sm" maxlength="20" name="nick"  placeholder="Nickname">
                        <input class="form-control form-control-sm" maxlength="20" name="password"
                               type="password"  placeholder="Password">
                        <input name="skin" value="%skin%" type="hidden">
                        <input class="input-group-append btn btn-secondary btn-sm" value="Login" type="submit">
                    </form>
                    </menuitem>
                </menu>				  
                </menuitem>			
            </menu>
        </nav>
        <div id="pagecontent">