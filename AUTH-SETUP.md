# Administrator-created password accounts

Company email plus a separate academy password replaces Microsoft and email codes. Existing SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY configure the server. SMTP and Microsoft secrets are unused.

Disable Allow new users to sign up under Authentication > Sign In / Providers. Keep Email enabled. Under Users > Add user > Create new user, the human administrator enters a company email and unique strong password and enables Auto Confirm User. Do not use Invite user (requires SMTP).

After verifying the employee, run this scoped SQL in Supabase SQL Editor, replacing the example email:

```sql
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"academy_access":true}'::jsonb
where lower(email) = 'employee@ergovn.com'
and lower(split_part(email,'@',2)) in ('ergovn.com','tfw.space')
returning id, email;
```

To revoke access, use the same scoped query with academy_access false. Approval is checked remotely on every request, including existing sessions. Never use user-editable user_metadata for approval. Administrators handle password resets privately through Supabase. Never put passwords into chat or GitHub.

Server checks remotely validated token, confirmed email, exact domain, administrator-controlled app_metadata approval, matching subject and password authentication method. Cookies are Secure, HttpOnly, SameSite and expire within one hour. Supabase applies configured authentication rate limits. Passwords and refresh tokens are not retained by the academy.

Progress remains browser-local; this does not implement shared per-learner storage. Public source and previously downloaded copies remain outside the gate. Run node check-access.cjs. Live success requires an administrator-created account.
