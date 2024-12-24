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
  (req,res)=>{
    res.send("Successfully logged in")
  }
);

module.exports = router;