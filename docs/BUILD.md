# Build & verify (easy path)

One-liners that should pass on a clean machine.

## All three

```bash
cd /home/nusrat/Projects/Success/Sorobill
./verify.sh
```

## Contract

```bash
cd Sorobill-Contract
make verify    # cargo test + cargo check
# optional wasm:
make build
```

## Backend

```bash
cd Sorobill-Backend
cp .env.example .env   # if needed; DATABASE_URL is enough for generate/build
npm install
npm run verify         # prisma generate + vitest + tsc
# or:
npm run build          # prisma generate && tsc
npm test
```

## App (Vercel-ready)

```bash
cd Sorobill-App
cp .env.production .env.local   # mock mode on — no backend required
npm install
npm run build
npm run dev
```

Demo mode is **on by default** unless `NEXT_PUBLIC_USE_MOCK=false`.

### Deploy App to Vercel

```bash
cd Sorobill-App
npx vercel --prod
```

Set env in the Vercel dashboard (or import `.env.production`):
- `NEXT_PUBLIC_USE_MOCK=true` for a working public demo
- Contract ID / API URL when you go live
