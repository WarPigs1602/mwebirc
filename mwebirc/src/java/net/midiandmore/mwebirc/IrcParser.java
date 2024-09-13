/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package net.midiandmore.mwebirc;

import jakarta.json.Json;
import jakarta.websocket.Session;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.io.StringReader;
import java.net.Socket;
import java.util.logging.Level;
import java.util.logging.Logger;
import static org.apache.commons.codec.digest.HmacAlgorithms.HMAC_SHA_256;
import org.apache.commons.codec.digest.HmacUtils;

/**
 * The irc parser
 *
 * @author Andreas Pschorn
 */
public class IrcParser {

    /**
     * @return the hmacTemporal
     */
    public long getHmacTemporal() {
        return hmacTemporal;
    }

    /**
     * @param hmacTemporal the hmacTemporal to set
     */
    public void setHmacTemporal(long hmacTemporal) {
        this.hmacTemporal = hmacTemporal;
    }

    /**
     * @return the mode
     */
    public String getMode() {
        return mode;
    }

    /**
     * @param mode the mode to set
     */
    public void setMode(String mode) {
        this.mode = mode;
    }

    /**
     * @return the cgi
     */
    public String getCgi() {
        return cgi;
    }

    /**
     * @param cgi the cgi to set
     */
    public void setCgi(String cgi) {
        this.cgi = cgi;
    }

    /**
     * @return the hostname
     */
    public String getHostname() {
        return hostname;
    }

    /**
     * @param hostname the hostname to set
     */
    public void setHostname(String hostname) {
        this.hostname = hostname;
    }

    /**
     * @return the ip
     */
    public String getIp() {
        return ip;
    }

    /**
     * @param ip the ip to set
     */
    public void setIp(String ip) {
        this.ip = ip;
    }

    /**
     * @return the realname
     */
    public String getRealname() {
        return realname;
    }

    /**
     * @param realname the realname to set
     */
    public void setRealname(String realname) {
        this.realname = realname;
    }

    /**
     * @return the out
     */
    public PrintWriter getOut() {
        return out;
    }

    /**
     * @param out the out to set
     */
    public void setOut(PrintWriter out) {
        this.out = out;
    }

    /**
     * @return the in
     */
    public BufferedReader getIn() {
        return in;
    }

    /**
     * @param in the in to set
     */
    public void setIn(BufferedReader in) {
        this.in = in;
    }

    /**
     * @return the host
     */
    public String getHost() {
        return host;
    }

    /**
     * @param host the host to set
     */
    public void setHost(String host) {
        this.host = host;
    }

    /**
     * @return the port
     */
    public int getPort() {
        return port;
    }

    /**
     * @param port the port to set
     */
    public void setPort(int port) {
        this.port = port;
    }

    /**
     * @return the ssl
     */
    public boolean isSsl() {
        return ssl;
    }

    /**
     * @param ssl the ssl to set
     */
    public void setSsl(boolean ssl) {
        this.ssl = ssl;
    }

    /**
     * @return the serverPasssword
     */
    public String getServerPassword() {
        return serverPassword;
    }

    /**
     * @param serverPasssword the serverPasssword to set
     */
    public void setServerPassword(String serverPassword) {
        this.serverPassword = serverPassword;
    }

    /**
     * @return the ident
     */
    public String getIdent() {
        return ident;
    }

    /**
     * @param ident the ident to set
     */
    public void setIdent(String ident) {
        this.ident = ident;
    }

    /**
     * @return the user
     */
    public String getUser() {
        return user;
    }

    /**
     * @param user the user to set
     */
    public void setUser(String user) {
        this.user = user;
    }

    /**
     * @return the password
     */
    public String getPassword() {
        return password;
    }

    /**
     * @param password the password to set
     */
    public void setPassword(String password) {
        this.password = password;
    }

    private String host;
    private int port;
    private boolean ssl;
    private String serverPassword;
    private String ident;
    private String user;
    private String password;
    private PrintWriter out;
    private BufferedReader in;
    private String loginChannels;
    private String hostname;
    private String ip;
    private String realname;
    private String mode;
    private String cgi;
    private long hmacTemporal;

