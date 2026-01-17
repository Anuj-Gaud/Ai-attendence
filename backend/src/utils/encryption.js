const crypto = require('crypto');

const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32;
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const TAG_POSITION = SALT_LENGTH + IV_LENGTH;
const ENCRYPTED_POSITION = TAG_POSITION + TAG_LENGTH;

class EncryptionService {
  constructor() {
    this.secret = process.env.ENCRYPTION_KEY || this.generateKey();
  }

  generateKey() {
    return crypto.randomBytes(KEY_LENGTH).toString('hex');
  }

  getKey(salt) {
    return crypto.pbkdf2Sync(this.secret, salt, 100000, KEY_LENGTH, 'sha512');
  }

  encrypt(text) {
    const iv = crypto.randomBytes(IV_LENGTH);
    const salt = crypto.randomBytes(SALT_LENGTH);
    const key = this.getKey(salt);

    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    const encrypted = Buffer.concat([
      cipher.update(String(text), 'utf8'),
      cipher.final()
    ]);

    const tag = cipher.getAuthTag();

    return Buffer.concat([salt, iv, tag, encrypted]).toString('hex');
  }

  decrypt(encryptedHex) {
    const encrypted = Buffer.from(encryptedHex, 'hex');

    const salt = encrypted.slice(0, SALT_LENGTH);
    const iv = encrypted.slice(SALT_LENGTH, TAG_POSITION);
    const tag = encrypted.slice(TAG_POSITION, ENCRYPTED_POSITION);
    const ciphertext = encrypted.slice(ENCRYPTED_POSITION);

    const key = this.getKey(salt);

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);

    return decipher.update(ciphertext, 'binary', 'utf8') + decipher.final('utf8');
  }

  hash(text) {
    return crypto
      .createHash('sha256')
      .update(String(text))
      .digest('hex');
  }

  compare(text, hash) {
    return this.hash(text) === hash;
  }

  generateToken(length = 32) {
    return crypto.randomBytes(length).toString('hex');
  }
}

module.exports = new EncryptionService();