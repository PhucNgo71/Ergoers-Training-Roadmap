# Product training and progress overview — 19 October 2026

## Product Training

Four short brand sections: Framery, Wintech/WINPOD, Zenith and thefirstworkshop. The existing seven references remain; eleven added references bring the portfolio to eighteen. Twenty new questions expand Product Training from 35 to 55 questions. Academy assessment remains twenty random questions from finished courses, 70% to pass.

New material separates category, use case, exact configuration and before-quote checks. Each reference links to an official page. Short client-brief exercises provide immediate feedback without changing assessment scores. The First Workshop is described as an Ergovn workspace brand and curated range, rather than being called the manufacturer of every item it sells.

Sources checked:

- Framery range and linked One Compact/Four/Six pages: https://framery.com/en/office-pods-and-booths/
- WINPOD by Wintech, with linked S/W/D model pages: https://winpodacoustics.com/
- Zenith JAC, KISSEN and PRECINCT references: https://www.zenithinteriors.com/
- TFW current product cards and workstation configurator: https://tfw.space/

Product prices, global certification promises and unverified Vietnam availability are not added. Images are product or family references; check the actual regional specification.

Known official browser-cached Product Training content is upgraded to the new lesson and question bank. Customized lessons are preserved. Learner identities, finished-course timestamps and historical test snapshots are unchanged.

## Progress Overview

Lists all learners with available attempts by default, with an All learners option. Shows course completion, academy and previous course attempt counts, latest result, best academy score, first passing academy test, six-month retest, status and full individual histories. Pass thresholds stored in historical attempts are respected; previous course passes do not become academy passes. Retests count only on or after the due date. All six courses and a valid retest are required for 100% completion.

CSV exports include all available learner summaries or all available attempts, regardless of on-screen filters. Formula-like CSV cells are escaped. Backup import supports multiple current academy JSON backups, validates records, merges by learner ID, deduplicates attempts and rejects conflicting identities/results without partially importing. Existing content and records are retained. Names with different IDs are not automatically combined.

Data scope is explicitly browser-local plus imported backups. Tests taken on other devices cannot appear automatically until shared storage is implemented. No learner data or fictional test results are committed to the public site.

Direct links: `/#products` and `/#progress`.

## Checks

`node check-product-progress.cjs` verifies reference and question coverage, safe migration, customized-content preservation, historical attempts, retest dates, all-person reporting, deduplication, conflict rejection and CSV escaping. Existing academy checks continue to validate 4/6 unlocking, twenty questions, 70% passing and six-month retests.

Learner names: required full-name entry with confirmation, correction on existing learner IDs without changing results, and name confirmation before each academy test. Names appear on quiz results and progress exports.
