const { createReadStream, writeFile } = require("fs");

exports.readJSONAsync = (path) =>
  new Promise((resolve) => {
    const readStream = createReadStream(path);
    let result = "";

    readStream
      .on("data", (chunk) => {
        result += chunk.toString();
      })
      .on("end", () => {
        if (!result) {
          resolve([]);
        } else {
          resolve(JSON.parse(result));
        }
      });
  });

exports.writeJSONAsync = (path, data) =>
  new Promise((resolve, reject) => {
    const buff = Buffer.from(JSON.stringify(data, null, 4));

    writeFile(path, buff, (err) => {
      err ? reject(err) : resolve();
    });
  });

exports.parseJsonBody = (request) =>
  new Promise((resolve, reject) => {
    let rawJson = "";

    request
      .on("data", (chunk) => {
        rawJson += chunk;
      })
      .on("end", () => {
        try {
          if (rawJson) {
            const requestBody = JSON.parse(rawJson);
            resolve(requestBody);
          } else {
            resolve(null);
          }
        } catch (err) {
          reject(err);
        }
      })
      .on("error", reject);
  });
