# IPLoc

Author: Benji

IPLoc is a small Next.js demo that guesses a visitor's approximate location using the IPStack API and displays the result in a single responsive card. The card shows:

- City, Country
- IP address
- Time zone
- ISP
- Device type (derived from user agent)

It also includes a simple rating control so visitors can indicate how accurate the guess was.

## Requirements

- Node.js (LTS recommended)

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env.local` file in the project root and add your IPStack API key:

   ```text
   IPSTACK_KEY=your_ipstack_key_here
   ```

## Run (development)

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Run (production build)

```bash
npm run build
npm start
```

## Notes

- Keep `IPSTACK_KEY` secret. The project uses a server-side API route at `/api/ip` to proxy requests to IPStack so the key is not exposed in the browser.
