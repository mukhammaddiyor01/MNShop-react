import { useParams } from "react-router-dom";

type ChosenProductParams = {
  productId: string;
};

export function ChosenProduct() {
  const { productId } = useParams<ChosenProductParams>();

  return (
    <main
      className="mnshop-chosen-product"
      data-product-id={productId}
    />
  );
}
