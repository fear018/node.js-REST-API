const url = require("url");
const { v4: uuid } = require("uuid");
const { errorsHandler } = require("../utils/errorsHandler");
const userModel = require("../models/user");
const catModel = require("../models/cat");
const { parseJsonBody } = require("../utils/jsonHelpers");
const { createPasswordHash } = require("../utils/encription");
const { encrypt } = require("../utils/syncEncription");
const { createCache } = require("../utils/cache");
const { HttpError } = require("../utils/curstom-errors");

const cache = createCache();

exports.getUsers = async (req, res) => {
  let users;
  const { pageNumber, pageSize } = url.parse(req.url, true).query;

  if (pageNumber && pageSize) {
    users = await userModel.fetchAllUsers(pageNumber, pageSize);
  } else {
    const data = await userModel.fetchAllUsers();
    users = data.users;
  }

  if (!users.length) {
    return errorsHandler(res);
  }

  return users;
};

exports.getUserById = async (res, userId) => {
  const user = await cache(userId, userModel.fetchUserById, res);

  if (!user) {
    return errorsHandler(res);
  }

  const catsDb = await catModel.fetchAllCats();
  const cats = catsDb.cats.filter((cat) => {
    if (cat.ownerId) {
      return cat.ownerId === user.id;
    }

    return false;
  });

  user.pets = cats;

  return user;
};

exports.createUser = async (req, res) => {
  const userData = await parseJsonBody(req);
  userData.id = uuid();

  if (!userData || !userData.login || !userData.password) {
    return errorsHandler(res, 400);
  }

  userData.password = await createPasswordHash(userData.password);

  const createUserResult = await userModel.addNewUser(userData);

  if (createUserResult) {
    return { userData };
  } else {
    return errorsHandler(res, 409);
  }
};

exports.loginUser = async (req, res) => {
  const userData = await parseJsonBody(req);
  if (!userData || !userData.login || !userData.password) {
    return errorsHandler(res, 400);
  }

  const user = await userModel.fetchUserByLogin(userData.login);
  if (!user) {
    return errorsHandler(res);
  }

  const currentPasswordHash = await createPasswordHash(userData.password);
  if (user.password !== currentPasswordHash) {
    return errorsHandler(res, 401);
  }

  const token = encrypt({ name: user.name, roles: user.roles });

  return { token };
};

exports.setUserRole = async (req, res) => {
  const userData = await parseJsonBody(req);
  if (!userData || !userData.login || !userData.role) {
    return errorsHandler(res, 400);
  }

  const user = await userModel.fetchUserByLogin(userData.login);

  if (!user) {
    return errorsHandler(res);
  }

  if (user.roles && !user.roles.includes(userData.role)) {
    user.roles.push(userData.role);
  } else {
    throw new HttpError("User has this role", 403);
  }

  const updateResult = await userModel.update(user);
  if (!updateResult) {
    return errorsHandler(res);
  }

  return user;
};

exports.updateUserById = async (req, res, userId) => {
  const updateData = await parseJsonBody(req);
  const user = await userModel.fetchUserById(userId);
  const updatedUser = { ...user, ...updateData };
  const updateResult = await userModel.update(updatedUser);

  if (!updateResult) {
    return errorsHandler(res);
  }

  return updatedUser;
};

exports.deleteUserById = async (res, userId) => {
  const updateResult = await userModel.delete(userId);

  if (!updateResult) {
    return errorsHandler(res);
  }

  return { id: userId };
};

exports.deleteUsersById = async (req, res) => {
  const { ids } = await parseJsonBody(req);
  const result = await userModel.deleteUsers(ids);

  if (!result) {
    return errorsHandler(res);
  }

  return { ids };
};
