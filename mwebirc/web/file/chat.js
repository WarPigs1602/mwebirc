var win = document.defaultView;
let cw = new Array();
let aw = 'Status';
let nav_window = document.getElementById("nav_window");
let right = document.getElementById("right");
let nv = document.createElement("nv");
let output = "Status";
let user_color = null;
let chat_window = document.getElementById("chat_window");
let topic_window = document.getElementById("topic_window");
var socket = new WebSocket(location.origin.replace(/^http/, 'ws') + "/mwebirc/Webchat");
var login = true;
var highlight = false;
nv.innerHTML = '';
window.onbeforeunload = function () {
    return "WarnOnClose";
};
const colors = [
    'white',
    'black',
    'navy',
    'green',
    'red',
    'brown',
    'purple',
    'olive',
    'yellow',
    'lightgreen',
    'teal',
    'cyan',
    'blue',
    'pink',
    'gray',
    'lightgray'
];

add_page('Status', 'status', true);
parse_page(get_timestamp() + " mwebirc 1.0<br>\n");
parse_page(get_timestamp() + " &copy; 2024 by Andreas Pschorn<br>\n");
parse_page(get_timestamp() + " <a href=\"https://github.com/WarPigs1602/mwebirc\" target=\"_blank\">https://github.com/WarPigs1602/mwebirc</a><br>\n");
parse_page(get_timestamp() + " Licensed under the MIT License<br>\n");
parse_page(get_timestamp() + " <span style=\"color: #ff0000\">==</span> Connecting to server, please wait...<br>\n");

function get_user() {
    return user;
}

function set_window(win) {
    aw = win;
    add_window();
}

function parse_control(text) {
    var content = text;
    var arr = null;
    var elem = 0;
    if (text.includes(String.fromCharCode(3))) {
        arr = text.split(String.fromCharCode(3));
        var open = false;
        content = arr[0];
        var cnt = 0;
        for (var i = 1; i < arr.length; i++) {
            var color = "#000000";
            var bgcolor = "#FFFFFF";
            var code = arr[i].split(" ")[0].replace(/[^0-9,]/g, "");
            if (code.length > 0 && arr[i].startsWith(code)) {
                var control = new Array();
                if (code.includes(",")) {
                    control = code.split(",");
                } else {
                    control.push(code);
                }
                if (control.length === 1) {
                    for (var j = 0; j < colors.length; j++) {
                        if (j === parseInt(control[0])) {
                            color = colors[j];
                            cnt++;
                            elem++;
                        }
                    }
                } else if (control.length === 2) {
                    for (var j = 0; j < colors.length; j++) {
                        if (j === parseInt(control[0])) {
                            color = colors[j];
                            cnt++;
                            elem++;
                        }
                        if (j === parseInt(control[1])) {
                            bgcolor = colors[j];
                        }
                    }
                }
                arr[i] = arr[i].substring(code.length);
                content += "<span style=\"color: " + color + "; background-color: " + bgcolor + "\">";
                content += arr[i];
            } else {
                content += arr[i];
            }
        }
        if (cnt > 0) {
            while (cnt !== 0) {
                content += "</span>";
                cnt--;
                elem--;
            }
        }
        text = content;
    }
    if (text.includes(String.fromCharCode(2))) {
        arr = text.split(String.fromCharCode(2));
        var open = false;
        content = arr[0];
        for (var i = 1; i < arr.length; i++) {
            if (!open) {
                content += "<span style=\"font-weight: bold;\">";
                open = true;
                content += arr[i];
                elem++;
            } else {
                elem--;
                content += arr[i];
                content += "</span>";
                open = false;
            }
        }
        if (open) {
            content += "</span>";
            elem--;
        }
        text = content;
    }
    if (text.includes(String.fromCharCode(29))) {
        arr = text.split(String.fromCharCode(29));
        var open = false;
        content = arr[0];
        for (var i = 1; i < arr.length; i++) {
            if (!open) {
                content += "<span style=\"font-style: italic;\">";
                open = true;
                content += arr[i];
                elem++;
            } else {
                elem--;
                content += arr[i];
                content += "</span>";
                open = false;
            }
        }
        if (open) {
            elem--;
            content += "</span>";
        }
        text = content;
    }
    if (text.includes(String.fromCharCode(30))) {
        arr = text.split(String.fromCharCode(30));
        var open = false;
        content = arr[0];
        for (var i = 1; i < arr.length; i++) {
            if (!open) {
                content += "<span style=\"text-decoration: line-through;\">";
                open = true;
                content += arr[i];
                elem++;
            } else {
                elem--;
                content += arr[i];
                content += "</span>";
                open = false;
            }
        }
        if (open) {
            elem--;
            content += "</span>";
        }
        text = content;
    }
    if (text.includes(String.fromCharCode(31))) {
        arr = text.split(String.fromCharCode(31));
        var open = false;
        content = arr[0];
        for (var i = 1; i < arr.length; i++) {
            if (!open) {
                content += "<span style=\"text-decoration: underline;\">";
                open = true;
                content += arr[i];
                elem++;
            } else {
                elem--;
                content += arr[i];
                content += "</span>";
                open = false;
            }
        }
        if (open) {
            elem--;
            content += "</span>";
        }
        text = content;
    }
    if (text.includes(String.fromCharCode(15))) {
        arr = text.split(String.fromCharCode(15));
        content = arr[0];
        for (var j = 1; j < arr.length; j++) {
            while (elem >= 0) {
                content += "</span>";
                content += arr[j];
                elem--;
            }
        }
        text = content;
    }
    return text;
}
function add_nick(channel, nick, host, color) {
    var elem = null;
    cw.forEach(async (elem) => {
        if (elem.page.toLowerCase() === channel.toLowerCase()) {
            if(elem.nicks.length === 0) {
                color = user_color;
            }
            if (!elem.nicks.some(e => e.nick === nick)) {
                elem.nicks.push({
                    nick: nick,
                    host: host,
                    color: color
                });
            }
        }
    });
    sort_status(channel);
    render_userlist(channel);
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        if (i === 2) {
            color += letters[Math.floor(Math.random() * 10)];
        } else {
            color += letters[Math.floor(Math.random() * 16)];
        }
    }
    return color;
}

