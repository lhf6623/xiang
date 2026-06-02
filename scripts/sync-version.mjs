import { readFileSync, writeFileSync } from 'node:fs';

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const { version } = pkg;

// 更新 Cargo.toml
let cargo = readFileSync('src-tauri/Cargo.toml', 'utf8');
cargo = cargo.replace(/^version\s*=\s*".*"/m, `version = "${version}"`);
writeFileSync('src-tauri/Cargo.toml', cargo);

// 更新 tauri.conf.json
let tauri = readFileSync('src-tauri/tauri.conf.json', 'utf8');
tauri = tauri.replace(/"version":\s*".*"/, `"version": "${version}"`);
writeFileSync('src-tauri/tauri.conf.json', tauri);

console.log(`✅ Synced version ${version} to Cargo.toml & tauri.conf.json`);
