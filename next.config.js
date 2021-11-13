const removeImports = require("next-remove-imports")();
const { withSentryConfig } = require("@sentry/nextjs");

const moduleExports = removeImports({
  webpack5: true,
  reactStrictMode: true,
  outputFileTracing: false, // fix sentry error related to vercel & next.js upgrade to v12
  images: {
    domains: [
      "via.placeholder.com",
      "lh3.googleusercontent.com",
      "firebasestorage.googleapis.com",
    ],
  },
  webpack(config) {
    config.resolve.modules.push(__dirname);

    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };

    return config;
  },
});

const SentryWebpackPluginOptions = {
  silent: true,
};

module.exports = withSentryConfig(moduleExports, SentryWebpackPluginOptions);
