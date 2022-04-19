const router = require("find-my-way")();
const catController = require("../controllers/cat");
const userController = require("../controllers/user");
const { identification, checkAuth, checkRole } = require("../services/auth");
const { routerMiddleware } = require("../utils/middleware");

// cat
router.on("POST", "/cat", async (req, res) => {
  const result = await catController.createCat(req, res);

  res.end(JSON.stringify(result));
});

router.on(
  "GET",
  "/cat",
  identification(async (req, res) => {
    const result = await catController.getCats(res);

    res.end(JSON.stringify(result));
  })
);

router.on("GET", "/cat/:catId", async (req, res, params) => {
  const result = await catController.getCatById(res, params.catId);

  res.end(JSON.stringify(result));
});

router.on("PUT", "/cat/:catId", async (req, res, { catId }) => {
  const result = await catController.updateCatById(req, res, catId);

  res.end(JSON.stringify(result));
});

router.on("DELETE", "/cat/:catId", async (req, res, { catId }) => {
  const result = await catController.deleteCatById(res, catId);

  res.end(JSON.stringify(result));
});

// user
router.on("POST", "/user", async (req, res) => {
  const result = await userController.createUser(req, res);

  res.end(JSON.stringify(result));
});

router.on("POST", "/user/login", async (req, res) => {
  const result = await userController.loginUser(req, res);

  res.end(JSON.stringify(result));
});

router.on(
  "PUT",
  "/user/role",
  routerMiddleware([
    checkAuth,
    checkRole("ADMIN"),
    async (req, res) => {
      const result = await userController.setUserRole(req, res);
      res.end(JSON.stringify(result));
    },
  ])
);

router.on(
  "GET",
  "/user",
  routerMiddleware([
    checkAuth,
    checkRole("USER"),
    async (req, res) => {
      const result = await userController.getUsers(req, res);
      res.end(JSON.stringify(result));
    },
  ])
);

router.on("GET", "/user/:userId", async (req, res, params) => {
  const result = await userController.getUserById(res, params.userId);

  res.end(JSON.stringify(result));
});

router.on("PUT", "/user/:userId", async (req, res, { userId }) => {
  const result = await userController.updateUserById(req, res, userId);

  res.end(JSON.stringify(result));
});

router.on("DELETE", "/user/:userId", async (req, res, { userId }) => {
  const result = await userController.deleteUserById(res, userId);

  res.end(JSON.stringify(result));
});

router.on("DELETE", "/user", async (req, res) => {
  const result = await userController.deleteUsersById(req, res);

  res.end(JSON.stringify(result));
});

module.exports = router;
