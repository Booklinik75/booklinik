const removeImports = require("next-remove-imports")();

module.exports = removeImports({
  reactStrictMode: true,
  images: {
    domains: [
      "via.placeholder.com",
      "lh3.googleusercontent.com",
      "firebasestorage.googleapis.com",
    ],
  },
});
