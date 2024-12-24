const passport = require("passport");
const router = require("express").Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ['profile', 'email'] })
);

router.get("/google/callback", passport.authenticate("google", {
  successRedirect: "/dashboard",
  failureRedirect: "/login",
}),
  (req, res) => {
    res.send("Successfully logged in")
  }
);

router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.log(err);
    }
    res.redirect('/');
  })
})

module.exports = router;
