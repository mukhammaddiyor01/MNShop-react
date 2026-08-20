import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import { Link } from "react-router-dom";
import { useGlobals } from "../../hooks/useGlobals";

export function MobileBottomNav() {
  const { authUser, setCartOpen } = useGlobals();

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
      {authUser ? (
        <>
          <Link to="/likes" className="mnshop-mobile-bottom-nav__item">
            <FavoriteBorderIcon aria-hidden="true" />
            Likes
          </Link>
          <button
            type="button"
            className="mnshop-mobile-bottom-nav__item"
            onClick={() => setCartOpen(true)}
          >
            <ShoppingBagOutlinedIcon aria-hidden="true" />
            Cart
          </button>
          <Link to="/user-page" className="mnshop-mobile-bottom-nav__item">
            <PersonOutlineIcon aria-hidden="true" />
            Profile
          </Link>
        </>
      ) : (
        <Link to="/login" className="mnshop-mobile-bottom-nav__item">
          <PersonOutlineIcon aria-hidden="true" />
          Sign In
        </Link>
      )}
    </nav>
  );
}
