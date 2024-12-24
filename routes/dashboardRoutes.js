const router = require("express").Router();
const { isAuthenticated } = require("../middlewares/authMiddleware");

router.get("/dashboard", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.redirect("/");
    }
    
    res.send(`<h1>Welcome ${req.user.name}</h1><p>Email: ${req.user.email}</p>${req}`);
  });

module.exports = router