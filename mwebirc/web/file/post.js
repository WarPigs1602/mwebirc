var messageHistory = new Array(20);
var messageCounter = -1;
var browser = navigator.appName;
let message = document.getElementById("message");
clearMessageHistory();

function clearMessageHistory() {
    for (var i = 0; i <= 20; i++) {
        messageHistory[i] = "";
    }
}

function addMessageHistory(message) {
    for (var i = 20; i >= 0; i--) {
        if (i != 0) {
            messageHistory[i] = messageHistory[i - 1];
        } else {
            messageHistory[i] = message;
        }
    }
}

function submitOpera() {
    if (browser == "Opera") {
        sendText();
        return false;
    }
}

function submitChatInput(keyEvent) {
    if (browser == "Opera") {
        return true;
    }
    if (keyEvent.keyCode == "38") {
        messageUp();
        return true;
    }
    if (keyEvent.keyCode == "40") {
        messageDown();
        return true;
    }
    if (keyEvent.keyCode == "13") {
        sendText();
        return false;
    } else {
        return true;
    }
}

function focusText() {
    clearMessage();
}

function sendText() {
    addMessageHistory(message.value);
    messageCounter = -1;
    if (message.value != "") {
        submitText();
        $('body > .popover').popover('hide');
    }
    clearMessage();
}

function submitText()
{
    message.value = parseText(message.value);
    if (message.value) {
        var msg = {
            category: "chat",
            message: message.value,
            target: ""
        };
        socket.send(JSON.stringify(msg));
    }
}

function submitTextMessage(text)
{
    text = parseText(text);
    if (text) {
        var msg = {
            category: "chat",
            message: text,
            target: ""
        };
        socket.send(JSON.stringify(msg));
    }
}

function setTextMessage(text)
{
    message.value = text;
    message.focus();
}

function parseText(text) {
    if (!text.startsWith("/")) {
        if (aw.toLowerCase() !== "status") {
            output = aw;
            parse_output("&lt;" + get_status(aw, get_user()) + get_user() + "&gt; " + escapeHtml(text));
            text = "/privmsg " + aw + " " + text;
            add_window();
        } else {
        get_timestamp()    
            parse_output("*** You must start with / in the status window");
            add_window();
            return null;
        }
    } else if (text.startsWith("/names ")) {
    } else if (text.startsWith("/who ")) {
    } else if (text.startsWith("/kick ")) {
        text = text.substring(6);
        output = aw;
        text = "/kick " + aw + " " + escapeHtml(text);
        add_window();
    } else if (text.startsWith("/away ")) {
        text = text.substring(6);
        output = aw;
        text = "/away " + escapeHtml(text);
        add_window();
    } else if (text.startsWith("/me ")) {
        text = text.substring(4);
        output = aw;
        parse_output("* " + get_status(output, get_user()) + get_user() + " " + text);
        text = "/privmsg " + aw + " \001ACTION " + escapeHtml(text) + "\001";
        add_window();
    } else if (text.startsWith("/msg ")) {
        text = text.substring(5);
        output = text.split(" ", 1)[0];
        parse_output("* " + get_user() + " " + text);
        text = "/privmsg " + get_status(output, get_user()) + output + " " + escapeHtml(text).substring(output.length);
        add_window();
    } else if (text.startsWith("/part ")) {
        text = text.substring(6);
        output = text.split(" ", 1)[0];
        text = text.substring(output.length);
        aw = output;
        parse_output("*** " + get_user() + " has left " + aw);
        text = "/part " + output + " " + escapeHtml(text);
        add_window();
    } else if (text.startsWith("/quit ")) {
        text = text.substring(6);
        aw = null;
        parse_output("*** " + get_user() + " has quit IRC (Quit: " + escapeHtml(text) + ")");
        text = "/quit " + escapeHtml(text);
        add_window();
    }
    return ircText(text);
}

function ircText(text) {
    var content = text.split(" ");
    var result = "";
    for (var i = 0; i < content.length; i++) {
        if (i === 1 && (text.toLowerCase().startsWith("/quit") || text.toLowerCase().startsWith("/away"))) {
            result += " :";
        } else
        if (i === 2 && content.length !== 3 && !text.toLowerCase().startsWith("/mode") && !text.toLowerCase().startsWith("/away") && !text.toLowerCase().startsWith("/quit") && !text.toLowerCase().startsWith("/kick")) {
            result += " :";
        } else if (i === 3 && text.toLowerCase().startsWith("/kick")) {
            result += " :";
        } else {
            result += " ";
        }
        result += content[i];
    }
    return result.trim();
}

function clearMessage() {
    message.value = "";
    message.focus();
}

function emoticon(text) {
    message.value = message.value + text;
    message.focus();
}

function messageUp() {
    messageCounter++;
    if (messageCounter > 20) {
        messageCounter = 20;
    }
    message.value = messageHistory[messageCounter];
    message.focus();
}

function messageDown() {
    messageCounter--;
    if (messageCounter < 0) {
        messageCounter = 0;
        message.value = "";
    } else {
        message.value = messageHistory[messageCounter];
        message.focus();
    }
}

function escapeHtml(e) {
    let n = document.createElement("p");
    return n.appendChild(document.createTextNode(e)), n.innerHTML
}
;
function unescapeHtml(e) {
    let n = document.createElement("p");
    return n.innerHTML = e, 0 == n.childNodes.length ? "" : n.childNodes[0].nodeValue
}
;
