# Ergo Academy

English training and assessments for Ergoers.

Live academy: https://ergoers-training-academy.phuc-ngovh.chatgpt.site/

## Courses

1. Corporate Culture
2. Operation Process, including email communication
3. General Market
4. Costing, with the original daily Excel template
5. Product Training, including Milliken carpet tiles
6. Introductory Project Management

The core path runs through Costing. Product Training and Project Management unlock independently after the initial Costing pass.

## Learning and tests

Open and finish the lesson, acknowledge completion, then mark learning complete to unlock its initial test. Each course has 35 questions. Each assessment draws 30 distinct random questions. At least 21 correct answers (70%) passes. A retest is due six calendar months after the initial pass. Passing that retest at 70% marks the course 100% complete.

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

The checks cover all six courses, learning prerequisites, failing/passing boundaries, random draws, persistence and retest completion using a simulated clock. Test records remain inside the test process.

## Records and content

Learners, progress, attempts and local content edits are stored in the browser's local storage. Export backups from Progress. This pilot has no shared HR database, identity-bound learner records, protected instructor roles or secure exam delivery. Public visitors can view content and question-bank source.

Product lessons reference Ergovn.com and official maker pages. Technical, regional and commercial inputs must be confirmed for the selected product. The original Excel template is provided unchanged and contains known broken references at General!E10 and HAD!AM14, identified in the Costing lesson.

Source materials and third-party product images retain their original ownership. No additional license to third-party material is granted by this repository.
