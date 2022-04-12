const { v4: uuid } = require("uuid");
const { getNotFoundResponse } = require("../services/errorsHandler");
const userModel = require("../models/user");
const catModel = require("../models/cat");
const { parseJsonBody } = require("../services/jsonHelpers");
const { createCache } = require("../services/cache");

const cache = createCache();

exports.getUsers = async (res) => {
  const { users } = await userModel.fetchAllUsers();

  if (!users.length) {
    return getNotFoundResponse(res);
  }

  return users;
};

exports.getUserById = async (res, userId) => {
  const user = await cache(userId, userModel.fetchUserById, res);

  if (!user) {
    return getNotFoundResponse(res);
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

exports.createUser = async (req) => {
  const userData = await parseJsonBody(req);
  userData.id = uuid();

  await userModel.addNewUser(userData);

  return { userData };
};

exports.updateUserById = async (req, res, userId) => {
  const updateData = await parseJsonBody(req);
  const user = await userModel.fetchUserById(userId);
  const updatedUser = { ...user, ...updateData };
  const updateResult = await userModel.update(updatedUser);

  if (!updateResult) {
    return getNotFoundResponse(res);
  }

  return updatedUser;
};

exports.deleteUserById = async (res, userId) => {
  const updateResult = await userModel.delete(userId);

  if (!updateResult) {
    return getNotFoundResponse(res);
  }

  return { id: userId };
};
