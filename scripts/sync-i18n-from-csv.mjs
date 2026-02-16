#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

function parseCsvLine(line) {
  const fields = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];

    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (ch === ',' && !inQuotes) {
      fields.push(current);
      current = '';
      continue;
    }

    current += ch;
  }

  fields.push(current);
  return fields;
}

function setNested(target, dottedKey, value) {
  const segments = dottedKey.split('.');
  let current = target;

  for (let i = 0; i < segments.length - 1; i += 1) {
    const segment = segments[i];
    if (!current[segment] || typeof current[segment] !== 'object') {
      current[segment] = {};
    }
    current = current[segment];
  }

  current[segments[segments.length - 1]] = value;
}

function readCsv(filePath) {
  const content = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
  const lines = content.split(/\r?\n/).filter((line) => line.trim().length > 0);

  if (lines.length === 0) {
    throw new Error('CSV 파일이 비어 있습니다.');
  }

  const headers = parseCsvLine(lines[0]).map((header) => header.trim().toLowerCase());
  const keyIndex = headers.indexOf('key');
  const koIndex = headers.indexOf('ko');
  const enIndex = headers.indexOf('en');

  if (keyIndex < 0 || koIndex < 0 || enIndex < 0) {
    throw new Error('CSV 헤더에 key, ko, en 컬럼이 필요합니다.');
  }

  const rows = [];
  for (let i = 1; i < lines.length; i += 1) {
    const cols = parseCsvLine(lines[i]);
    const key = (cols[keyIndex] || '').trim();
    const ko = (cols[koIndex] || '').trim();
    const en = (cols[enIndex] || '').trim();

    if (!key) continue;
    rows.push({ key, ko, en });
  }

  return rows;
}

function buildMessages(rows, locale) {
  const result = {};
  rows.forEach((row) => {
    setNested(result, row.key, locale === 'ko' ? row.ko : row.en);
  });
  return result;
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function main() {
  const inputPath = process.argv[2];
  if (!inputPath) {
    console.error('사용법: node scripts/sync-i18n-from-csv.mjs <csv-path>');
    process.exit(1);
  }

  const rows = readCsv(inputPath);
  const ko = buildMessages(rows, 'ko');
  const en = buildMessages(rows, 'en');

  const root = process.cwd();
  writeJson(path.join(root, 'messages', 'ko.json'), ko);
  writeJson(path.join(root, 'messages', 'en.json'), en);

  console.log(`Synced ${rows.length} i18n rows to messages/ko.json and messages/en.json`);
}

main();
