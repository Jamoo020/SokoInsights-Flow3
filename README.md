# Welcome to your Lovable project

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Open your project in the [Lovable editor](https://lovable.dev) and keep building.

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: connect the project to GitHub and every change made in Lovable is committed straight to your repository.
- **Full ownership**: this code is yours. Push to your repository and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Paylor payments

Set the server-side Paylor API key before starting the app. In PowerShell:

```powershell
$env:PAYLOR_API_KEY = "your_api_key_here"
npm run dev
```

The membership activation and withdrawal processing-fee flows use Paylor M-PESA STK Push and
confirm the transaction status before updating the local member state. Keep the API key on the
server and grant the key the `payments:create` and `transactions:read` scopes.

## Built with

- TanStack Start
- TypeScript
- React
- Tailwind CSS
