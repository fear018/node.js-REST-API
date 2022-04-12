const path = require("path");
const { readJSONAsync, writeJSONAsync } = require("../services/jsonHelpers");

const dbJsonPath = path.resolve(process.cwd(), "src/services/db_users.json");

exports.fetchAllUsers = () => {
  return readJSONAsync(dbJsonPath);
};

exports.fetchUserById = async (id) => {
  const dbUsers = await readJSONAsync(dbJsonPath);

  return dbUsers.users.find((user) => user.id === id);
};

exports.addNewUser = async (data) => {
  const dbUsers = await readJSONAsync(dbJsonPath);

  dbUsers.users.push(data);
  await writeJSONAsync(dbJsonPath, dbUsers);
};

exports.update = async (dataOfNewUser) => {
  const dbUsers = await readJSONAsync(dbJsonPath);
  const foundUserIndex = dbUsers.users.findIndex(
    (user) => user.id === dataOfNewUser.id
  );

  if (foundUserIndex === -1) {
    return false;
  }

  dbUsers.users[foundUserIndex] = dataOfNewUser;
  await writeJSONAsync(dbJsonPath, dbUsers);

  return true;
};

exports.delete = async (id) => {
  const dbUsers = await readJSONAsync(dbJsonPath);
  let userBeenFound = false;

  const filteredUsers = dbUsers.users.filter((user) => {
    if (user.id !== id) {
      return true;
    }
    userBeenFound = true;
    return false;
  });

  if (userBeenFound) {
    await writeJSONAsync(dbJsonPath, { users: filteredUsers });
    return true;
  }

  return false;
};
