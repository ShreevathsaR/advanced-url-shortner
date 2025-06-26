const passport = require("passport");
const router = require("express").Router();


/**
 * @swagger
 * /api/google:
 *   get:
 *     summary: Initiate Google OAuth login
 *     tags:
 *       - Authentication
 *     description: Redirects the user to Google's OAuth 2.0 login page for authentication.
 *     parameters:
 *       - name: scope
 *         in: query
 *         required: false
 *         description: Specifies the permissions your app is requesting. Defaults to ['profile', 'email'].
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *           example: ['profile', 'email']
 *     responses:
 *       302:
 *         description: Redirect to Google login page
 *         headers:
 *           Location:
 *             description: The URL to Google's OAuth login page
 *             schema:
 *               type: string
 *       500:
 *         description: Internal server error
 */
router.get(
  "/google",
  passport.authenticate("google", { scope: ['profile', 'email'] })
);


/**
 * @swagger
 * /google/callback:
 *   get:
 *     summary: Google OAuth callback handler
 *     description: Handles the callback from Google OAuth login. Authenticates the user and redirects based on success or failure.
 *     tags:
 *       - Authentication
 *     responses:
 *       "302":
 *         description: Redirects to the appropriate route based on authentication result.
 *         headers:
 *           Location:
 *             description: Redirect URL (e.g., /dashboard on success, /login on failure)
 *             schema:
 *               type: string
 *       "200":
 *         description: Sends a success message (only if no redirect occurs).
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Successfully logged in
 */
router.get("/google/callback", passport.authenticate("google", {
  successRedirect: "http://localhost:5173/dashboard",
  failureRedirect: "http://localhost:5173/login",
}),
  (req, res) => {
    res.send("Successfully logged in")
  }
);

/**
 * @swagger
 * /logout:
 *   get:
 *     summary: Logout the user
 *     description: Logs the user out of the session and redirects to the home page.
 *     tags:
 *       - Authentication
 *     responses:
 *       "302":
 *         description: Redirects to the home page after logout.
 *         headers:
 *           Location:
 *             description: Redirect URL (e.g., / for the home page)
 *             schema:
 *               type: string
 *       "500":
 *         description: Internal server error if logout fails.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Internal Server Error
 */
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.log(err);
      res.status(200).json({success: false, message:"User logging out failed"});
      return
    }
    res.status(200).json({success: true, message:"User logged out successfully"});
  })
})

router.get('/check', (req, res) => {

  const status = req.isAuthenticated()
  
  if(!status){
    return res.status(401).json({success: false, message: "User not authenticated", isAuthenticated: false})
  }
  const user = req.user
  return res.status(200).json({success: true, message: "User authenticated", isAuthenticated: true, user})
})


module.exports = router;

