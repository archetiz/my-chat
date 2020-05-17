import { OutgoingPacket, InboxDto, IncomingPacket } from './chat';
import { EventProducer } from './eventProducer';

class Proxy extends EventProducer<ProxyEventMap>
{
    private ws: WebSocket;

    inbox: InboxDto | null = null;

    constructor()
    {
        super();
        
        // this.ws = new WebSocket("ws://echo.websocket.org/");
        this.ws = new WebSocket("wss://raja.aut.bme.hu/chat/");

        // this.ws.addEventListener("open", () =>
        // {
        //     const obj = JSON.stringify({ type: "login", email: "asd" });
        //     this.ws.send(obj);
        // });
        
        this.ws.addEventListener("message", e =>
        {
            const p = JSON.parse(e.data) as IncomingPacket;
            // console.log("Received: " + e.data);
            switch (p.type)
            {
                case "error":
                    alert(p.message);
                    break;
                case "login":
                    this.inbox = p.inbox;
                    this.dispatch("login");
                    break;
                case "message":
                    let cid = p.channelId;
                    this.inbox!.conversations.find(x => x.channelId === cid)?.lastMessages.push(p.message);
                    this.dispatch("message", cid, p.message);
                    break;
                case "conversationAdded":
                    this.inbox!.conversations.push(p.conversation);
                    this.dispatch("conversation", p.conversation.channelId);
                    break;
            }
        });
    }

    sendPacket(packet: OutgoingPacket)
    {
        // console.log("Sending: " + JSON.stringify(packet));
        this.ws.send(JSON.stringify(packet));
    }
}

export var proxy = new Proxy();