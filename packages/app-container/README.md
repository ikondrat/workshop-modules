# Container app to crowdhouse app

This app is supposed to be base seed to handle SPA architecture as container

## External crowdhouse apps
Root routing is done on the container level
E.g. `apps.crowdhouse.ch/helpcenter`
1. Will initialize the container app
2. Will detect supported `/helpcenter`
3. Will load helpcenter app remote app and render it

### Deployments scripts
Every package is supposed to control it's own deployment process

For that we have 3 states:
1. `npm run deploy:pr` will be responsible for the deployment to the feature branch
2. `npm run deploy:staging` will be responsible for the deployment to the staging
3. `npm run deploy:production` will be responsible for the deployment to the production

`npm run deploy:pr` is supposed to be triggered by `npm lerna version` and lifecycle script `version`, which will analyse all dependencies for the update

`npm run deploy:staging` and `npm run deploy:production` are supposed to be triggered by `npx lerna from-git` and lifecycle script `prepack`



