# CookiesAndChromeExtension

After futzing around with Chrome's OAuth2 identity APIs, I decided to just go with cookies. This is a starter project for React and ASP.NET's default identity provider with cookies.

## Backstory

Chrome Extensions need to correctly use the callback url from a code flow in order to store the response's payload appropriately. This eliminates using any standard SDK that is typically used in javscript applications like [oidc-client-ts](https://github.com/authts/oidc-client-ts) or [AuthO's SDKs](https://auth0.com/docs/libraries).

After digging through oidc-client-ts and starting to write my own Navigator, I was also thinking about token lifetimes and not storing them in storage, since it's bad practice. My conclusion was that I don't want to force the user to login every time they open the browser, so I switched to cookies. It seems I'm not alone in this decision, as one of my favorite Chrome extensions, [Raindrop.io](https://raindrop.io/) also uses cookies for authorization. If it's good enough for [Rustem Mussabekov](https://github.com/exentrich), it's good enough for me.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

The things you need before installing the software.

- [.NET 6](https://dotnet.microsoft.com/en-us/download/dotnet/6.0) (this can be via standalone or through Visual Studio)
- [Yarn](https://yarnpkg.com/) or [NPM](https://docs.npmjs.com/cli/v7/configuring-npm/install)
- [Microsoft SQL Express](https://www.microsoft.com/en-us/Download/details.aspx?id=101064) (You can bring your own database as long as there's a provider for EntityFramework. Refactoring for something else is outside the scope of this readme.)

### Installation

Clone the project:

```
git clone https://github.com/mikeruhl/cookies-and-chrome-extension
```

Next, edit the appsettings.json file, edit `ConnectionStrings::DefaultConnection` if you do not want to use the default.

Then, apply the migrations to your database:

```
$ cd cookiesid
$ dotnet ef database update
```

Provided all tooling is accounted for, you should have a success.

Now we need to build and install the chrome extension. To build it, goto `extension` and type in:

```
$ yarn build
```

Next, install the chrome extension:

In Edge or Chrome, goto `edge://extensions` or `chrome://extensions`. Ensure developer mode is on, which should enable "Load unpacked". Select that, and navigate to `extension/build`. Select that directory and it should load up.

Now copy that id:

![Extension ID](/readme/ext_id.png)

Head back to your appsettings.json and add an entry to `AllowedHosts` with "chrome-extension://[your id]"

```json
{
  "AllowedOrigins": [
    "chrome-extension://hpjggmmdkeklokdliogmjhmhoebnnhok",
    "http://localhost:3000"
  ]
}
```

Now run your solution via `dotnet`, VSCode, or Visual Studio.

## Usage

Once running, you should be able to open the extension via the cookie command and login/logout. Once you login, you should see your username in the popup of the extension.

## Deployment

This app is a demo app and is no way intended for production.

## Additional Documentation and Acknowledgments

- [FlatIcon](https://www.flaticon.com/) for the cookie icon
