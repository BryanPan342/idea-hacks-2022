// next.config.js

module.exports = {
  // Configure target to be serverless to allow netlify deploy
  target: 'serverless',

  // Environment Variables
  env: {
    env: process.env.NODE_ENV,
  },
};
