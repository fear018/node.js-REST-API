exports.errorsHandler = (res, status = 404) => {
  res.writeHead(status);
  return {
    error: {
      status,
      message:
        status === 400
          ? "Login and password - required"
          : status === 409
          ? "User already exist"
          : status === 401
          ? "Unauthorized"
          : "Not found",
    },
  };
};
