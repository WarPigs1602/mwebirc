function parse_output(text) {
    var outp = get_numerics(text.toString().trim());
    if (!outp) {
        return;
    }
    if (aw) {
        for (let i = 0; i < cw.length; i++) {
            if (output.toLowerCase() === cw[i].page.toLowerCase()) {
                parse_pages(get_timestamp() + " " + outp.trim() + "<br>\n", cw[i].page);
            }
        }
    } else {
        parse_page(get_timestamp() + " " + outp.trim() + "<br>\n");
    }
}

function get_numerics(text) {
    var arr = text.split(" ");
    var regex = /^[\d]+$/;
    if (arr[0].toLowerCase() === "error") {
        var parsed = "";
        for (var i = 1; i < arr.length; i++) {
            parsed += " " + arr[i];
        }
        output = aw;
        return "<span style=\"color: #ff0000\"> <span style=\"color: #ff0000\">==</span> Error: " + parsed.trim() + "</span>";
    } else if (arr[0].toLowerCase() === "notice" && arr[1].toLowerCase() === "auth") {
        var parsed = "";
        for (var i = 2; i < arr.length; i++) {
            parsed += " " + arr[i];
        }
        output = "Status";
        if (parsed.trim() === "*** (mwebirc) Found your hostname." || parsed.trim() === "*** (mwebirc) No hostname found.") {
            parse_page(get_timestamp() + " <span style=\"color: #ff0000\">==</span> " + parsed.trim() + "<br>\n");
            parse_page(get_timestamp() + " <span style=\"color: #ff0000\">==</span> Logging in, please wait...<br>\n");
            return null;
        }
        return " <span style=\"color: #ff0000\">==</span> " + parsed.trim();
    } else if (arr[1].match(regex)) {
        var parsed = "";
        if (arr[1] === "353") {
            var channel = arr[4];
            for (var i = 5; i < arr.length; i++) {
                add_nick(channel, arr[i], "");
            }
            return null;
        } else if (arr[1] === "332") {
            var channel = arr[3];
            for (var i = 4; i < arr.length; i++) {
                parsed += " " + arr[i];
            }
            set_topic(channel, parsed.trim());
            return null;
        } else if (arr[1] === "333") {
            var channel = arr[3];
            update_topic(channel, arr[3], arr[4]);
            return null;
        } else
        if (arr[1] === "366" || arr[1] === "315") {
            return null;
        } else
        if (arr[1] === "352") {
            var channel = arr[3];
            var nick = arr[7];
            var host = arr[4] + "@" + arr[5];
            set_host(channel, nick, host);
            return null;
        } else
        if (arr[1] === "352") {
            var channel = arr[3];
            var nick = arr[7];
            var host = arr[4] + "@" + arr[5];
            set_host(channel, nick, host);
            return null;
        } else
        if (arr[1] === "311") {
            output = aw;
            var nick = arr[3];
            var host = arr[4] + "@" + arr[5];
            for (var i = 7; i < arr.length; i++) {
                parsed += " " + arr[i];
            }
            return " <span style=\"color: #ff0000\">==</span> <span style\"font-weight: bold;\">" + nick + "</span> [" + host + "]<br>\n" + get_timestamp() + " <span style=\"color: #ff0000\">==</span> <p style=\"width: 80px; display: inline-block;\">&nbsp;realname</p> : " + parsed.trim();
        } else
        if (arr[1] === "319") {
            output = aw;
            var channels = new Array();
            for (var i = 4; i < arr.length; i++) {
                channels.push(arr[i]);
            }
            channels.sort(function (a, b) {
                return a.toLowerCase().localeCompare(b.toLowerCase());
            });
            for (const elem of channels) {
                parsed += elem;
                parsed += " ";
            }
            return " <span style=\"color: #ff0000\">==</span> <p style=\"width: 80px; display: inline-block;\">&nbsp;channels</p> : " + parsed.trim();
        } else
        if (arr[1] === "312") {
            output = aw;
            for (var i = 5; i < arr.length; i++) {
                parsed += " " + arr[i];
            }
            return " <span style=\"color: #ff0000\">==</span> <p style=\"width: 80px; display: inline-block;\">&nbsp;server</p> : " + arr[4] + " [" + parsed.trim() + "]";
        } else
        if (arr[1] === "330") {
            output = aw;
            return " <span style=\"color: #ff0000\">==</span> <p style=\"width: 80px; display: inline-block;\">&nbsp;account</p> : " + arr[4];
        } else
        if (arr[1] === "313") {
            output = aw;
            return " <span style=\"color: #ff0000\">==</span> <p style=\"width: 80px; display: inline-block;\">&nbsp;</p> : IRC-Operator";
        } else
        if (arr[1] === "318") {
            output = aw;
            return " <span style=\"color: #ff0000\">==</span> End of WHOIS";
        } else
        if (arr[1] === "306") {
            output = aw;
            return " <span style=\"color: #ff0000\">==</span> You have been marked as away!";
        } else
        if (arr[1] === "301") {
            output = aw;
            for (var i = 4; i < arr.length; i++) {
                parsed += " " + arr[i];
            }
            return " <span style=\"color: #ff0000\">==</span> <p style=\"width: 80px; display: inline-block;\">&nbsp;away</p> : " + parsed.trim();
        } else
        if (arr[1] === "317") {
            output = aw;
            return " <span style=\"color: #ff0000\">==</span> <p style=\"width: 80px; display: inline-block;\">&nbsp;idle</p> : " + arr[4] + " seconds idle [connected " + get_date(arr[5] * 1000) + "]";
        } else
        if (arr[1] === "321" || arr[1] === "322" || arr[1] === "323" || arr[1] === "396" || arr[1] === "403" || arr[1] === "381") {
            output = aw;
            for (var i = 3; i < arr.length; i++) {
                parsed += " " + arr[i];
            }
            return " <span style=\"color: #ff0000\">==</span> " + parsed.trim();
        } else
        if (arr[1] === "001") {
            output = aw;
            parse_page(get_timestamp() + " <span style=\"color: #ff0000\">==</span> Signed on!<br>\n");
        }
        if (arr[1].startsWith("3")) {
            output = aw;
            for (var i = 4; i < arr.length; i++) {
                parsed += " " + arr[i];
            }
        } else {
            output = "Status";
            for (var i = 3; i < arr.length; i++) {
                parsed += " " + arr[i];
            }
        }
        console.log("Code " + arr[1] + " == " + parsed.trim());
        return " <span style=\"color: #ff0000\">==</span> " + parsed.trim();
    } else if (arr[1].toLowerCase() === "notice") {
        var nick = parse_nick(arr[0]);
        var parsed = "";
        for (var i = 3; i < arr.length; i++) {
            parsed += " " + arr[i];
        }
        if (arr[0] === nick) {
            output = "Status";
        } else {
            output = nick;
        }
        if (!is_page(output)) {
            add_page(output, "query", false);
        }
        return "-" + nick + "- " + parsed;
    } else if (arr[1].toLowerCase() === "mode") {
        var nick = parse_nick(arr[0]);
        var parsed = "";
        for (var i = 3; i < arr.length; i++) {
            parsed += " " + arr[i];
        }
        if (arr[2] === nick) {
            output = "Status";
            if (login && chan.length !== 0) {
                submitTextMessage("/join " + parse_channels(chan));
                login = false;
            }
            return " <span style=\"color: #ff0000\">==</span> Usermode change: " + parsed.trim();
        } else {
            output = arr[2];
            var status = get_status(arr[2], nick);
            clear_nicks(arr[2]);
            if (arr[3].includes("o") || arr[3].includes("v")) {
                submitTextMessage("/names " + arr[2]);
            }
            return " <span style=\"color: #ff0000\">==</span> " + status + nick + " sets mode: " + parsed.trim();
        }
    } else if (arr[1].toLowerCase() === "topic") {
        var nick = parse_nick(arr[0]);
        var parsed = "";
        for (var i = 3; i < arr.length; i++) {
            parsed += " " + arr[i];
        }
        output = arr[2];
        var status = get_status(arr[2], nick);
        set_topic(output, parsed.trim());
        return " <span style=\"color: #ff0000\">==</span> " + status + nick + " sets topic: " + parsed.trim();
    } else if (arr[1].toLowerCase() === "quit") {
        var nick = parse_nick(arr[0]);
        var parsed = "";
        for (var i = 2; i < arr.length; i++) {
            parsed += " " + arr[i];
        }
        quit(nick, parsed.trim());
        return null;
    } else if (arr[1].toLowerCase() === "kill") {
        return null;
    } else if (arr[1].toLowerCase() === "nick") {
        var nick = parse_nick(arr[0]);
        change_nick(nick, arr[2]);
        return null;
    } else if (arr[1].toLowerCase() === "join") {
        var nick = parse_nick(arr[0]);
        var host = parse_host(arr[0]);
        if (get_user().toLowerCase() === nick.toLowerCase()) {
            aw = arr[2];
            output = aw;
            if (is_page(aw)) {
                del_page(aw);
            }
            aw = arr[2];
            output = aw;
            add_page(aw, 'channel', true);
        } else {
            output = arr[2];
            add_nick(arr[2], nick, host);
        }
        if (get_user().toLowerCase() === nick.toLowerCase()) {
            submitTextMessage("/who " + arr[2]);
        }
        return " <span style=\"color: #ff0000\">==</span> " + nick + " [" + parse_host(arr[0]) + "] has joined " + arr[2];
    } else if (arr[1].toLowerCase() === "part") {
        var nick = parse_nick(arr[0]);
        var parsed = "";
        for (var i = 3; i < arr.length; i++) {
            parsed += " " + arr[i];
        }
        if (get_user().toLowerCase() === nick.toLowerCase()) {
            output = aw;
            del_page(arr[2]);
        } else {
            output = arr[2];
        }
        if (parsed.trim().length !== 0) {
            parsed = " (" + parsed.trim() + ")";
        }
        del_nick(arr[2], nick);
        return " <span style=\"color: #ff0000\">==</span> " + get_status(arr[2], nick) + nick + " [" + parse_host(arr[0]) + "] has left " + arr[2] + parsed;
    } else if (arr[1].toLowerCase() === "kick") {
        var nick = parse_nick(arr[0]);
        var parsed = "";
        for (var i = 4; i < arr.length; i++) {
            parsed += " " + arr[i];
        }
        if (get_user().toLowerCase() === nick.toLowerCase()) {
            output = aw;
        } else {
            output = arr[2];
        }
        if (parsed.trim().length !== 0) {
            parsed = " (" + parsed.trim() + ")";
        }
        del_nick(arr[2], arr[3]);
        return " <span style=\"color: #ff0000\">==</span> " + get_status(arr[2], nick) + nick + " [" + parse_host(arr[0]) + "] has kicked " + arr[3] + parsed;
    } else if (arr[1].toLowerCase() === "privmsg") {
        var nick = parse_nick(arr[0]);
        if (arr[2].startsWith("#") || arr[2].startsWith("&")) {
            output = arr[2];
        } else {
            output = nick;
        }
        if (!is_page(output)) {
            add_page(output, "query", true);
        }
        var parsed = "";
        for (var i = 3; i < arr.length; i++) {
            parsed += " " + arr[i];
        }
        parsed = parsed.trim();
        if (parsed.startsWith("\001ACTION ") && parsed.endsWith("\001")) {
            return "* " + get_status(arr[2], nick) + nick + " " + parsed.substring(8, parsed.length - 1);
        } else {
            return "&lt;" + get_status(arr[2], nick) + nick + "&gt; " + parsed;
        }
    }
    return text;
}

function parse_nick(nick) {
    if (nick.includes("!")) {
        return nick.split("!", 2)[0];
    }
    return nick;
}

function parse_host(nick) {
    if (nick.includes("!")) {
        return nick.split("!", 2)[1];
    }
    return nick;
}