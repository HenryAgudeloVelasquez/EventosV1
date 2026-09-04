import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

console.log('🚀 Starting clean production build...');

// 1. Clean dist completely
if (fs.existsSync('dist')) {
  fs.rmSync('dist', { recursive: true, force: true });
}

// 2. Build shared-kernel and copy directly into node_modules/shared-kernel
console.log('📦 Building shared-kernel...');
execSync('npx ng build shared-kernel', { stdio: 'inherit' });

if (fs.existsSync('node_modules/shared-kernel')) {
  fs.rmSync('node_modules/shared-kernel', { recursive: true, force: true });
}
fs.cpSync('dist/shared-kernel', 'node_modules/shared-kernel', { recursive: true });

// 3. Build microfrontends
console.log('📦 Building mfe-events...');
execSync('npx ng build mfe-events', { stdio: 'inherit' });

console.log('📦 Building mfe-booking...');
execSync('npx ng build mfe-booking', { stdio: 'inherit' });

// 4. Build shell (configured to output directly into dist/angular-ssr)
console.log('📦 Building shell into dist/angular-ssr...');
execSync('npx ng build shell', { stdio: 'inherit' });

// 5. Merge microfrontends into dist/angular-ssr/browser
console.log('🔄 Merging microfrontends into dist/angular-ssr/browser...');
const targetEvents = path.resolve('dist/angular-ssr/browser/mfe-events');
const targetBooking = path.resolve('dist/angular-ssr/browser/mfe-booking');

fs.cpSync('dist/mfe-events/browser', targetEvents, { recursive: true });
fs.cpSync('dist/mfe-booking/browser', targetBooking, { recursive: true });

// 6. Clean up temporary dist folders so ONLY dist/angular-ssr remains
console.log('🧹 Cleaning temporary build artifacts from dist/ ...');
fs.rmSync('dist/mfe-events', { recursive: true, force: true });
fs.rmSync('dist/mfe-booking', { recursive: true, force: true });
fs.rmSync('dist/shared-kernel', { recursive: true, force: true });
if (fs.existsSync('dist/shell')) {
  fs.rmSync('dist/shell', { recursive: true, force: true });
}

console.log('✅ Build complete! dist/ now contains exclusively:');
for (const item of fs.readdirSync('dist')) {
  console.log(`  - dist/${item}`);
}
