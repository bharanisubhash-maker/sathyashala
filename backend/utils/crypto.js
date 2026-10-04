const crypto = require('crypto');

/**
 * SHA-256 hash of a Buffer (image bytes)
 */
function hashImage(buffer) {
  return 'sha256:' + crypto.createHash('sha256').update(buffer).digest('hex');
}

/**
 * SHA-256 hash of a record object (canonical JSON)
 */
function hashRecord(record) {
  const canonical = JSON.stringify(record, Object.keys(record).sort());
  return 'sha256:' + crypto.createHash('sha256').update(canonical).digest('hex');
}

/**
 * Generate Ed25519 key pair (call once at server startup)
 */
function generateKeyPair() {
  return crypto.generateKeyPairSync('ed25519', {
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  });
}

/**
 * Sign a record hash with the server private key
 */
function signRecord(recordHash, privateKeyPem) {
  const privKey = crypto.createPrivateKey(privateKeyPem);
  return crypto.sign(null, Buffer.from(recordHash), privKey).toString('base64');
}

/**
 * Verify a record signature with the public key
 */
function verifySignature(recordHash, signatureBase64, publicKeyPem) {
  try {
    const pubKey = crypto.createPublicKey(publicKeyPem);
    const sigBuffer = Buffer.from(signatureBase64, 'base64');
    return crypto.verify(null, Buffer.from(recordHash), pubKey, sigBuffer);
  } catch {
    return false;
  }
}

module.exports = { hashImage, hashRecord, generateKeyPair, signRecord, verifySignature };
