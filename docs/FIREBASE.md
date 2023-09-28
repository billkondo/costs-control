# Firebase configuration

- Create [Firebase projects](https://firebase.google.com/docs/web/setup#create-project) for staging and production environments

- Create *.firebaserc* file on the *root* folder using the following template:

```
{
  "projects": {
    "development": "<project-id-for-development>",
    "staging": "<project-id-for-staging>",
    "production": "<project-id-for-production>"
  }
}
```

You can use the staging project in the development environment.
In development environment, the Firebase Emulator is used instead of consuming the project quota.

- Create the *.env.staging* and *.env.production* files on the *functions* folder. Use the following templates:

*.env.staging*
```
SERVER_ENV=staging
```

*.env.production*
```
SERVER_ENV=production
```

- Create a FirebaseConfig.js file on the *functions* and *src/firebase* folders. Use the following template:

```
/** @type {FirebaseConfig} */
const FirebaseConfig = {
  development: {
    ...
  },
  staging: {
    ...
  },
  production: {
    ...
  }
};

export default FirebaseConfig;
```

The *functions/FirebaseConfig.js* file should have the [Firebase service account](https://firebase.google.com/support/guides/service-accounts).

The *src/firebase/FirebaseConfig.js* file should have the [Firebase configuration object](https://firebase.google.com/docs/web/learn-more#config-object).