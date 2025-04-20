const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Đảm bảo thư mục dist-electron tồn tại
const distElectronDir = path.join(__dirname, 'dist-electron');
if (!fs.existsSync(distElectronDir)) {
  fs.mkdirSync(distElectronDir, { recursive: true });
}

// Đảm bảo thư mục release/build tồn tại
const buildDir = path.join(__dirname, 'release/build');
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
}

// Compile TypeScript files từ Electron
console.log('Compiling Electron TypeScript files...');
execSync('tsc -p electron/tsconfig.json', { stdio: 'inherit' });

// Kiểm tra kết quả biên dịch
if (fs.existsSync(path.join(distElectronDir, 'main.js'))) {
  console.log('Successfully compiled main.js');
} else {
  console.error('Failed to compile main.js!');
}

// Copy preload.js từ dist-electron vào thư mục build nếu tồn tại
console.log('Checking for preload.js file...');
const preloadJsPath = path.join(distElectronDir, 'preload.js');

if (fs.existsSync(preloadJsPath)) {
  console.log('Copying preload.js to build directory...');
  const buildPreloadJsPath = path.join(buildDir, 'preload.js');
  fs.copyFileSync(preloadJsPath, buildPreloadJsPath);
  console.log('Successfully copied preload.js to:', buildPreloadJsPath);
} else {
  console.warn('Warning: preload.js not found in dist-electron directory');
}

// Kiểm tra file HTML
const indexPath = path.join(buildDir, 'index.html');
if (fs.existsSync(indexPath)) {
  console.log('index.html exists in build directory');
  // Đọc nội dung file index.html
  const indexContent = fs.readFileSync(indexPath, 'utf8');
  console.log('index.html content length:', indexContent.length);
  
  // Kiểm tra xem index.html có tham chiếu đến file JS và CSS không
  if (!indexContent.includes('<script') || !indexContent.includes('<link')) {
    console.warn('Warning: index.html might be missing script or style references!');
  }
} else {
  console.error('Error: index.html not found in build directory!');
}

console.log('Electron build completed successfully!'); 