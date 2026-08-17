export type HelpTopicSlug =
  | "delivery"
  | "size-guide"
  | "returns"
  | "secure-payment"
  | "order-tracking"
  | "product-questions";

export type HelpTopicSection = {
  title: string;
  text: string;
  items?: string[];
};

export type HelpTopicDetails = {
  slug: HelpTopicSlug;
  title: string;
  summary: string;
  sections: HelpTopicSection[];
};

export const helpTopicDetails: HelpTopicDetails[] = [
  {
    slug: "delivery",
    title: "Delivery",
    summary:
      "Orders are prepared in South Korea and delivered to Uzbekistan with tracking updates.",
    sections: [
      {
        title: "From South Korea to Uzbekistan",
        text: "Each order is prepared by its seller in South Korea before it enters the international delivery route to Uzbekistan.",
        items: [
          "The delivery address is confirmed during checkout.",
          "Available delivery options and estimated dates are shown before payment.",
          "Tracking updates become available as the order moves through each stage.",
        ],
      },
      {
        title: "Delivery timing",
        text: "The current estimate appears during checkout and in the order tracking details. Timing can vary by seller preparation, international transit, customs, and the final destination.",
      },
      {
        title: "Before placing an order",
        text: "Check that the recipient name, phone number, city, and full address are correct. Contact MN Support as soon as possible if any delivery detail needs to be corrected.",
      },
    ],
  },
  {
    slug: "size-guide",
    title: "Size guide",
    summary:
      "Check the product size selector before ordering. Our oversized items are clearly marked.",
    sections: [
      {
        title: "Choose the right fit",
        text: "Use the sizes and fit notes shown on the product page. Products designed with an oversized silhouette are clearly identified.",
        items: [
          "Compare the available size with an item you already own.",
          "Review the product description for regular, relaxed, or oversized fit notes.",
          "Check stock before adding the selected size to your cart.",
        ],
      },
      {
        title: "How to measure",
        text: "Measure the chest width, body length, and sleeve length of a similar garment on a flat surface, then compare those measurements with the product information.",
      },
      {
        title: "Ask before ordering",
        text: "If the fit is unclear, open the product and message its seller with the product name, your preferred fit, and the size you usually wear.",
      },
    ],
  },
  {
    slug: "returns",
    title: "Returns",
    summary:
      "Contact support within 7 days of delivery if an item arrives damaged or incorrect.",
    sections: [
      {
        title: "When to contact support",
        text: "Start a support conversation within 7 days of delivery when an item is damaged, incorrect, or does not match the confirmed order.",
      },
      {
        title: "Information to prepare",
        text: "Keep the item and its packaging while the request is reviewed.",
        items: [
          "Your MNShop order number.",
          "A clear description of the issue.",
          "Photos of the item, packaging, and any visible damage or incorrect detail.",
        ],
      },
      {
        title: "Review and resolution",
        text: "MN Support reviews the order details with the responsible seller and provides the available return, replacement, or other resolution instructions inside your conversation.",
      },
    ],
  },
  {
    slug: "secure-payment",
    title: "Secure payment",
    summary:
      "Pay by card, Payme, or Click. Payment information is handled securely.",
    sections: [
      {
        title: "Available methods",
        text: "Select an available payment method during checkout. MNShop supports card, Payme, and Click where those options are shown.",
      },
      {
        title: "Before confirming payment",
        text: "Review the products, quantities, delivery information, and final total before placing the order.",
        items: [
          "Do not share verification codes or payment credentials in chat.",
          "Complete payment only through the MNShop checkout flow.",
          "Keep the order confirmation for your records.",
        ],
      },
      {
        title: "Payment status",
        text: "After a successful payment, the order appears in My Orders. If payment is interrupted or the status is unclear, check the order first and then contact MN Support.",
      },
    ],
  },
  {
    slug: "order-tracking",
    title: "Order tracking",
    summary:
      "Open My Orders from your profile to follow preparation, shipping, and delivery.",
    sections: [
      {
        title: "Where to track",
        text: "Sign in and open My Orders from your profile. Select an order to review its current progress and available delivery information.",
      },
      {
        title: "Tracking stages",
        text: "The timeline shows the order as it moves from seller preparation to final delivery.",
        items: [
          "Preparation — the seller is confirming and packing the products.",
          "Shipping — the order has entered the delivery route.",
          "Delivery — the order is moving toward or has reached its destination.",
        ],
      },
      {
        title: "When an update is delayed",
        text: "International tracking can pause between scan points. If the estimate has passed or the delivery information looks incorrect, contact MN Support with the order number.",
      },
    ],
  },
  {
    slug: "product-questions",
    title: "Product questions",
    summary:
      "A seller can help with fit, colors, stock, materials, and product-specific details.",
    sections: [
      {
        title: "Talk to the responsible seller",
        text: "Open the product page and start a seller conversation. The seller connected to that product can provide product-specific information.",
      },
      {
        title: "What you can ask",
        text: "Include the product name and the exact option you are considering so the seller can answer clearly.",
        items: [
          "Fit, sizing, and oversized details.",
          "Available colors and current stock.",
          "Materials, care, and product construction.",
          "Differences between product options.",
        ],
      },
      {
        title: "Order and payment help",
        text: "For account, payment, delivery, return, or order-status questions, contact MN Support instead of a seller.",
      },
    ],
  },
];

export function findHelpTopic(slug?: string) {
  return helpTopicDetails.find((topic) => topic.slug === slug);
}
