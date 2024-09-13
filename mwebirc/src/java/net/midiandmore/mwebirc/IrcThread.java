/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package net.midiandmore.mwebirc;

import jakarta.websocket.Session;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.lang.System.Logger;
import java.lang.System.Logger.Level;
import java.net.Socket;

/**
 *
 * @author windo
 */
public class IrcThread implements Runnable {

    /**
     * @return the thread
     */
    public Thread getThread() {
        return thread;
    }

    /**
     * @param thread the thread to set
     */
    public void setThread(Thread thread) {
        this.thread = thread;
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

    /**
     * @return the pw
     */
    public PrintWriter getPw() {
        return pw;
    }

    /**
     * @param pw the pw to set
     */
    public void setPw(PrintWriter pw) {
        this.pw = pw;
    }

    /**
     * @return the br
     */
    public BufferedReader getBr() {
        return br;
    }

    /**
     * @param br the br to set
     */
    public void setBr(BufferedReader br) {
        this.br = br;
    }

    /**
     * @return the runs
     */
    public boolean isRuns() {
        return runs;
    }

    /**
     * @param runs the runs to set
     */
    public void setRuns(boolean runs) {
        this.runs = runs;
    }

    private Thread thread;
    private Socket socket;
    private PrintWriter pw;
    private BufferedReader br;
    private boolean runs;
    private IrcParser parser;
    private Session session;
    private String nick;

    public IrcThread(IrcParser parser, String nick, Session session) {
        setParser(parser);
        setSession(session);
        setNick(nick);
        (thread = new Thread(this)).start();
    }

    @Override
    public void run() {
        setRuns(true);
        var p = getParser();
        try {
            p.sendText("NOTICE AUTH *** (mwebirc) Looking up your hostname...", getSession(), "chat", "");
            if (p.getIp().equalsIgnoreCase(p.getHostname())) {
                p.sendText("NOTICE AUTH *** (mwebirc) No hostname found.", getSession(), "chat", "");
            } else {
                p.sendText("NOTICE AUTH *** (mwebirc) Found your hostname.", getSession(), "chat", "");
            }
            String line = null;
            while ((line = getParser().getIn().readLine()) != null) {
                var arr = getParser().parseString(line);
                p.parseCommands(arr, getNick(), getSession());
              }
        } catch (IOException ex) {
            p.sendText("Connection to IRC server lost: %s".formatted(ex.getMessage()), getSession(), "chat", "");
        }
        if(getSession() != null && getSession().isOpen()) {
            try {
                getSession().close();
            } catch (IOException ex) {
            }
        }
    }

    /**
     * @return the parser
     */
    public IrcParser getParser() {
        return parser;
    }

    /**
     * @param parser the parser to set
     */
    public void setParser(IrcParser parser) {
        this.parser = parser;
    }

    /**
     * @return the session
     */
    public Session getSession() {
        return session;
    }

    /**
     * @param session the session to set
     */
    public void setSession(Session session) {
        this.session = session;
    }

    /**
     * @return the nick
     */
    public String getNick() {
        return nick;
    }

    /**
     * @param nick the nick to set
     */
    public void setNick(String nick) {
        this.nick = nick;
    }

}
