import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import ReplayOutlinedIcon from "@mui/icons-material/ReplayOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import StraightenOutlinedIcon from "@mui/icons-material/StraightenOutlined";
import { ElementType } from "react";
import { Link, Route, Switch, useRouteMatch } from "react-router-dom";
import { HelpContactActions } from "../../components/HelpContactActions";
import { HelpTopicDetails } from "./HelpTopicDetails";
import { helpTopicDetails, HelpTopicSlug } from "./helpTopics";
import "../../../css/help.css";

const helpTopicIcons: Record<HelpTopicSlug, ElementType> = {
  delivery: LocalShippingOutlinedIcon,
  "size-guide": StraightenOutlinedIcon,
  returns: ReplayOutlinedIcon,
  "secure-payment": SecurityOutlinedIcon,
  "order-tracking": Inventory2OutlinedIcon,
  "product-questions": HelpOutlineIcon,
};

const questions = [
  {
    question: "How long does delivery take?",
    answer:
      "Estimated delivery dates appear during checkout and in each order's tracking details.",
  },
  {
    question: "Can I change an order?",
    answer:
      "Contact MN Support as soon as possible. Shipped orders can no longer be edited.",
  },
  {
    question: "How do I choose a seller?",
    answer:
      "Open a product first; its product page connects you with the seller responsible for that item.",
  },
  {
    question: "Where can I see my messages?",
    answer:
      "After signing in, open Chat from a product or use one of the contact buttons below.",
  },
];

export function HelpPage() {
  const { path, url } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}/:topicSlug`}>
        <HelpTopicDetails />
      </Route>
      <Route exact path={path}>
        <HelpOverview baseUrl={url} />
      </Route>
    </Switch>
  );
}

function HelpOverview({ baseUrl }: { baseUrl: string }) {
  return (
    <main className="mnshop-help-page">
      <section className="mnshop-help-hero">
        <div className="mnshop-help-container mnshop-help-hero__inner">
          <p className="mnshop-help-eyebrow">MNShop care</p>
          <h1>Help when you need it.</h1>
          <p className="mnshop-help-hero__description">
            Delivery, returns, sizing, payments, and direct conversations with
            our support team or sellers.
          </p>
        </div>
      </section>

      <section className="mnshop-help-topics">
        <div className="mnshop-help-container mnshop-help-topics__grid">
          {helpTopicDetails.map((topic) => {
            const Icon = helpTopicIcons[topic.slug];

            return (
              <Link
                className="mnshop-help-topic__link"
                key={topic.slug}
                to={`${baseUrl}/${topic.slug}`}
              >
                <article className="mnshop-help-topic">
                  <Icon aria-hidden="true" />
                  <h2>{topic.title}</h2>
                  <p>{topic.summary}</p>
                </article>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mnshop-help-support">
        <div className="mnshop-help-container mnshop-help-support__grid">
          <div className="mnshop-help-faq">
            <p className="mnshop-help-eyebrow">Quick answers</p>
            <div className="mnshop-help-faq__list">
              {questions.map(({ question, answer }) => (
                <details key={question}>
                  <summary>{question}</summary>
                  <p>{answer}</p>
                </details>
              ))}
            </div>
          </div>

          <div className="mnshop-help-contact">
            <p className="mnshop-help-eyebrow">Still need help?</p>
            <h2>Start a conversation</h2>
            <p className="mnshop-help-contact__description">
              Sign in to keep your conversation history and receive replies
              inside MNShop.
            </p>

            <HelpContactActions />
          </div>
        </div>
      </section>
    </main>
  );
}
