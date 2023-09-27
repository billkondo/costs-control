# Costs Control

## Prerequisites

- Setup [Firebase CLI](https://firebase.google.com/docs/cli)
- Create a [Firebase Web](https://firebase.google.com/docs/web/setup#create-project) project
- Run ``firebase use PROJECT_ID`` to change projects
- Run ``firebase projects:list`` to list projects

## Firebase configuration

Create a FirebaseConfig.js file on the */functions/* and */src/firebase/* folders. The file content should be the following template.

```
/** @type {FirebaseConfig} */
const FirebaseConfig = {
  development: {
    ...
  },
  production: {
    ...
  }
};

export default FirebaseConfig;
```

The */functions/FirebaseConfig.js* file should have a [Firebase service account](https://firebase.google.com/support/guides/service-accounts).

The */src/firebase/FirebaseConfig.js* file should have a [Firebase configuration object](https://firebase.google.com/docs/web/learn-more#config-object).

## Scripts 

### `npm run dev`

Start web application. Default URL: http://127.0.0.1:5173

### `npm run emulator` 

Start web server (Firebase emulator). Default dashboard URL: http://127.0.0.1:4000

### `npm run build` (functions folder)

Bundle the server code into index.js file using production configuration.

### `npm run build:dev` (functions folder)

Bundle the server code into index.js file using development configuration.

