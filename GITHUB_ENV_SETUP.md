# GitHub Environment Variables Setup

## For GitHub Actions / CI/CD

To set the wallet address as an environment variable in GitHub:

### Option 1: Repository Secrets (Recommended for CI/CD)

1. Go to your repository: https://github.com/clkhoo5211/aphorism
2. Click on **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `VITE_WALLET_ADDRESS`
5. Value: `0xE109929342703eDD45DB488bf33983B2a48A6C4F`
6. Click **Add secret**

### Option 2: Environment Variables (For Deployment)

1. Go to **Settings** → **Environments**
2. Create or select an environment (e.g., "production")
3. Add environment variable:
   - Name: `VITE_WALLET_ADDRESS`
   - Value: `0xE109929342703eDD45DB488bf33983B2a48A6C4F`

## For Local Development

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and set your wallet address:
   ```
   VITE_WALLET_ADDRESS=0xE109929342703eDD45DB488bf33983B2a48A6C4F
   ```

3. Restart your dev server:
   ```bash
   npm run dev
   ```

## For Deployment Platforms

### Vercel
1. Go to Project Settings → Environment Variables
2. Add: `VITE_WALLET_ADDRESS` = `0xE109929342703eDD45DB488bf33983B2a48A6C4F`
3. Redeploy

### Netlify
1. Go to Site Settings → Environment Variables
2. Add: `VITE_WALLET_ADDRESS` = `0xE109929342703eDD45DB488bf33983B2a48A6C4F`
3. Redeploy

### GitHub Pages (via Actions)
Add to your workflow file:
```yaml
env:
  VITE_WALLET_ADDRESS: ${{ secrets.VITE_WALLET_ADDRESS }}
```

## Note

- The `.env` file is gitignored and won't be committed
- The `.env.example` file shows what variables are needed
- Vite requires the `VITE_` prefix for client-side environment variables
