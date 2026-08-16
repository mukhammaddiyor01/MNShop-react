import { Box, Button, Container, Stack } from "@mui/material";
import React from "react";
import { NavLink } from "react-router-dom";

export function OtherNavbar() {
  const authMember = null;

  return (
    <div className="mnshop-other-navbar">
      <Container className="mnshop-other-navbar__container">
        <Stack className="mnshop-other-navbar__menu">
          {/* BRAND LOGO */}
          <Box className="mnshop-other-navbar__brand">
            <NavLink to="/">
              <img
                className="mnshop-other-navbar__brand-logo"
                src="/icons/mnshop.svg"
                alt="MNShop"
              />
            </NavLink>
          </Box>

          {/* NAVIGATION LINKS */}
          <Stack className="mnshop-other-navbar__links">
            <Box className="mnshop-other-navbar__link">
              <NavLink
                exact
                to="/"
                activeClassName="mnshop-other-navbar__link--active"
              >
                Home
              </NavLink>
            </Box>

            <Box className="mnshop-other-navbar__link">
              <NavLink
                to="/products"
                activeClassName="mnshop-other-navbar__link--active"
              >
                Products
              </NavLink>
            </Box>

            {authMember ? (
              <Box className="mnshop-other-navbar__link">
                <NavLink
                  to="/orders"
                  activeClassName="mnshop-other-navbar__link--active"
                >
                  Orders
                </NavLink>
              </Box>
            ) : null}

            {authMember ? (
              <Box className="mnshop-other-navbar__link">
                <NavLink
                  to="/member-page"
                  activeClassName="mnshop-other-navbar__link--active"
                >
                  My Page
                </NavLink>
              </Box>
            ) : null}

            <Box className="mnshop-other-navbar__link">
              <NavLink
                to="/help"
                activeClassName="mnshop-other-navbar__link--active"
              >
                Help
              </NavLink>
            </Box>

            {/* BASKET */}

            {!authMember ? (
              <Box className="mnshop-other-navbar__auth">
                <Button
                  variant="contained"
                  className="mnshop-other-navbar__login-button"
                >
                  Login
                </Button>
              </Box>
            ) : (
              <Box className="mnshop-other-navbar__member">
                <img
                  className="mnshop-other-navbar__user-avatar"
                  src="/icons/default-user.svg"
                  alt="MNShop member"
                  aria-haspopup="true"
                />
              </Box>
            )}
          </Stack>
        </Stack>
      </Container>
    </div>
  );
}
