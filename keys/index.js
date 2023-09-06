const {
  generateKeyPairSync,
  publicEncrypt,
  privateDecrypt,
} = require("crypto");

const { publicKey, privateKey } = generateKeyPairSync("rsa", {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: "spki",
    format: "pem",
  },
  privateKeyEncoding: {
    type: "pkcs8",
    format: "pem",
    cipher: "aes-256-cbc",
    passphrase: "top secret",
  },
});

// 加密方法
const encrypt = (text) => {
  // 注意，第二个参数是Buffer类型
  const result = publicEncrypt(publicKey, Buffer.from(text));
  console.log(result, "encrypt");
  return result;
};

// 解密方法
const decrypt = (encrypted) => {
  // 注意，encrypted是Buffer类型
  console.log(encrypted, "encrypted");
  const result = privateDecrypt(
    {
      key: privateKey.toString(),
      passphrase: "top secret",
    },
    encrypted
  );
  console.log(result, "decrypt");
  return result;
};
module.exports = { publicKey, privateKey, encrypt, decrypt };
// ！ 注意18.17.1 版本，这个解密有问题，退回16.17.0正常