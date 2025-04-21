const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User.model');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await User.findByPk(id);
    done(null, user);
});

// --- GitHub OAuth Strategy ---
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "/u/github/callback",
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const [user] = await User.findOrCreate({
            where: { provider: 'github', provider_id: profile.id },
            defaults: {
                name: profile.displayName || profile.username,
                email: profile.emails[0].value,
            }
        });
        done(null, user);
    } catch (err) {
        done(err, null);
    }
}));

// --- Google OAuth Strategy ---
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/u/google/callback",
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const [user] = await User.findOrCreate({
            where: { provider: 'google', provider_id: profile.id },
            defaults: {
                name: profile.displayName,
                email: profile.emails[0].value,
            }
        });
        done(null, user);
    } catch (err) {
        done(err, null);
    }
}));
