# Implementation reference of the oAuth2 protocol

**To better understand the protocol [check the microsoft documentation](https://docs.microsoft.com/fr-fr/azure/active-directory/develop/v1-protocols-oauth-code).**

## Authentication API Routes
```
GET /oauth2/authorize
```

#### Description
Allow a website to redirect the user to our login form to authenticate. During this process we verify the authorization of the caller app (trough the `client_id` argument) aswell as the user trough a login form.

#### Arguments
Arguments that you must pass like `/oauth2/authorize?client_id=...&redirect_rui=..`.

| Name         | Description                                                                                |
|--------------|--------------------------------------------------------------------------------------------|
| client_id    | A unique id for your group that we have generated for you.                                 |
| redirect_uri | The URI to redirect after the user is authentified.                                        |
| state        | A random value that we will send you back later in the process to provide better security. |

#### On error
If the request is malformed the error will be displayed in the web page and a status code will be set accordingly.

#### On success
If your request is well made and the user was able to authenticate trough our login page then the user is redirected to the `redirect_uri` page: `redirect_uri?authorization_code=...&state=...` where you must validate the `state` and check that it's equal to the one specified when calling us and store the `redirect_uri` for the next call.

### POST /oauth2/token

#### Description
This route will send you an `access_token` and a `refresh_token` used to authenticate your api calls.

#### Arguments
Arguments to pass in the post form. Use `Content-Type: application/x-www-form-urlencoded`.

| Name      | Description                                                |
|-----------|------------------------------------------------------------|
| client_id | A unique id for your group that we have generated for you. |
| code      | The authorization_code that we sent you before.            |

#### On error
The error will be returned in the body of the request call with a json object such as `{ error: error_message }`.

#### On success
If your request is well made the answer will be returned in the body of the request call with a json object suchs as `{ access_token: ..., refresh_token: ... }`.

```
POST /oauth2/refresh
```

#### Description
This route will give you a new `access_token` by using your `refresh_token`.

#### Arguments
Arguments to pass in the post form. Use `Content-Type: application/x-www-form-urlencoded`.

| Name      | Description                                                |
|-----------|------------------------------------------------------------|
| client_id | A unique id for your group that we have generated for you. |
| token     | The refresh_token that we sent you before.                 |

#### On error
The error will be returned in the body of the request call with a json object such as `{ error: error_message }`.

#### On success
If your request is well made the answer will be returned in the body of the request call with a json object suchs as `{ access_token: ..., refresh_token: ... }` where the `access_token` was refreshed.

## Identification API Routes
Once the user is authentified and have it's `access_token` you will be able to use it to identify him such as getting is name, promotion, rights etc...

For each call to the API you will use the previously acquiered `access_token`. The token must be passed to the API trough the `Authorization` field, the field must follow this format `Bearer access_token`. The `access_token` is valid for 5 minutes. If the token is no longer valid you can get a new `access_token` trough the `/oauth2/refresh` route.

Exemple, if you want to get basics informations about the user:
```
GET /identity/me
Authorization: Bearer tZnl0aEV1THdqcHdB...
```



**TODO**