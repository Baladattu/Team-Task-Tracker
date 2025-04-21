const express = require('express');
const passport = require('passport');
const router = express.Router();


/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication routes using GitHub and Google
 */

// --- GitHub Routes ---

/**
 * @swagger
 * /u/github:
 *   get:
 *     summary: GitHub OAuth login
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirects to GitHub for authentication
 */
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

/**
 * @swagger
 * /u/github/callback:
 *   get:
 *     summary: GitHub OAuth callback
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirects to the dashboard on success or login on failure
 */
router.get('/github/callback',
    passport.authenticate('github', {
        failureRedirect: '/login',
        successRedirect: '/dashboard', // or redirect to dashboard
    })
);

// --- Google Routes ---

/**
 * @swagger
 * /u/google:
 *   get:
 *     summary: Google OAuth login
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirects to Google for authentication
 */

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

/**
 * @swagger
 * /u/google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirects to the dashboard on success or login on failure
 */

router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/login',
        successRedirect: 'http://localhost:5173/dashboard',
    })
);

/**
 * @swagger
 * /u/whoami:
 *   get:
 *     summary: Get current authenticated user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Authenticated user data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *       401:
 *         description: Not logged in
 */
router.get('/whoami', (req, res) => {
    if (req.isAuthenticated()) {
        res.json(req.user);
    } else {
        res.status(401).json({ error: 'Not logged in' });
    }
});

// --- Logout ---
/**
 * @swagger
 * /u/logout:
 *   get:
 *     summary: Log out the current user
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirects to home after logout
 */
router.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/');
    });
});

module.exports = router;
