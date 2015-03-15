module.exports = {
  buildDir: './build/',
  frontedDir: './src/fronted/',
  widgetCompileDir: '../Emulator/APPS/PlayOnTV/',
  server:{
    path: './src/backend/index.js',
    env: { 
      NODE_ENV: 'development',
      NODE_CONFIG_DIR: './src/backend/config/'
    }
  },
  bs:{
    proxy: 'http://localhost:3000'
  },
  main: {
    backend: './src/backend/index.js',
    frontend: {
      html: './src/fronted/index.html',
      js: './src/frontend/app.js',
      less: './src/frontend/**/*.less'
    },
    widget: {
      html: './src/widget/index.html',
      xml: './src/widget/config.xml',
      js: './src/widget/app.js',
      less: './src/widget/**/*.less'
    }
  },
  files: {
    backend: './src/backend/**/*.js',
    frontend: {
      html: './src/frontend/index.html',
      js: './src/frontend/**/*.js',
      less: './src/frontend/**/*.less',
      assets: './src/frontend/assets/**/*'
    },
    widget: {
      html: './src/widget/index.html',
      xml: './src/widget/config.xml',
      js: './src/widget/**/*.js',
      lib: './src/widget/lib/**/*.js',
      less: './src/widget/**/*.less',
      assets: './src/widget/assets/**/*'
    }
  }
}