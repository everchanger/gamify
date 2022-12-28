export default defineEventHandler(async (event) => {
  try {
    const { token } = parseCookies(event);
    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthenticated, no token",
      });
    }

    deleteCookie(event, "token");
    return { ok: true };
  } catch (error: any) {
    sendError(event, error);
  }
});
