import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import { Link, Redirect, useLocation } from "react-router-dom";
import { useGlobals } from "../../hooks/useGlobals";
import {
  buyerConversations,
  MessageConversationTarget,
} from "./messageData";
import "../../../css/message.scss";

function isConversationTarget(
  target: string | null,
): target is MessageConversationTarget {
  return target === "admin" || target === "seller";
}

export function BuyerMessagePage() {
  const { authUser } = useGlobals();
  const location = useLocation();
  const queryTarget = new URLSearchParams(location.search).get("target");
  const activeTarget: MessageConversationTarget = isConversationTarget(
    queryTarget,
  )
    ? queryTarget
    : "seller";
  const activeConversation =
    buyerConversations.find(
      (conversation) => conversation.target === activeTarget,
    ) || buyerConversations[0];

  if (!authUser) {
    const destination = `/chat${location.search}`;
    return (
      <Redirect to={`/login?next=${encodeURIComponent(destination)}`} />
    );
  }

  if (authUser.role !== "BUYER") {
    return <Redirect to="/" />;
  }

  return (
    <main className="mnshop-message-page">
      <section className="mnshop-message-container">
        <h1>Messages</h1>

        <div className="mnshop-message-panel">
          <aside className="mnshop-message-conversations">
            {buyerConversations.map((conversation) => (
              <Link
                className={
                  conversation.id === activeConversation.id
                    ? "mnshop-message-conversation is-active"
                    : "mnshop-message-conversation"
                }
                key={conversation.id}
                to={`/chat?target=${conversation.target}`}
              >
                <span>
                  <strong>{conversation.participantName}</strong>
                  <small>{conversation.participantRole}</small>
                </span>
                {conversation.unread > 0 && (
                  <b aria-label={`${conversation.unread} unread messages`}>
                    {conversation.unread}
                  </b>
                )}
              </Link>
            ))}
          </aside>

          <div className="mnshop-message-thread">
            <header>
              <p>{activeConversation.participantName}</p>
              <small>{activeConversation.subtitle}</small>
            </header>

            <div className="mnshop-message-thread__messages">
              {activeConversation.messages.map((message) => (
                <div
                  className={
                    message.author === "buyer"
                      ? "mnshop-message-bubble is-buyer"
                      : "mnshop-message-bubble is-participant"
                  }
                  key={message.id}
                >
                  <div>
                    <p>{message.text}</p>
                    <time>{message.time}</time>
                  </div>
                </div>
              ))}

              {activeConversation.isTyping && (
                <p className="mnshop-message-typing">
                  {activeConversation.participantName} is typing...
                </p>
              )}
            </div>

            <div className="mnshop-message-composer">
              <button type="button" aria-label="Attach an image" disabled>
                <ImageOutlinedIcon aria-hidden="true" />
              </button>
              <input
                aria-label="Write a message"
                placeholder="Write a message"
                readOnly
              />
              <button type="button" aria-label="Send message" disabled>
                <SendOutlinedIcon aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
