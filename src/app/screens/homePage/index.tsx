import axios from "axios";
import { useEffect } from "react";
import "../../../css/home.css";
import "../../../css/mobile.css";
import "../../../css/products.css";
import { useAppDispatch, useAppSelector } from "../../hooks";
import BuyerProductService from "../../services/BuyerProductService";
import { BestSellers } from "./BestSellers";
import { Hero } from "./Hero";
import { ProductSections } from "./ProductSections";
import {
  retrieveHomeProducts,
  retrieveHomeProductsError,
  retrieveHomeProductsLoading,
} from "./selector";
import {
  setHomeProducts,
  setHomeProductsError,
  setHomeProductsLoading,
} from "./slice";
import { TrustSection } from "./TrustSection";

const buyerProductService = new BuyerProductService();

export function HomePage() {
  const dispatch = useAppDispatch();
  const products = useAppSelector(retrieveHomeProducts);
  const isLoading = useAppSelector(retrieveHomeProductsLoading);
  const loadError = useAppSelector(retrieveHomeProductsError);

  useEffect(() => {
    let isActive = true;

    dispatch(setHomeProductsLoading(true));
    dispatch(setHomeProductsError(""));

    buyerProductService
      .getProducts()
      .then((nextProducts) => {
        if (!isActive) return;
        dispatch(setHomeProducts(nextProducts));
      })
      .catch((error) => {
        if (!isActive) return;

        const responseData = axios.isAxiosError(error)
          ? (error.response?.data as { message?: string } | undefined)
          : undefined;

        dispatch(
          setHomeProductsError(
            responseData?.message || "We could not load the products.",
          ),
        );
      })
      .finally(() => {
        if (isActive) dispatch(setHomeProductsLoading(false));
      });

    return () => {
      isActive = false;
    };
  }, [dispatch]);

  const productsState = loadError
    ? "error"
    : isLoading
      ? "loading"
      : products.length
        ? "loaded"
        : "empty";

  return (
    <main
      className="mnshop-homepage"
      data-products-count={products.length}
      data-products-state={productsState}
    >
      <Hero />
      <BestSellers />
      <ProductSections />
      <TrustSection />
    </main>
  );
}
