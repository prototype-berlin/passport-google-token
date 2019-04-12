# passport-google-token

Google token strategy for our loopback projects.

## Installation

$ npm install https://github.com/prototype-berlin/passport-accountkit-token.git

## Usage

### Configure Strategy

```js
google: {
  provider: 'google',
  module: 'passport-google-token',
  strategy: 'GoogleTokenStrategy',
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.URL}/auth/google/callback`,
  session: false,
  json: true,
},
```