function parse_channels(channel) {
    if (!channel.includes(",")) {
        if (!is_channel(channel)) {
            return "#" + channel;
        }
    }
    var ch = channel.split(",");
    var data = "";
    for (const elem of ch) {
        if (!is_channel(elem)) {
            data += "#";
        }
        data += elem;
        data += ",";
    }
    return data.substring(0, data.length - 1);
}

function set_host(channel, nick, host) {
    for (const elem of cw) {
        if (elem.page.toLowerCase() === channel.toLowerCase()) {
            var parsed = null;
            var status = get_status(channel, nick);
            if (status.length === 1) {
                parsed = status + nick;
            } else {
                parsed = nick;
            }
            for (const name of elem.nicks) {
                var color = name.color;
                if (name.nick.toLowerCase() === parsed.toLowerCase()) {
                    let i = elem.nicks.findIndex(data => data.nick === parsed);
                    elem.nicks.splice(i, 1, {
                        nick: parsed,
                        host: host,
                        color: color
                    });
                    return;
                }
            }
        }
    }
}

function set_mode(channel, line) {
    for (const elem of cw) {
        if (elem.page.toLowerCase() === channel.toLowerCase()) {
            for (const name of elem.nicks) {
                var nick = name.nick;
                var host = name.host;
                var color = name.color;
                var parsed = null;
                if (line.includes(" ")) {
                    var modes = line.split(" ");
                    if (modes[0].includes("-") || modes[0].includes("+")) {
                        var mode = modes[0].split("");
                        var add = false;
                        var remove = false;
                        var flag = 0;
                        var status = "";
                        for (let j = 0; j < mode.length; j++) {
                            if (mode[j] === "-") {
                                remove = true;
                                add = false;
                                flag++;
                                continue;
                            } else if (mode[j] === "+") {
                                add = true;
                                remove = false;
                                flag++;
                                continue;
                            } else if (mode[j] === "o") {
                                if (add) {
                                    status = "@";
                                } else if (remove) {
                                    status = "";
                                }
                            } else if (mode[j] === "v") {
                                if (add) {
                                    status = "+";
                                } else if (remove) {
                                    status = "";
                                }
                            } else {
                                flag++;
                                continue;
                            }
                            var nickname = get_nick(channel, nick);
                            if (modes[j - flag + 1] === nickname) {
                                parsed = status + nickname;
                                let i = elem.nicks.findIndex(data => data.nick === nick);
                                elem.nicks.splice(i, 1, {
                                    nick: parsed,
                                    host: host,
                                    color: color
                                });
                            }
                        }
                    }
                }
            }
        }
    }
    sort_status(channel);
    render_userlist(channel);
}

