import { Route, Switch, useRouteMatch } from "react-router-dom";
import { ChosenProduct } from "./ChosenProduct";
import { Products } from "./Products";

export function ProductsPage() {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={`${path}/:productId`}>
        <ChosenProduct />
      </Route>
      <Route exact path={path}>
        <Products />
      </Route>
    </Switch>
  );
}
