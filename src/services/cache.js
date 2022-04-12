exports.createCache = () => {
  let cache = {};

  setInterval(() => {
    cache = {};
    console.log("Cache clear!");
  }, 60000);

  return async (key, cb, res) => {
    if (cache[key]) {
      res.setHeader("X-Cached-Key", key);
      return cache[key];
    }

    const data = await cb(key);
    cache[key] = data;

    return data;
  };
};
