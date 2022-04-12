const { v4: uuid } = require("uuid");
const { getNotFoundResponse } = require("../services/errorsHandler");
const catModel = require("../models/cat");
const userModel = require("../models/user");
const { parseJsonBody } = require("../services/jsonHelpers");
const { createCache } = require("../services/cache");

const cache = createCache();

exports.getCats = async (res) => {
  const { cats } = await catModel.fetchAllCats();

  if (!cats.length) {
    return getNotFoundResponse(res);
  }

  return cats;
};

exports.getCatById = async (res, catId) => {
  const cat = await cache(catId, catModel.fetchCatById, res);

  if (!cat) {
    return getNotFoundResponse(res);
  }

  return cat;
};

exports.createCat = async (req, res) => {
  const catData = await parseJsonBody(req);

  if (catData.ownerId) {
    const usersDb = await userModel.fetchAllUsers();
    const userIndex = usersDb.users.findIndex(
      (user) => user.id === catData.ownerId
    );

    if (userIndex === -1) {
      return getNotFoundResponse(res);
    }
  }

  catData.id = uuid();
  await catModel.addNewCat(catData);

  return { catData };
};

exports.updateCatById = async (req, res, catId) => {
  const updateData = await parseJsonBody(req);

  if (updateData.ownerId) {
    const usersDb = await userModel.fetchAllUsers();
    const userIndex = usersDb.users.findIndex(
      (user) => user.id === updateData.ownerId
    );

    if (userIndex === -1) {
      return getNotFoundResponse(res);
    }
  }

  const cat = await catModel.fetchCatById(catId);
  const updatedCat = { ...cat, ...updateData };
  const updateResult = await catModel.update(updatedCat);

  if (!updateResult) {
    return getNotFoundResponse(res);
  }

  return updatedCat;
};

exports.deleteCatById = async (res, catId) => {
  const updateResult = await catModel.delete(catId);

  if (!updateResult) {
    return getNotFoundResponse(res);
  }

  return { id: catId };
};
