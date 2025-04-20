/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
module.exports = {
  appId: 'com.electron.vue3antd',
  productName: 'Vue3 Ant Design App',
  copyright: 'Copyright © 2023',
  asar: false,
  directories: {
    output: 'release/portable',
    buildResources: 'resources',
    app: '.'
  },
  files: [
    "dist-electron/**/*",
    {
      from: "release/build",
      to: "dist",
      filter: ["**/*"]
    }
  ],
  extraMetadata: {
    main: 'dist-electron/main.js'
  },
  extends: null,
  win: {
    target: ['portable'],
    artifactName: '${productName}_${version}.${ext}'
  },
  portable: {
    artifactName: '${productName}_${version}_portable.${ext}'
  },
  mac: {
    target: ['dmg'],
    artifactName: '${productName}_${version}.${ext}'
  },
  linux: {
    target: ['AppImage'],
    artifactName: '${productName}_${version}.${ext}'
  },
  nsis: {
    oneClick: false,
    allowToChangeInstallationDirectory: true,
    perMachine: false
  }
}