function del_nick(channel, nick) {
    for (const elem of cw) {
        var parsed = null;
        var status = get_status(channel, nick);
        if (status && status.length === 1) {
            parsed = status + nick;
        } else {
            parsed = nick;
        }
        if (elem.page.toLowerCase() === channel.toLowerCase() && elem.nicks.some(e => e.nick === parsed)) {
            let i = elem.nicks.findIndex(data => data.nick === parsed);
            elem.nicks.splice(i, 1);
        }
    }
    sort_status(channel);
    render_userlist(channel);
}

function is_nick(channel, nick) {
    var flag = false;
    for (const elem of cw) {
        if (elem.page.toLowerCase() === channel.toLowerCase()) {
            if (elem.nicks.length === 0) {
                flag = false;
                break;
            }
            for (const name of elem.nicks) {
                var nickname = get_status(channel, nick) + nick;
                if (name.nick === nickname) {
                    flag = true;
                }
            }
        }
    }
    return flag;
}

function clear_nicks(channel) {
    for (const elem of cw) {
        if (elem.page.toLowerCase() === channel.toLowerCase()) {
            for (const name of elem.nicks) {
                elem.nicks.splice(0, elem.nicks.length);
                return;
            }
        }
    }
}

function quit(nick, reason) {
    if (nick.toLowerCase() === user.toLowerCase()) {
        user = nick;
    }
    for (const elem of cw) {
        for (const name of elem.nicks) {
            var channel = elem.page;
            var parsed = null;
            var status = get_status(channel, nick);
            var color = get_color(channel, nick);
            if (status && status.length === 1) {
                parsed = status + nick;
            } else {
                parsed = nick;
            }
            if (name.nick.toLowerCase() === parsed.toLowerCase()) {
                if (is_channel(channel)) {
                    let i = elem.nicks.findIndex(data => data.nick === parsed);
                    elem.nicks.splice(i, 1);
                    sort_status(channel);
                    render_userlist(channel);
                }
                if (reason.length !== 0) {
                    reason = " (" + reason + ")";
                }
                parse_pages(get_timestamp() + "  <span style=\"color: #ff0000\">==</span> <span style=\"color: " + color + ";\">" + parsed + "</span> has left IRC" + reason + "<br>\n", channel);
            }
        }
    }
}

function change_nick(oldnick, newnick) {
    if (oldnick.toLowerCase() === user.toLowerCase()) {
        user = newnick;
    }
    for (const elem of cw) {
        for (const name of elem.nicks) {
            var channel = elem.page;
            var parsed = null;
            var parsed2 = null;
            var status = get_status(channel, oldnick);
            if (status && status.length === 1) {
                parsed = status + oldnick;
                parsed2 = status + newnick;
            } else {
                parsed = oldnick;
                parsed2 = newnick;
            }
            if (name.nick.toLowerCase() === parsed.toLowerCase()) {
                var host = name.host;
                var color = name.color;
                if (is_channel(channel)) {
                    let i = elem.nicks.findIndex(data => data.nick === parsed);
                    elem.nicks.splice(i, 1, {
                        nick: parsed2,
                        host: host,
                        color: color
                    });
                    sort_status(channel);
                    render_userlist(channel);
                }
                parse_pages(get_timestamp() + "  <span style=\"color: #ff0000\">==</span> <span style=\"color: " + color + ";\">" + parsed + "</span> has changed his nick to <span style=\"color: " + color + ";\">" + newnick + "</span><br>\n", channel);
                break;
            }
        }
    }
}

function is_channel(channel) {
    var flag = false;
    if (channel.startsWith("#") || channel.startsWith("&")) {
        flag = true;
    }
    return flag;
}

function parse_flags(nick, name) {
    flag = false;
    if (nick === name.substring(1)) {
        flag = true;
    }
    if (nick.substring(1) === name) {
        flag = true;
    }
    if (nick === name) {
        flag = true;
    }
    return flag;
}

function sort_status(channel) {
    var elem = null;
    cw.forEach(async (elem) => {
        if (elem.page.toLowerCase() === channel.toLowerCase()) {
            elem.nicks.sort(SortArray);
        }
    });
}

function SortArray(x, y) {
    return x.nick.localeCompare(y.nick);
}

