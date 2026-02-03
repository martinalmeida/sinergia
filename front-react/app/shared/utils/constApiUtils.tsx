export const constApiUtils = (() => {
  const contentType = "application/json";
  const urlBase = `${import.meta.env.VITE_API_URL}/`;

  return {
    contentType,
    urlBase,
  };
})();