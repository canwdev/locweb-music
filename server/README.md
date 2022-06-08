# Server https config

> reference: https://stackoverflow.com/questions/21397809/create-a-trusted-self-signed-ssl-cert-for-localhost-for-use-with-express-node

Create self-signed cert

```sh
# Run this in Linux!
openssl req -x509 -newkey rsa:4096 -keyout tempkey.pem -out cert.pem -sha256 -days 365
# Decrypt your key
openssl rsa -in tempkey.pem -out key.pem
```

In `server/config/config.json`

```json
{
  "httpsOptions": {
    "keyPath": "D:\\home\\Music\\ssl\\key.pem",
    "certPath": "D:\\home\\Music\\ssl\\cert.pem"
  }
}
```

In `frontend` project directory

`.env.development.local`

```
VUE_APP_API_HOST = 'https://localhost:12022'
```