function parse_url(url) {
    try {
        const link = new URL(url);
        return "<a href=\"" + link.href + "\" target=\"_blank\">" + link.href + "</a>";
    } catch (err) {
        return url;
    }
}
function render_userlist(channel) {
    var content = parse_channel(channel);
    var elem = null;
    cw.forEach(async (elem) => {
        if (elem.page.toLowerCase() === channel.toLowerCase()) {
            var nick = null;
            var doc = document.createElement("ulist_" + content);
            doc.innerHTML = "";
            elem.nicks.forEach(async (nick) => {
                doc.innerHTML += "<span style=\"color: " + nick.color + ";\">" + nick.nick + "</span><br>\n";
            });
            while (right.firstChild) {
                right.removeChild(right.firstChild);
            }
            parse_frame(channel, elem.type);
            right.appendChild(doc);
        }
    });
    return status;
}

function parse_frame(channel, type) {
    const right = document.querySelectorAll(".right_frame");
    const cf = document.querySelectorAll(".chat_frame");
    const tf = document.querySelectorAll(".topic_frame");
    if (type !== "channel" || !window.matchMedia("(min-width: 600px)").matches) {
        for (const frame of right) {
            frame.style.cssText = 'display: none;';
        }
        for (const frame of cf) {
            frame.style.cssText = "right: 3px; top: 25px;";
        }
        for (const frame of tf) {
            frame.style.cssText = 'display: none;';
        }
    } else {
        for (const frame of right) {
            frame.style.cssText = "display: initial;";
        }
        for (const frame of cf) {
            frame.style.cssText = "right: 200px; top: 47px;";
        }
        for (const frame of tf) {
            frame.style.cssText = 'display: initial;';
        }
    }
}
function parse_status(channel, nickname) {
    var status = null;
    if (channel.startsWith("#") || channel.startsWith("&")) {
        if (nickname.startsWith("@") || nickname.startsWith("+")) {
            status = nickname.substring(0, 1);
        } else {
            status = "";
        }
    }
    return status;
}

function get_status(channel, nickname) {
    for (const elem of cw) {
        if (elem.page.toLowerCase() === channel.toLowerCase()) {
            for (const nick of elem.nicks) {
                if (nick.nick.startsWith("@")) {
                    if (nick.nick.toLowerCase() === "@" + nickname.toLowerCase()) {
                        return "@";
                    }
                } else if (nick.nick.startsWith("+")) {
                    if (nick.nick.toLowerCase() === "+" + nickname.toLowerCase()) {
                        return "+";
                    }
                }
            }
        }
    }
    return "";
}

function get_color(channel, nickname) {
    for (const elem of cw) {
        if (elem.page.toLowerCase() === channel.toLowerCase()) {
            for (const nick of elem.nicks) {
                if (nick.nick.startsWith("@")) {
                    if (nick.nick.toLowerCase() === "@" + nickname.toLowerCase()) {
                        return nick.color;
                    }
                } else if (nick.nick.startsWith("+")) {
                    if (nick.nick.toLowerCase() === "+" + nickname.toLowerCase()) {
                        return nick.color;
                    }
                } else {
                    if (nick.nick.toLowerCase() === nickname.toLowerCase()) {
                        return nick.color;
                    }
                }
            }
        }
    }
    return "";
}

function parse_tab(nickname, start) {
    if (!is_channel(aw)) {
        return nickname;
    }
    for (const elem of cw) {
        if (elem.page.toLowerCase() === aw.toLowerCase()) {
            for (const nick of elem.nicks) {
                var name = get_nick(aw, nick.nick);
                if (name.toLowerCase().startsWith(nickname.toLowerCase())) {
                    if (start) {
                        return name + ": ";
                    } else {
                        return name;
                    }
                }
            }
        }
    }
    return nickname;
}

function get_nick(channel, nickname) {
    var elem = null;
    var status = null;
    cw.forEach(async (elem) => {
        if (elem.page.toLowerCase() === channel.toLowerCase()) {
            var nick = null;
            elem.nicks.forEach(async (nick) => {
                if (nick.nick.startsWith("@") || nick.nick.startsWith("+")) {
                    if (nick.nick.toLowerCase() === nickname.toLowerCase()) {
                        status = nick.nick.substring(1, nick.nick.length);
                    }
                } else {
                    if (nick.nick.toLowerCase() === nickname.toLowerCase()) {
                        status = nick.nick;
                    }
                }
            });
        }
    });
    return status;
}

function parse_channel(channel) {
    return channel.replace(/[^a-zA-Z0-9]/g, "_");
}

