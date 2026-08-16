import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import { Link, useHistory } from "react-router-dom";
import { useGlobals } from "../../hooks/useGlobals";

export function MobileBottomNav() {
  const history = useHistory();
  const { authMember, setCartOpen } = useGlobals();

  const guard = (action: () => void) => {
    if (!authMember) {
      history.push(
        `/login?next=${encodeURIComponent(
          `${window.location.pathname}${window.location.search}`,
        )}`,
      );
      return;
    }

    action();
  };

  return (
    <nav
      className="mnshop-mobile-bottom-nav"
      aria-label="Mobile buyer navigation"
    >
      <Link to="/" className="mnshop-mobile-bottom-nav__item">
        <HomeOutlinedIcon aria-hidden="true" />
        Home
      </Link>
      <Link to="/products" className="mnshop-mobile-bottom-nav__item">
        <SearchIcon aria-hidden="true" />
        Products
      </Link>
      <button
        type="button"
        className="mnshop-mobile-bottom-nav__item"
        onClick={() => guard(() => history.push("/likes"))}
      >
        <FavoriteBorderIcon aria-hidden="true" />
        Likes
      </button>
      <button
        type="button"
        className="mnshop-mobile-bottom-nav__item"
        onClick={() => guard(() => setCartOpen(true))}
      >
        <ShoppingBagOutlinedIcon aria-hidden="true" />
        Cart
      </button>
      <button
        type="button"
        className="mnshop-mobile-bottom-nav__item"
        onClick={() =>
          history.push(
            authMember ? "/orders" : "/login?next=%2Forders",
          )
        }
      >
        <PersonOutlineIcon aria-hidden="true" />
        Profile
      </button>
    </nav>
  );
}
