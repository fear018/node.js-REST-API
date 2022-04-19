const path = require("path");
const catModel = require("../models/cat");
const { readJSONAsync, writeJSONAsync } = require("../utils/jsonHelpers");
const { removeItems } = require("../utils/dataHelpers");

const dbUsersJsonPath = path.resolve(
  process.cwd(),
  "src/services/db_users.json"
);
const dbCatsJsonPath = path.resolve(process.cwd(), "src/services/db_cats.json");

exports.fetchAllUsers = async (pageNumber, pageSize) => {
  if (pageNumber && pageSize) {
    const { users } = await readJSONAsync(dbUsersJsonPath);
    const firstPaginationIndex = pageNumber * pageSize - pageSize;
    const lastPaginationIndex = pageNumber * pageSize;

    const paginatedUsers = users.filter(
      (user, index) =>
        index >= firstPaginationIndex && index < lastPaginationIndex
    );

    return paginatedUsers;
  } else {
    return await readJSONAsync(dbUsersJsonPath);
  }
};

exports.fetchUserByLogin = async (login) => {
  const dbUsers = await readJSONAsync(dbUsersJsonPath);

  return dbUsers.users.find((user) => user.login === login);
};

exports.fetchUserById = async (id) => {
  const dbUsers = await readJSONAsync(dbUsersJsonPath);

  return dbUsers.users.find((user) => user.id === id);
};

exports.addNewUser = async (user) => {
  const dbUsers = await readJSONAsync(dbUsersJsonPath);

  const foundUser = dbUsers.users.find(
    (existingUser) => user.login === existingUser?.login
  );
  if (foundUser) {
    return false;
  }

  dbUsers.users.push(user);
  await writeJSONAsync(dbUsersJsonPath, dbUsers);

  return true;
};

exports.update = async (dataOfNewUser) => {
  const dbUsers = await readJSONAsync(dbUsersJsonPath);
  const foundUserIndex = dbUsers.users.findIndex(
    (user) => user.id === dataOfNewUser.id
  );

  if (foundUserIndex === -1) {
    return false;
  }

  dbUsers.users[foundUserIndex] = dataOfNewUser;
  await writeJSONAsync(dbUsersJsonPath, dbUsers);

  return true;
};

exports.delete = async (id) => {
  const dbUsers = await readJSONAsync(dbUsersJsonPath);
  let userBeenFound = false;

  const filteredUsers = dbUsers.users.filter((user) => {
    if (user.id !== id) {
      return true;
    }
    userBeenFound = true;
    return false;
  });

  if (userBeenFound) {
    await writeJSONAsync(dbUsersJsonPath, { users: filteredUsers });
    return true;
  }

  return false;
};

exports.deleteUsers = async (ids) => {
  const dbUsers = await readJSONAsync(dbUsersJsonPath);
  const dbCats = await catModel.fetchAllCats();
  const filteredUsers = removeItems(dbUsers.users, ids, "id");

  dbCats.cats.forEach((cat) => {
    ids.forEach((id) => {
      if (cat.ownerId && cat.ownerId === id) {
        cat.ownerId = null;
      }
    });
  });

  await writeJSONAsync(dbUsersJsonPath, { users: filteredUsers });
  await writeJSONAsync(dbCatsJsonPath, { cats: dbCats.cats });

  return true;
};
