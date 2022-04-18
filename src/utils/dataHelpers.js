exports.removeItems = (array, itemsToRemove, key) => {
  return array.filter((item) => {
    return !itemsToRemove.includes(item[key]);
  });
};
