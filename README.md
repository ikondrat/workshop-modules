# Webpack modules federation

Webpack 5 came with a feature called [module federation](https://webpack.js.org/concepts/module-federation/)


This is an example of working setup used to manage microfrontend applications in [crowdhouse AG](http://crowdhouse.ch)


## Workshop Prerequisites
- Git
- Node.js 16 or higher


## Installing Dependencies

1. Clone this repo
   ```sh
   git clone git@github.com:ikondrat/workshop-modules.git
   cd workshop-modules
   ```

2. Install NPM packages
   ```sh
   npm install
   ```

3. Run app-container
   ```sh
   npm run start -w packages/app-container
   ```
4. Run app-busket
   ```sh
   npm run start -w packages/app-busket
   ```

## Introduce remote widget
1. Make copy from app-busket
```
cp -r ./packages/app-busket ./packages/component-price
```

2. Update .env.development with new PORT
```
PORT=3102
```

3. Define exposed component in `module.config.js`
```
  name: 'component_price',
  filename: 'remoteEntry.js',
  exposes: {
    './ComponentPrice': './src/ComponentPrice',
  },
```

4. Run the container locally
```
npm run start
```

5. Add `@modules/lazy-widget` to packages/app-busket to load the remote widget
```
npm i @modules/lazy-widget -w packages/app-busket
```

6. Add `ComponentPrice` to packages/app-busket
```
<LazyWidget
   containerURL='http://localhost:3102/remoteEntry.js'
   containerScope="component_price"
   widget="./ComponentPrice"
/>
```

6. Reload the container app
