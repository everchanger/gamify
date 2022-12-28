// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ["~/assets/css/main.css"],
  nitro: {
    preset: "netlify-edge",
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  runtimeConfig: {
    MONGODB_URI: process.env.MONGODB_URI,
    MONGODB_DATABASE: process.env.MONGODB_DATABASE,
    PASSWORD_ROUNDS: parseInt(process.env.PASSWORD_ROUNDS || "10"),
    JWT_SECRET: process.env.JWT_SECRET,
  },
});
