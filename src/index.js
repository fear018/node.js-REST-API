const { createServer } = require("http");
const router = require("./services/router");

const port = 3000;
const host = "127.0.0.1";

const server = createServer((req, res) => {
  router.lookup(req, res);
});

server.listen(port, host, (err) => {
  if (err) {
    console.error(err);
  }
});
