# Microsoft work-account sign-in

Learners use Sign in with Microsoft. No SMTP or academy-issued code is used. Company and email-code login endpoints are disabled by this implementation.

Verified company tenant: CONG TY TNHH ERGOVN, 03de5145-b616-469e-81a5-abd072f37b2c. Both ergovn.com and tfw.space were shown as verified domains in this tenant. Microsoft app: Ergo Academy, client ID 05e59f52-d92d-44c8-ac6d-1c654b4d59f9, organizational accounts only. Web callback: https://dlfgepzuxmkjkjwyrrsp.supabase.co/auth/v1/callback.

## Complete setup

1. In the Microsoft app manifest, configure optional ID-token claims email and xms_edov, and access-token claim xms_edov as recommended by Supabase. Keep supported account types My organization only. No mail-reading or directory-administration permissions are required by the academy.
2. The human administrator creates a client secret and pastes its VALUE directly into Supabase Authentication > Sign In / Providers > Azure (Microsoft). Client ID is above. Tenant URL must be https://login.microsoftonline.com/03de5145-b616-469e-81a5-abd072f37b2c (never common or organizations). Save the provider only when all fields are ready. Record secret expiry privately for rotation.
3. In Supabase URL Configuration, allow the exact redirect https://ergoers-training-roadmap.vercel.app/auth/callback. Site URL remains https://ergoers-training-roadmap.vercel.app.
4. After verifying those settings, set Production Vercel MICROSOFT_AUTH_READY=true and redeploy. SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY are already configured. No Microsoft secret belongs in GitHub or the browser application.
5. Test a work account from each allowed domain and an outside account. Verify logout and direct-file protection. Account consent or authentication challenges must be completed by the human user. Configuration tests alone do not prove a successful live sign-in.

The server uses Supabase's Azure OAuth provider with S256 PKCE, a ten-minute Secure/HttpOnly verifier cookie, a request-state check and a fixed callback. Supabase must be configured for the company tenant so it validates Microsoft's token issuer. Enable the verified-email claim to prevent unverified email impersonation.

The callback and every protected request validate the Supabase access token through getUser. Access requires an Azure identity with email_verified=true, a matching approved-domain email, a confirmed Supabase email, matching subject, and an OAuth authentication method. The issuer is checked when present in identity data. Session cookies are Secure, HttpOnly and SameSite=Strict, capped at one hour; no refresh tokens or Microsoft access tokens are retained. External redirects are not accepted. Failed or cancelled sign-in leaves access locked.

Progress is still browser-local and shared on a shared browser; identity-based private progress storage is a separate change. Public GitHub source and downloaded files remain outside the web login gate.

Reference: https://supabase.com/docs/guides/auth/social-login/auth-azure and https://github.com/supabase/auth/blob/master/openapi.yaml
