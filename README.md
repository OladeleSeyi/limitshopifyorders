# Shopify App Boilerplate with Node,Typescript,MongoDb & Next.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md)

Boilerplate to create an embedded Shopify app made with [Node.js](https://nodejs.org/en/), [Typescript](https://www.typescriptlang.org/), [MongoDb](https://www.mongodb.com/), [Next.js](https://nextjs.org/), [Shopify-koa-auth](https://github.com/Shopify/quilt/tree/master/packages/koa-shopify-auth), [Polaris](https://github.com/Shopify/polaris-react), and [App Bridge React](https://shopify.dev/tools/app-bridge/react-components).

## Libraries

[![Shopify](https://img.shields.io/badge/Shopify-green?style=for-the-badge&logo=shopify&logoColor=white)](https://shopify.dev/) [![Node](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/en/) [![Typescript](https://img.shields.io/badge/TypeScript-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/) [![MongoDb](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/) [![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)

## Installation

Fork and clone this repository

```sh
~/ $ git clone https://github.com/0x-buidl/shopify-app-typescript-boilerplate.git
```

## Requirements

- If you don’t have one, [create a Shopify partner account](https://partners.shopify.com/signup).
- If you don’t have one, [create a Development store](https://help.shopify.com/en/partners/dashboard/development-stores#create-a-development-store) where you can install and test your app.
- In the Partner dashboard, [create a new app](https://help.shopify.com/en/api/tools/partner-dashboard/your-apps#create-a-new-app). You’ll need this app’s API credentials during the setup process.

## Usage

development:

start your app with

```sh
~/ $ yarn dev
```

then connect ngrok to your development port

```sh
~/ $ ngrok http <your port>
```

build:

```sh
~/ $ yarn build
```

production:

```sh
~/ $ yarn start
```

## References

[SHOPIFY APP NODE](https://github.com/Shopify/shopify-app-template-node)

## License

This repository is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).
