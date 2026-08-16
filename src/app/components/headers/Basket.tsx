import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import { Badge, IconButton } from "@mui/material";

export type BasketProps = {
  itemCount: number;
  onOpen: () => void;
};

export function Basket({ itemCount, onOpen }: BasketProps) {
  const safeItemCount = Math.max(0, itemCount);
  const itemLabel = safeItemCount === 1 ? "item" : "items";

  return (
    <IconButton
      type="button"
      className="mnshop-basket-trigger"
      aria-label={`Open cart, ${safeItemCount} ${itemLabel}`}
      aria-haspopup="dialog"
      onClick={onOpen}
    >
      <Badge
        className="mnshop-basket-trigger__badge"
        badgeContent={safeItemCount}
        color="primary"
        invisible={safeItemCount === 0}
      >
        <ShoppingBagIcon aria-hidden="true" />
      </Badge>
    </IconButton>
  );
}
