## Getting Started

First, run the development server:

```bash
npm run dev
```

Note : use the --port [PORT] argument to run it on a different port in case :8000 is already bound by another process.

## Mock data (for development purposes only)

To use the mock data server, install `json-server` using npm:

```bash
npm install -g json-server
```

To run it (in parralel of the webpack dev server:

```bash
json-server --watch data/db.json
```

Note : use the --port [PORT] argument to run it on a different port in case :8000 is already bound by another process.

## Other

Stack: [Next.js](https://nextjs.org/).
