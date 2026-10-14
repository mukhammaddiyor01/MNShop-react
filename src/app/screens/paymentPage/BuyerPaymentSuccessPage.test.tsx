import { act, render } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import { useGlobals } from "../../hooks/useGlobals";
import { BuyerPaymentSuccessPage } from "./BuyerPaymentSuccessPage";

jest.mock("../../hooks/useGlobals");
jest.mock("../../services/BuyerPaymentService", () => {
  const confirmPayment = jest.fn();
  return {
    __esModule: true,
    __confirmPayment: confirmPayment,
    default: jest.fn().mockImplementation(() => ({ confirmPayment })),
  };
});

const mockConfirmPayment = jest.requireMock(
  "../../services/BuyerPaymentService",
).__confirmPayment as jest.Mock;

test("finishes confirmation when the global context rerenders during the request", async () => {
  jest.useFakeTimers();
  let resolveConfirmation: (() => void) | undefined;
  mockConfirmPayment.mockReturnValue(
    new Promise<void>((resolve) => {
      resolveConfirmation = resolve;
    }),
  );

  const firstDeleteAll = jest.fn();
  const latestDeleteAll = jest.fn();
  const firstSetOrderBuilder = jest.fn();
  const latestSetOrderBuilder = jest.fn();
  const globals = {
    authUser: { id: "buyer-1" },
    onDeleteAll: firstDeleteAll,
    setOrderBuilder: firstSetOrderBuilder,
  };
  (useGlobals as jest.Mock).mockImplementation(() => globals);

  const history = createMemoryHistory({
    initialEntries: [
      "/payment/success?paymentKey=test-payment&orderId=MN_order&amount=39000",
    ],
  });
  const view = render(
    <Router history={history}>
      <BuyerPaymentSuccessPage />
    </Router>,
  );

  globals.onDeleteAll = latestDeleteAll;
  globals.setOrderBuilder = latestSetOrderBuilder;
  view.rerender(
    <Router history={history}>
      <BuyerPaymentSuccessPage />
    </Router>,
  );

  await act(async () => {
    resolveConfirmation?.();
    await Promise.resolve();
  });

  expect(
    view.getByText("Payment confirmed. Opening your orders…"),
  ).toBeInTheDocument();
  expect(latestDeleteAll).toHaveBeenCalledTimes(1);
  expect(latestSetOrderBuilder).toHaveBeenCalledTimes(1);
  expect(firstDeleteAll).not.toHaveBeenCalled();

  act(() => {
    jest.advanceTimersByTime(850);
  });
  expect(history.location.pathname).toBe("/orders");
  jest.useRealTimers();
});