function add_page(page, type, open) {
    var content = parse_channel(page);
    if (content.length === 0) {
        return;
    }
    cw.push({
        type: type.toLowerCase(),
        page: page,
        elem: document.createElement(content),
        topic: "",
        setted: 0,
        by: "",
        nicks: new Array()
    });
    if (open) {
        set_window(page);
    }
    refresh_nav();
    add_window();
}

function render_topic(channel) {
    if (!channel) {
        return;
    }
    var content = parse_channel(channel);
    var elem = null;
    cw.forEach(async (elem) => {
        if (elem.page.toLowerCase() === channel.toLowerCase() && channel.toLowerCase() === aw.toLowerCase()) {
            var nick = null;
            var doc = document.createElement("topic_" + content);
            if (elem.topic && elem.topic.length !== 0) {
                doc.innerHTML = channel + ": " + parse_control(elem.topic);
            } else {
                doc.innerHTML = channel + ": (No topic set)";
            }
            while (topic_window.firstChild) {
                topic_window.removeChild(topic_window.firstChild);
            }
            topic_window.appendChild(doc);
        }
    });
}

function set_topic(channel, topic) {
    cw.forEach(async (elem) => {
        if (elem.page.toLowerCase() === channel.toLowerCase()) {
            elem.topic = topic;
        }
    });
    render_topic(channel);
}

function get_topic(channel) {
    var topic = null;
    cw.forEach(async (elem) => {
        if (elem.page.toLowerCase() === channel.toLowerCase()) {
            topic = elem.topic;
        }
    });
    return topic;
}

function update_topic(channel, by, time) {
    cw.forEach(async (elem) => {
        if (elem.page.toLowerCase() === channel.toLowerCase()) {
            elem.by = by;
            elem.setted = time;
        }
    });
}

function del_page(page) {
    if (cw.length === 0) {
        return;
    }
    cw.forEach(async (elem) => {
        if (elem.page.toLowerCase() === page.toLowerCase() && elem.type.toLowerCase() !== "status") {
            let i = cw.findIndex(data => data.page === page);
            cw.splice(i, 1);
        }
    });
    refresh_nav();
    set_window("Status");
}

function refresh_nav() {
    for (var i = 0; i < cw.length; i++) {
        if (i === 0) {
            nv.innerHTML = '<a href="#" onclick="set_window(\'' + cw[i].page + '\');"> ' + cw[i].page + '</a> ';
        } else {
            if (cw[i].page.startsWith("#") || cw[i].page.startsWith("&")) {
                nv.innerHTML += '<a href="#" onclick="set_window(\'' + cw[i].page + '\');"> ' + cw[i].page + '</a> <a href="#" onclick="submitTextMessage(\'/part ' + cw[i].page + ' Closed tab!\');">X</a> ';
            } else {
                nv.innerHTML += '<a href="#" onclick="set_window(\'' + cw[i].page + '\');"> ' + cw[i].page + '</a> <a href="#" onclick="del_page(\'' + cw[i].page + '\');">X</a> ';
            }
        }
    }
    while (nav_window.firstChild) {
        nav_window.removeChild(nav_window.firstChild);
    }
    nav_window.appendChild(nv);
}

function parse_pages2(text, cnt) {
    cnt.elem.innerHTML += text;
}

function parse_pages(text, pg) {
    for (const elem of cw) {
        if (elem.page.toLowerCase() === pg.toLowerCase()) {
            if (highlight) {
                text = "<span style=\"color: #990000\">" + text;
            }
            var arr = null;
            var parsed = "";
            if (text.includes(" ")) {
                arr = text.split(" ");
                for (const part of arr) {
                    if (part.startsWith("http://") || part.startsWith("https://")) {
                        if (part.endsWith("<br>\n")) {
                            parsed += parse_url(part.substring(0, part.length - 5));
                            parsed += "<br>\n";
                        } else {
                            parsed += parse_url(part);
                        }
                    } else {
                        parsed += part;
                    }
                    parsed += " ";
                }
            } else {
                if (text.startsWith("http://") || text.startsWith("https://")) {
                    if (text.endsWith("<br>\n")) {
                        parsed += parse_url(text.substring(0, text.length - 5));
                    } else {
                        parsed += parse_url(text);
                        parsed += "<br>\n";
                    }
                } else {
                    parsed += text;
                }
            }
            parsed = parse_control(parsed);
            if (highlight) {
                parsed += "</span>";
                highlight = false;
            }
            elem.elem.innerHTML += parsed;
            return;
        }
    }
}

