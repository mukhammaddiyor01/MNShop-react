import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import HeadsetMicOutlinedIcon from "@mui/icons-material/HeadsetMicOutlined";
import { useHistory } from "react-router-dom";
import { useGlobals } from "../hooks/useGlobals";

export function HelpContactActions() {
  const { authUser } = useGlobals();
  const history = useHistory();

  const openConversation = (target: "admin" | "seller") => {
    const destination = `/chat?target=${target}`;

    if (!authUser) {
      history.push(`/login?next=${encodeURIComponent(destination)}`);
      return;
    }

    history.push(destination);
  };

  return (
    <div className="mnshop-help-contact__actions">
      <button type="button" onClick={() => openConversation("admin")}>
        <HeadsetMicOutlinedIcon aria-hidden="true" />
        <span>
          <strong>Contact MNShop</strong>
          <small>Write directly to an admin</small>
        </span>
      </button>

      <button type="button" onClick={() => openConversation("seller")}>
        <ForumOutlinedIcon aria-hidden="true" />
        <span>
          <strong>Message a Seller</strong>
          <small>Ask about size, stock, or product</small>
        </span>
      </button>
    </div>
  );
}
