const path = require("path");
const { readJSONAsync, writeJSONAsync } = require("../utils/jsonHelpers");

const dbJsonPath = path.resolve(process.cwd(), "src/services/db_cats.json");

exports.fetchAllCats = () => {
  return readJSONAsync(dbJsonPath);
};

exports.fetchCatById = async (id) => {
  const dbCats = await readJSONAsync(dbJsonPath);

  return dbCats.cats.find((cat) => cat.id === id);
};

exports.addNewCat = async (data) => {
  const dbCats = await readJSONAsync(dbJsonPath);

  dbCats.cats.push(data);
  await writeJSONAsync(dbJsonPath, dbCats);
};

exports.update = async (dataOfNewCat) => {
  const dbCats = await readJSONAsync(dbJsonPath);
  const foundCatIndex = dbCats.cats.findIndex(
    (cat) => cat.id === dataOfNewCat.id
  );

  if (foundCatIndex === -1) {
    return false;
  }

  dbCats.cats[foundCatIndex] = dataOfNewCat;
  await writeJSONAsync(dbJsonPath, dbCats);

  return true;
};

exports.delete = async (id) => {
  const dbCats = await readJSONAsync(dbJsonPath);
  let catBeenFound = false;

  const filteredCats = dbCats.cats.filter((cat) => {
    if (cat.id !== id) {
      return true;
    }
    catBeenFound = true;
    return false;
  });

  if (catBeenFound) {
    await writeJSONAsync(dbJsonPath, { cats: filteredCats });
    return true;
  }

  return false;
};
