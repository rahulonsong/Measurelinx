const express = require("express");
const passport = require("passport");

const router = express.Router();

// Determine the correct frontend URL dynamically
const FRONTEND_URL =
  process.env.NODE_ENV === "production"
    ? process.env.VUE_APP_BASE_URL
    : process.env.VUE_APP_BASE_URL_DEV;

/** * ✅ GOOGLE OAUTH ROUTES */
router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    if (!req.user || !req.user.token) {
      return res.status(401).json({ error: "Authentication failed" });
    }

    const token = req.user.token;
    const tokenExpiry = new Date(
      Date.now() +
        parseInt(process.env.JWT_EXPIRATION_DAYS) * 24 * 60 * 60 * 1000
    ); // 7 days

    // ✅ Set secure HTTP-only cookies
    res.cookie("papiloomToken", token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      path: "/",
      expires: tokenExpiry,
    });

    res.cookie("papiloomTokenExpiryTime", tokenExpiry.toISOString(), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      path: "/",
    });

    res.redirect(`${FRONTEND_URL}/auth-success`);
  }
);

/** ✅ FACEBOOK OAUTH ROUTES */
router.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", { session: false }),
  (req, res) => {
    if (!req.user || !req.user.token) {
      return res.status(401).json({ error: "Authentication failed" });
    }

    const token = req.user.token;
    const tokenExpiry = new Date(
      Date.now() +
        parseInt(process.env.JWT_EXPIRATION_DAYS) * 24 * 60 * 60 * 1000
    ); // 7 days

    // ✅ Set secure HTTP-only cookies
    res.cookie("papiloomToken", token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      path: "/",
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.cookie("papiloomTokenExpiryTime", tokenExpiry.toISOString(), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      path: "/",
    });

    res.redirect(`${FRONTEND_URL}/auth-success`);
  }
);

/*** ✅ LOGOUT ROUTE */
router.get("/logout", (req, res) => {
  res.clearCookie("papiloomToken", {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    path: "/",
  });

  res.clearCookie("papiloomTokenExpiryTime", {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    path: "/",
  });

  res.status(200).json({ success: true, message: "Logged out successfully" });
});

module.exports = router;
