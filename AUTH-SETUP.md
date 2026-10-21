# Company-issued employee codes

Login now uses an individual company code plus an assigned company email. It does not send email, use SMTP, or verify email ownership. Only exact ergovn.com and tfw.space accounts in the private company configuration are allowed. Existing Supabase signup confirmation-link settings are retained, but this login does not call Supabase Auth.

## Issue locally

Run: node issue-company-code.cjs employee@ergovn.com "Full Name"

The tool creates a private employee code file and private-access/company-access.json. Codes have 120 bits of random entropy and expire after 90 days. They are case-sensitive; display hyphens and spaces are ignored. Never commit either generated file. The configuration holds salted scrypt hashes and a session signing key; the clear code appears only in the employee file.

## Activate in Vercel

Add a Production SECRET environment variable named COMPANY_ACCESS_CONFIG. Paste the complete contents of private-access/company-access.json. Save and redeploy. The academy stays locked until this variable is valid. The existing SUPABASE variables are not used for company-code access.

The human administrator must perform credential entry in the browser. Distribute each employee's code privately. Do not send codes to the public repository or public issue tracker. Sessions expire after one hour. Updating a record to revoked:true or removing its entry blocks its code and existing sessions after the updated configuration is deployed. Rotating an employee record ID invalidates previous sessions. Rotating the signing key invalidates all sessions. Configuration changes require redeployment.

This initial roster is managed in Vercel, not through a public admin screen. It supports up to 1,000 employee records subject to Vercel's environment-size limits. There is no centralized failed-attempt counter; use strong generated codes and Vercel Firewall for additional traffic controls.

Learning records are still stored in the browser and are not isolated per employee on shared devices. This change controls access to the site; it does not add shared progress storage. Public GitHub source and previously downloaded copies remain outside the login gate.

Validation: node check-access.cjs. The tests use generated fictional credentials and cover wrong email/code, signatures, expiry, revocation, CSRF and asset protection.
