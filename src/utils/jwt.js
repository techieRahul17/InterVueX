const jwt = require('jsonwebtoken');
const fs = require('fs');

function signJWT(payload) {
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    throw new Error('Private key not found in environment variables');
  }

  const token = jwt.sign(payload, privateKey, { algorithm: 'RS256' });
  return token;
}

module.exports = { signJWT };
