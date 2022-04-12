exports.getNotFoundResponse = (res) => {
  res.writeHead(404);

  return {
    error: {
      message: "Not found",
      code: 404,
    },
  };
};
