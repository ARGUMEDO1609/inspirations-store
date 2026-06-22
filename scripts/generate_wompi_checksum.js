#!/usr/bin/env node
/**
 * Node helper to generate the SHA256 checksum Wompi expects for webhook events.
 *
 * Usage:
 *   node scripts/generate_wompi_checksum.js payload.json <event-key> [timestamp]
 *
 * The payload must include a `data` object (with `transaction` nested data)
 * and a `signature.properties` array referencing each path to concatenate.
 * If the file already contains `signature.timestamp`, you can omit the third argument.
 */

const fs = require('fs');
const crypto = require('crypto');

const [payloadFile, secret, timestampArg] = process.argv.slice(2);

if (!payloadFile || !secret) {
  console.error('Usage: node scripts/generate_wompi_checksum.js payload.json <event-secret> [timestamp]');
  process.exit(1);
}

const payloadRaw = fs.readFileSync(payloadFile, { encoding: 'utf8' });
const payload = JSON.parse(payloadRaw);
const signature = payload.signature || {};
const properties = signature.properties || [];
const timestamp = timestampArg || signature.timestamp;

if (!timestamp) {
  console.error('Missing timestamp. Provide it as either signature.timestamp in payload or as third argument.');
  process.exit(1);
}

const data = payload.data || {};

const valueForProperty = (object, property) => {
  return property.split('.').reduce((current, key) => {
    if (current && typeof current === 'object') {
      return current[key];
    }
    return undefined;
  }, object);
};

const concatenated = properties
  .map((prop) => valueForProperty(data, prop))
  .map((value) => (value === undefined ? '' : value.toString()))
  .join('');

const raw = `${concatenated}${timestamp}${secret}`;
const checksum = crypto.createHash('sha256').update(raw).digest('hex');

console.log(checksum);