function parse_page(text) {
    if (highlight) {
        text = "<span style=\"color: #990000\">" + text;
    }
    for (const elem of cw) {
        var arr = null;
        var parsed = "";
        if (text.includes(" ")) {
            arr = text.split(" ");
            for (const part of arr) {
                if (part.startsWith("http://") || part.startsWith("https://")) {
                    if (part.endsWith("<br>\n")) {
                        parsed += parse_url(part.substring(0, part.length - 5));
                        parsed += "<br>\n";
                    } else {
                        parsed += parse_url(part);
                    }
                } else {
                    parsed += part;
                }
                parsed += " ";
            }
        } else {
            if (text.startsWith("http://") || text.startsWith("https://")) {
                if (text.endsWith("<br>\n")) {
                    parsed += parse_url(text.substring(0, text.length - 5));
                } else {
                    parsed += parse_url(text);
                    parsed += "<br>\n";
                }
            } else {
                parsed += text;
            }
        }
        parsed = parse_control(parsed);
        if (highlight) {
            parsed += "</span>";
            highlight = false;
        }
        elem.elem.innerHTML += parsed;
    }
}

function is_page(page) {
    for (let i = 0; i < cw.length; i++) {
        if (cw[i].page.toLowerCase() === page.toLowerCase()) {
            return true;
        }
    }
    return false;
}

function scrollToEnd(block, duration) {
    // if block not passed scroll to end of page
    block = block || $("html, body");
    duration = duration || 100;
    // you can pass also block's jQuery selector instead of jQuery object
    if (typeof block === 'string') {
        block = $(block);
    }

    // if exists at list one block
    if (block.length) {
        block.animate({
            scrollTop: block.get(0).scrollHeight
        }, duration);
    }
}

function redirect(url) {
    win.top.location.href = url;
}

function redirect_chat(url) {
    win.location.href = url;
}

function get_page(page) {
    for (let i = 0; i < cw.length; i++) {
        if (cw[i].page.toLowerCase() === page.toLowerCase()) {
            return cw[i].elem;
        }
    }
    return null;
}

function add_window() {
    if (aw) {
        var content = get_page(aw.toString());
        chat_window.innerHTML = content.innerHTML;
        cw.forEach(async (elem) => {
            if (elem.page.toLowerCase() === aw.toLowerCase()) {
                parse_frame(elem.page, elem.type);
            }
        });
        sort_status(aw);
        render_userlist(aw);
        render_topic(aw);
        scrollToEnd("#chat_window", 1);
    } else {
        var elem = null;
        cw.forEach(async (elem) => {
            chat_window.innerHTML = elem.elem.innerHTML;
            parse_frame(elem.page, elem.type);
            scrollToEnd("#chat_window", 1);
        });
    }
}

function get_date(date) {
    return new Date(date).toLocaleString();
}


function get_timestamp() {
    var time = new Date();
    var hour = time.getHours();
    var minute = (time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes());
    var second = (time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds());
    return "[" + hour + ":" + minute + ":" + second + "]";
}

// callback-Funktion wird gerufen, wenn die Verbindung erfolgreich aufgebaut werden konnte

socket.onopen = function () {

    console.log("Succesfully connected...");
};
// callback-Funktion wird gerufen, wenn eine neue Websocket-Nachricht eintrifft

socket.onmessage = function (messageEvent) {
    var msg = JSON.parse(messageEvent.data);
    var message = msg.message;
    var category = msg.category;
    if (category === "error") {
        parse_page(get_timestamp() + "  <span style=\"color: #ff0000\">==</span> Error: " + message + "<br>");
        add_window();
    } else if (category === "chat") {
        if (message === "Ping? Pong!") {
            return;
        } else {
            parse_output(message);
            add_window();
        }
    } else {
        parse_page(get_timestamp() + "  <span style=\"color: #ff0000\">==</span> Unknown category: " + category + "<br>");
        add_window();
    }
};
// callback-Funktion wird gerufen, wenn ein Fehler auftritt

socket.onerror = function (errorEvent) {
    parse_page(get_timestamp() + "  <span style=\"color: #ff0000\">==</span> Connection to server lost: " + errorEvent.reason + "<br>");
    add_window();
    scrollToEnd("#chat_window", 100);
};
socket.onclose = function (closeEvent) {
    parse_page(get_timestamp() + "  <span style=\"color: #ff0000\">==</span> Connection to server closed!<br>");
    add_window();
    scrollToEnd("#chat_window", 100);
}
;
