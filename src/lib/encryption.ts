import crypto from 'crypto';

// ENCRYPTION_KEY must be a strong secret.
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default_secret_key_32_bytes_long'; 
const ALGORITHM = 'aes-256-gcm';

// Derive a 32-byte key from the environment variable using SHA-256.
// This ensures the key is exactly 32 bytes long as required by aes-256-gcm.
const getEncryptionKey = () => crypto.createHash('sha256').update(ENCRYPTION_KEY).digest();

export function encrypt(text: string): string {
  if (!text) return text;
  
  const iv = crypto.randomBytes(16);
  const key = getEncryptionKey();
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag().toString('hex');
  
  // Format: iv:authTag:encryptedData
  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

export function decrypt(hash: string): string {
  if (!hash) return hash;
  
  if (!hash.includes(':')) {
    throw new Error('Invalid encrypted format: missing delimiters');
  }
  
  const [ivHex, authTagHex, encryptedData] = hash.split(':');
  
  if (!ivHex || !authTagHex || !encryptedData) {
    throw new Error('Invalid encrypted format: missing components');
  }
  
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const key = getEncryptionKey();
  
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}
