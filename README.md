# Ergoers Road Map

English training and assessments for Ergoers.

Live academy: https://ergoers-training-roadmap.vercel.app/

Product Training: https://ergoers-training-roadmap.vercel.app/#products

Progress Overview: https://ergoers-training-roadmap.vercel.app/#progress

## Courses

1. Corporate Culture
2. Operation Process, including email communication
3. General Market
4. Costing, with a multi-product landed-cost calculator and the original daily Excel template
5. Product Training, including Framery, Wintech/WINPOD, Zenith, thefirstworkshop and Milliken carpet tiles
6. Introductory Project Management

Learners may study the six courses freely. After finishing a course, click Finished to record it.

## Learning and tests

Finish any four of the six courses to unlock one academy test. The test draws 20 distinct random questions, balanced across the courses marked Finished. At least 14 correct answers (70%) passes. Five courses contribute 35-question banks; the expanded Product Training bank has 55 questions. A retest is due six calendar months after the initial academy pass and also requires 70%. Finishing all six courses and passing the retest marks the academy 100% complete.

Prior attempts retain their original passing threshold. New attempts record their threshold and a snapshot of the questions.

## Run locally

This is a dependency-free browser application. Serve `web/` with a local HTTP server, for example:

```sh
python -m http.server 8765 --directory web
```

Open http://localhost:8765/.

Run the automated checks with Node.js:

```sh
npm test
```

The checks cover the four-course eligibility gate, random questions drawn only from finished courses, 13/20 failing and 14/20 passing, saved history and retest completion using a simulated clock. Test records remain inside the test process.

## Records and content

Learners, progress, attempts and local content edits are stored in the browser's local storage. Export backups from Progress. This pilot has no shared HR database, identity-bound learner records, protected instructor roles or secure exam delivery. Public visitors can view content and question-bank source.

Progress Overview reports all available learners and attempts, supports CSV exports and combines current learner backups without replacing lessons or existing records. Cross-device records do not synchronize automatically.

Product lessons reference Ergovn.com, official maker pages and tfw.space. Technical, regional and commercial inputs must be confirmed for the selected product. The original Excel template is provided unchanged and contains known broken references at General!E10 and HAD!AM14, identified in the Costing lesson.

Source materials and third-party product images retain their original ownership. No additional license to third-party material is granted by this repository.
