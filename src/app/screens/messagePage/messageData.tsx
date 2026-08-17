export type MessageConversationTarget = "admin" | "seller";
export type MessageParticipantRole = "ADMIN" | "SELLER";
export type MessageAuthor = "buyer" | "participant";

export type BuyerMessage = {
  id: string;
  author: MessageAuthor;
  text: string;
  time: string;
};

export type BuyerConversation = {
  id: string;
  target: MessageConversationTarget;
  participantName: string;
  participantRole: MessageParticipantRole;
  subtitle: string;
  unread: number;
  isTyping: boolean;
  messages: BuyerMessage[];
};

export const buyerConversations: BuyerConversation[] = [
  {
    id: "mnshop-support",
    target: "admin",
    participantName: "MNShop Support",
    participantRole: "ADMIN",
    subtitle: "MNShop customer care",
    unread: 2,
    isTyping: false,
    messages: [
      {
        id: "support-1",
        author: "participant",
        text: "Assalomu alaykum. Welcome to MNShop Support. How can we help you today?",
        time: "09:15",
      },
      {
        id: "support-2",
        author: "buyer",
        text: "I need help checking the delivery status of my order.",
        time: "09:17",
      },
      {
        id: "support-3",
        author: "participant",
        text: "Please share your MNShop order number and we will check the latest tracking update.",
        time: "09:18",
      },
    ],
  },
  {
    id: "mnshop-seller",
    target: "seller",
    participantName: "MNShop Seller",
    participantRole: "SELLER",
    subtitle: "MNShop · verified seller",
    unread: 2,
    isTyping: true,
    messages: [
      {
        id: "seller-1",
        author: "participant",
        text: "Assalomu alaykum, how can I help with sizing?",
        time: "12:30",
      },
      {
        id: "seller-2",
        author: "buyer",
        text: "Is the hoodie oversized?",
        time: "12:31",
      },
      {
        id: "seller-3",
        author: "participant",
        text: "Yes, it has an oversized fit. Choose your usual size for the intended silhouette.",
        time: "12:32",
      },
    ],
  },
];
