const crypto = require("crypto");

const algorithm = "aes-192-cbc";
const key = crypto.scryptSync(
  process.env.ENCRIPTION_KEYWORD,
  process.env.ENCRIPTION_SALT,
  24
);

exports.decrypt = (encrypted) => {
  const decipher = crypto.createDecipheriv(algorithm, key, Buffer.alloc(16, 0));

  return decipher.update(encrypted, "hex", "utf8") + decipher.final("utf8");
};

exports.encrypt = (text) => {
  const cipher = crypto.createCipheriv(algorithm, key, Buffer.alloc(16, 0));

  return (
    cipher.update(JSON.stringify(text), "utf8", "hex") + cipher.final("hex")
  );
};
