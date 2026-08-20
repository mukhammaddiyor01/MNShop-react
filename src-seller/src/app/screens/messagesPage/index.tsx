import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { FormEvent, useMemo, useState } from "react";
import "../../../css/messages.css";

type Conversation = {
  id: string;
  name: string;
  initials: string;
  topic: string;
  time: string;
  unread?: boolean;
  messages: Array<{ from: "buyer" | "seller"; text: string; time: string }>;
};

const conversations: Conversation[] = [
  { id: "order", name: "Mina K.", initials: "MK", topic: "Question about my order", time: "10:24", unread: true, messages: [{ from: "buyer", text: "Hi! When will my order be prepared for delivery?", time: "10:24" }, { from: "seller", text: "Hello Mina, your order is being prepared today. We will add tracking as soon as it leaves our studio.", time: "10:31" }] },
  { id: "size", name: "Daniel H.", initials: "DH", topic: "Sizing advice", time: "Yesterday", messages: [{ from: "buyer", text: "Could you help me choose a size?", time: "Yesterday" }, { from: "seller", text: "Of course — please share your usual size and the item you are looking at.", time: "Yesterday" }] },
  { id: "stock", name: "Sora A.", initials: "SA", topic: "Restock request", time: "Mon", messages: [{ from: "buyer", text: "Will the blue color be restocked soon?", time: "Mon" }, { from: "seller", text: "Thanks for asking. We are planning the next restock and will update the product page first.", time: "Mon" }] },
];

export function MessagesPage() {
  const [selectedId, setSelectedId] = useState(conversations[0].id);
  const [draft, setDraft] = useState("");
  const [replies, setReplies] = useState<Record<string, Conversation["messages"]>>({});
  const selected = useMemo(() => conversations.find((item) => item.id === selectedId) || conversations[0], [selectedId]);
  const thread = [...selected.messages, ...(replies[selected.id] || [])];

  const send = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setReplies((current) => ({ ...current, [selected.id]: [...(current[selected.id] || []), { from: "seller", text, time: "Now" }] }));
    setDraft("");
  };

  return <main className="mnshop-seller-messages"><header><span>Buyer inbox</span><h2>Messages</h2><p>Reply to buyer questions from one focused workspace.</p></header><section className="mnshop-seller-messages__workspace"><aside aria-label="Conversations"><div className="mnshop-seller-messages__inbox-head"><strong>Inbox</strong><span>{conversations.length}</span></div>{conversations.map((conversation) => <button type="button" key={conversation.id} onClick={() => setSelectedId(conversation.id)} className={conversation.id === selected.id ? "is-active" : ""}><i aria-hidden="true">{conversation.initials}</i><span><strong>{conversation.name}</strong><small>{conversation.topic}</small></span><em>{conversation.unread ? "New" : conversation.time}</em></button>)}</aside><article><header><div><i aria-hidden="true">{selected.initials}</i><span><strong>{selected.name}</strong><small>Buyer conversation</small></span></div><p>{selected.topic}</p></header><div className="mnshop-seller-messages__thread">{thread.map((message, index) => <div className={`mnshop-seller-messages__bubble is-${message.from}`} key={`${message.time}-${index}`}><p>{message.text}</p><time>{message.time}</time></div>)}</div><form onSubmit={send}><input aria-label="Write a reply" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Write a reply…" /><button type="submit" aria-label="Send reply"><SendRoundedIcon fontSize="small" /></button></form></article></section><p className="mnshop-seller-messages__note">Messages are currently prepared as a local seller inbox preview.</p></main>;
}
