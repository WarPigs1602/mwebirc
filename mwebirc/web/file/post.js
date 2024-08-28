var messageHistory = new Array();
var messageCounter = 0;
var browser = navigator.appName;
let message = document.getElementById("message");
clearMessageHistory();

function clearMessageHistory() {
    messageHistory = new Array();
}

function addMessageHistory(message) {
    messageHistory.push(message);
}


function submitChatInput(keyEvent) {
    var key = keyEvent.key;
    if (key === 'ArrowUp') {
        messageUp();
        return true;
    }
    if (key === 'ArrowDown') {
        messageDown();
        return true;
    }
    if (key === 'k' && keyEvent.ctrlKey) {
        control(3);
        return false;
    }
    if (key === 'b' && keyEvent.ctrlKey) {
        control(2);
        return false;
    }
    if (key === 'i' && keyEvent.ctrlKey) {
        control(29);
        return false;
    }
    if (key === 'l' && keyEvent.ctrlKey) {
        control(30);
        return false;
    }
    if (key === 'u' && keyEvent.ctrlKey) {
        control(31);
        return false;
    }
    if (key === 'o' && keyEvent.ctrlKey) {
        control(15);
        return false;
    }
    if (key === 'Enter') {
        sendText();
        return false;
    }
    if (key === 'Tab') {
        tab();
        return false;
    } else  {
        return true;
    }
}

function focusText() {
    clearMessage();
}

function control(code) {
    message.value += String.fromCharCode(code);
}

function sendText() {
    addMessageHistory(message.value);
    messageCounter = -1;
    if (message.value !== "") {
        submitText();
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
            text = "/privmsg " + aw + " :" + text;
            add_window();
        } else {
            get_timestamp();
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
        text = "/privmsg " + aw + " :" + String.fromCharCode(1) + "ACTION " + escapeHtml(text) + String.fromCharCode(1);
        add_window();
    } else if (text.startsWith("/msg ")) {
        text = text.substring(5);
        output = aw;
        parse_output("&raquo; " + text.split(" ", 1)[0] + ": " + text.substring(text.split(" ", 1)[0].length + 1));
        text = "/privmsg " + text.split(" ", 1)[0] + " :" + escapeHtml(text).substring(text.split(" ", 1)[0].length + 1);
        add_window();
    } else if (text.startsWith("/notice ")) {
        text = text.substring(8);
        output = aw;
        parse_output("-" + text.split(" ", 1)[0] + "- " + text.substring(text.split(" ", 1)[0].length + 1));
        text = "/notice " + text.split(" ", 1)[0] + " " + escapeHtml(text).substring(text.split(" ", 1)[0].length + 1);
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
    if (messageCounter < messageHistory.length) {
        message.value = messageHistory[messageCounter];
        message.focus();
    } else {
        messageDown();
    }
}

function messageDown() {
    if (messageCounter === 0) {
        message.value = "";
    } else {
        messageCounter--;
        message.value = messageHistory[messageCounter];
        message.focus();
    }
}

function tab() {
    var msg = message.value;
    var arr = null;
    var parse = null;
    var content = "";
    if (msg.includes(" ")) {
        arr = msg.split(" ");
        parse = arr[arr.length - 1];
        arr[arr.length - 1] = parse_tab(parse, false);
        for (const elem of arr) {
            content += elem;
            content += " ";
        }
    } else {
       content = parse_tab(msg, true); 
    }
    message.value = content;
}

function escapeHtml(e) {
    let n = document.createElement("p");
    return n.appendChild(document.createTextNode(e)), n.innerHTML;
}

function unescapeHtml(e) {
    let n = document.createElement("p");
    return n.innerHTML = e, 0 === n.childNodes.length ? "" : n.childNodes[0].nodeValue;
}