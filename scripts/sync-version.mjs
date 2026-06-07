import { readFileSync, writeFileSync } from 'node:fs';

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const { name, version, description, author, license, repository } = pkg;

let changed = 0;

// ========== 更新 Cargo.toml ==========
const origCargo = readFileSync('src-tauri/Cargo.toml', 'utf8');
let cargo = origCargo;
cargo = cargo.replace(/^name\s*=\s*".*"/m,            `name = "${name}"`);
cargo = cargo.replace(/^version\s*=\s*".*"/m,         `version = "${version}"`);
cargo = cargo.replace(/^description\s*=\s*".*"/m,     `description = "${description}"`);
cargo = cargo.replace(/^authors\s*=\s*\[.*\]/m,       `authors = ["${author}"]`);
cargo = cargo.replace(/^license\s*=\s*".*"/m,         `license = "${license}"`);
cargo = cargo.replace(/^repository\s*=\s*".*"/m,      `repository = "${repository}"`);
if (cargo !== origCargo) {
  writeFileSync('src-tauri/Cargo.toml', cargo);
  console.log('✅ Cargo.toml updated');
  changed++;
} else {
  console.log('⏭️  Cargo.toml unchanged, skipped');
}

// ========== 更新 tauri.conf.json ==========
const origTauri = readFileSync('src-tauri/tauri.conf.json', 'utf8');
let tauri = origTauri;
tauri = tauri.replace(/"productName":\s*".*"/,  `"productName": "${name}"`);
tauri = tauri.replace(/"version":\s*".*"/,       `"version": "${version}"`);
if (tauri !== origTauri) {
  writeFileSync('src-tauri/tauri.conf.json', tauri);
  console.log('✅ tauri.conf.json updated');
  changed++;
} else {
  console.log('⏭️  tauri.conf.json unchanged, skipped');
}

console.log(changed ? `\n🔧 ${changed} file(s) synced` : '\n✨ All up to date');
