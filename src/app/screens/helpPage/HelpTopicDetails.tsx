import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { Link, Redirect, useParams } from "react-router-dom";
import { HelpContactActions } from "../../components/HelpContactActions";
import { findHelpTopic } from "./helpTopics";

type HelpTopicRouteParams = {
  topicSlug: string;
};

export function HelpTopicDetails() {
  const { topicSlug } = useParams<HelpTopicRouteParams>();
  const topic = findHelpTopic(topicSlug);

  if (!topic) {
    return <Redirect to="/help" />;
  }

  return (
    <main className="mnshop-help-topic-page">
      <section className="mnshop-help-topic-detail__hero">
        <div className="mnshop-help-container mnshop-help-topic-detail__hero-inner">
          <Link className="mnshop-help-topic-detail__back" to="/help">
            <ArrowBackOutlinedIcon aria-hidden="true" />
            Back to Help
          </Link>
          <p className="mnshop-help-eyebrow">MNShop care</p>
          <h1>{topic.title}</h1>
          <p className="mnshop-help-topic-detail__summary">{topic.summary}</p>
        </div>
      </section>

      <section className="mnshop-help-topic-detail__content">
        <div className="mnshop-help-container mnshop-help-topic-detail__sections">
          {topic.sections.map((section, index) => (
            <article key={section.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h2>{section.title}</h2>
              <p>{section.text}</p>
              {section.items && (
                <ul>
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="mnshop-help-topic-detail__contact">
        <div className="mnshop-help-container mnshop-help-topic-detail__contact-inner">
          <div>
            <p className="mnshop-help-eyebrow">Still need help?</p>
            <h2>Start a conversation</h2>
            <p>
              Sign in to keep your conversation history and receive replies
              inside MNShop.
            </p>
          </div>
          <HelpContactActions />
        </div>
      </section>
    </main>
  );
}
