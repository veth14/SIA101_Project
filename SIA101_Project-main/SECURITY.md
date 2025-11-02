# Security Guidelines

## Environment Variables Setup

### 🔒 Important Security Notes
- **NEVER** commit `.env` files to git
- **ALWAYS** use environment variables for sensitive data
- **NEVER** hardcode API keys, passwords, or secrets in your code

### 📋 Setup Instructions

1. **Copy the environment template:**
   ```bash
   cp .env.example .env
   ```

2. **Fill in your actual values in `.env`:**
   - Replace placeholder values with your real Firebase credentials
   - Add any additional API keys you need
   - Set your admin credentials for development

3. **Verify `.env` is ignored:**
   ```bash
   git status
   # .env should NOT appear in the list
   ```

### 🛡️ Protected Files

The following files are automatically ignored by git:
- `.env` and all `.env.*` files
- `firebase-config.*` files
- `serviceAccountKey.json`
- Any files containing `secrets` or `api-keys`

### 🚨 If You Accidentally Committed Secrets

If you accidentally committed sensitive information:

1. **Remove from git tracking:**
   ```bash
   git rm --cached .env
   git commit -m "Remove .env from tracking"
   ```

2. **Change all exposed credentials immediately:**
   - Regenerate Firebase API keys
   - Change admin passwords
   - Rotate any other exposed secrets

3. **Consider the repository compromised:**
   - If the repository is public, assume all committed secrets are compromised
   - Change all credentials that were ever committed

### 📝 Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_FIREBASE_API_KEY` | Firebase API Key | Yes |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain | Yes |
| `VITE_FIREBASE_PROJECT_ID` | Firebase Project ID | Yes |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket | Yes |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase Messaging Sender ID | Yes |
| `VITE_FIREBASE_APP_ID` | Firebase App ID | Yes |
| `VITE_FIREBASE_MEASUREMENT_ID` | Firebase Analytics Measurement ID | No |

### 🔧 Development vs Production

- Use different Firebase projects for development and production
- Never use production credentials in development
- Set up proper environment-specific configurations

### 📞 Support

If you have questions about security setup, please contact the development team.
