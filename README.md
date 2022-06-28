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