    protected IrcParser(String host, int port, boolean ssl, String serverPassword, String ident, String user, String password, String mode, String cgi, String hmacTemporal) {
        try {
            setHmacTemporal(Long.parseLong(hmacTemporal));
            setMode(mode);
            setCgi(cgi);
            setHost(host);
            setPort(port);
            setSsl(ssl);
            setServerPassword(serverPassword);
            setIdent(ident);
            setUser(user);
            setPassword(password);
            setSocket(new Socket(host, port));
            setOut(new PrintWriter(new OutputStreamWriter(getSocket().getOutputStream())));
            setIn(new BufferedReader(new InputStreamReader(getSocket().getInputStream())));
        } catch (IOException ex) {
            Logger.getLogger(IrcParser.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    /**
     * Parsses a string to array
     *
     * @param text The text to parse
     * @return Array
     */
    protected String[] parseString(String text) {
        if (text.startsWith(":")) {
            text = text.substring(1);
        }
        if (text.contains("::")) {
            text = text.replace("::", "");
        }
        if (text.contains(" :")) {
            return text.split(" \\:", 2);
        }
        var arr = new String[2];
        arr[0] = text;
        arr[1] = "";
        return arr;
    }

    protected void parseCommands(String[] arr, String nick, Session session) {
        String[] code = null;
        if (arr[0].contains(" ")) {
            code = arr[0].split(" ");
            if (code.length == 2) {
                if (code[0].equalsIgnoreCase("notice") && code[1].equalsIgnoreCase("auth")) {
                    if (arr[1].equalsIgnoreCase("*** Got ident response") || arr[1].equalsIgnoreCase("*** No ident response")) {
                        if (getMode() == null) {
                            submitMessage("USER %s bleh bleh %s :%s", getIdent(), getIp(), getRealname());
                        } else if (getMode().equalsIgnoreCase("webirc")) {
                            submitMessage("WEBIRC %s %s %s %s", getPassword(), getUser(), getHostname(), getIp());
                            submitMessage("USER %s bleh %s :%s", getIdent(), getIp(), getRealname());
                        } else if (getMode().equalsIgnoreCase("cgiirc")) {
                            submitMessage("PASS %s_%s_%s", getCgi(), getIp(), getHostname());
                            submitMessage("USER %s bleh bleh %s :%s", getIdent(), getIp(), getRealname());
                        } else if (getMode().equalsIgnoreCase("hmac")) {
                            var hmac = new HmacUtils(HMAC_SHA_256, String.valueOf((System.currentTimeMillis() / 1000) / getHmacTemporal())).hmacHex("%s%s".formatted(ident, ip));
                            submitMessage("USER %s bleh bleh %s %s :%s", getIdent(), getIp(), hmac, getRealname());
                        } else if (getMode().equalsIgnoreCase(getHostname()) || getMode().isBlank()) {
                            String dispip = null;
                            if (getIp().equalsIgnoreCase(getHostname())) {
                                dispip = getIp();
                            } else {
                                dispip = "%s/%s".formatted(getHostname(), getIp());
                            }
                            submitMessage("USER %s bleh bleh :%s - %s", getIdent(), dispip, getRealname());
                        }
                        if (!getServerPassword().isBlank()) {
                            submitMessage("PASS :%s", getServerPassword());
                        }
                        submitMessage("NICK %s", nick);
                    }
                }
            }
        }
        sendText(arr[0] + " " + arr[1] + "\n", session, "chat", "");
    }

    protected void submitMessage(String text, Object... args) {
        try {
            text = text.formatted(args);
            var o = getOut();
            o.println(text);
            System.out.println(text);
            o.flush();
            Thread.sleep(100);
        } catch (Exception ex) {
            Logger.getLogger(IrcParser.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    protected String escapeHtml(String text) {
        text = text.replace("&", "&amp;");
        text = text.replace("<", "&lt;");
        text = text.replace(">", "&gt;");
        return text;
    }

    protected void logout(String reason) {
        submitMessage("QUIT :%s", reason);
        if (getSocket() != null) {
            try {
                getSocket().close();
            } catch (IOException ex) {
                Logger.getLogger(IrcParser.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }

    /**
     *
     * @param text
     * @param session
     * @param category
     * @param target
     */
    protected void sendText(String text, Session session, String category, String target) {
        var br = new BufferedReader(new StringReader(text));

        try {
            String tok = null;
            while ((tok = br.readLine()) != null) {
                if (tok.isEmpty()) {
                    continue;
                }
                session.getBasicRemote().sendText(Json.createObjectBuilder()
                        .add("category", category)
                        .add("target", target)
                        .add("message", escapeHtml(tok))
                        .build().toString());
            }
        } catch (IOException ioe) {
        }
    }

    /**
     * @return the socket
     */
    public Socket getSocket() {
        return socket;
    }

    /**
     * @param socket the socket to set
     */
    public void setSocket(Socket socket) {
        this.socket = socket;
    }

    private Socket socket;

    /**
     * @return the loginChannels
     */
    public String getLoginChannels() {
        return loginChannels;
    }

    /**
     * @param loginChannels the loginChannels to set
     */
    public void setLoginChannels(String loginChannels) {
        this.loginChannels = loginChannels;
    }
}
