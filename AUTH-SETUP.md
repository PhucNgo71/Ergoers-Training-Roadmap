# Email access

All Vercel paths route through `api/access.js`. No academy assets are published as unprotected static output. Without Supabase environment variables, the entry screen appears and access stays locked. The blurred background contains generic course titles only, not lesson text, questions or learner records.

## Activate

1. Create a Supabase project; enable email sign-in and keep email confirmation enabled.
2. Configure a production SMTP provider in Supabase Authentication. The default Supabase sender is limited to project team addresses.
3. Change the Magic Link email template to show `{{ .Token }}` as the verification code. Use an English subject such as “Your Ergo Academy sign-in code”. Configure a short OTP expiry and the provider's rate limits/CAPTCHA protection appropriate to usage.
4. Add `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` to Vercel Production environment variables and redeploy. No service-role key is needed. Keep SMTP credentials in Supabase, never in GitHub.
5. Test one real mailbox from each allowed domain, an outside-domain address, wrong/expired codes, direct lesson/file URLs, session expiry and sign-out. Real delivery cannot be tested before this setup exists.

The server checks exact email domains at code request, code verification and every protected request. Supabase validates sessions remotely; only verified allowed-domain users are served files. Sessions use Secure, HttpOnly, SameSite=Strict cookies and expire within one hour; then sign in again. No refresh tokens are stored. Existing academy progress remains browser-local and shared among users of that browser; this change does not implement per-user private records or team storage.

This protects the deployed academy, not files previously downloaded or public GitHub source. The repository remains public as previously requested. To make the training source private too, change repository visibility separately.

References: https://supabase.com/docs/guides/auth/auth-email-passwordless and https://supabase.com/docs/guides/auth/auth-smtp
