exports.routerMiddleware =
  (callbacks) =>
  async (...args) => {
    const [_, res] = args;
    if (Array.isArray(callbacks)) {
      for await (const cb of callbacks) {
        try {
          await cb(...args);
        } catch (err) {
          res.writeHead(403);
          return res.end(
            JSON.stringify({
              error: {
                status: err.code || 500,
                message: err.message || "Internal server error.",
              },
            })
          );
        }
      }
    } else {
      try {
        await cb(...args);
      } catch (err) {
        res.writeHead(403);
        return res.end(
          JSON.stringify({
            error: {
              status: err.code || 500,
              message: err.message || "Internal server error.",
            },
          })
        );
      }
    }
  };
