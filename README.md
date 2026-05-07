# FrontendForDemoTesting

This is a demo portfolio website used to test the **FrontPR** scanner.

Live site: https://brave-pond-0eeb5f910.7.azurestaticapps.net

FrontPR is a tool that automatically scans a website for accessibility issues every time a Pull Request is opened on GitHub. It posts a comment directly on the PR with a list of what needs to be fixed.

## How the scanner works

When a PR is opened in this repo, GitHub automatically runs a job called **FrontPR Scan**. Here is what happens step by step:

1. GitHub spins up a temporary computer in the cloud
2. That computer downloads the FrontPR scanner from [github.com/carl773/FrontPR](https://github.com/carl773/FrontPR)
3. The scanner opens a real Chrome browser (invisible, running in the background)
4. It visits the live website
5. It runs an accessibility tool called **axe** on the page
6. axe checks for things like: missing image descriptions, form fields without labels, text that is too low contrast to read, buttons without names, and more
7. The results are saved to a file called `scanner-output.json`
8. The scanner posts a comment on the PR with a summary of all issues found

The whole thing takes about 2-3 minutes.

---

## How to add FrontPR to a new repo

If you want to add the FrontPR scanner to a different project, follow these steps.

### Step 1 — Go to the repo on GitHub.com

Open the repository you want to add scanning to.

### Step 2 — Click the "Actions" tab

You will see a page with suggested workflows. Scroll down and click **"set up a workflow yourself"**.

### Step 3 — Delete everything in the editor

The editor will have some default content. Delete all of it.

### Step 4 — Paste this in

```yaml
name: FrontPR Scan

on:
  pull_request:

jobs:
  scan:
    runs-on: ubuntu-latest
    permissions:
      pull-requests: write
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Run FrontPR Scanner
        uses: carl773/FrontPR/github-action@main
        with:
          target_url: https://YOUR-SITE-URL-HERE.com
```

**Important:** Replace `https://YOUR-SITE-URL-HERE.com` with the actual URL of your live website.

### Step 5 — Commit the file

Click **"Commit changes"** in the top right corner. Commit directly to `main`.

That's it. From now on, every Pull Request in that repo will automatically trigger the FrontPR scanner.

---

## How to trigger a scan (open a test PR)

1. In VS Code, open a terminal in the project folder and run:
   ```
   git checkout -b test/my-test-branch
   ```
2. Make any small change to any file (even just changing a word in `src/App.tsx`)
3. Save the file, then run:
   ```
   git add .
   git commit -m "test scan"
   git push origin test/my-test-branch
   ```
4. Go to the repo on GitHub.com — you will see a yellow banner saying **"Compare & pull request"**
5. Click it and open the PR
6. Wait 2-3 minutes — the FrontPR Scan job will run and post a comment on the PR

---

## What the comment looks like

If issues are found:

```
FrontPR Accessibility Scan

Target: https://your-site.com
Issues found: 4

| Severity | Rule            | What to fix                                  |
|----------|-----------------|----------------------------------------------|
| SERIOUS  | image-alt       | Ensures img elements have alternate text     |
| MODERATE | label           | Ensures every form element has a label       |
```

If no issues are found:

```
FrontPR Accessibility Scan

Target: https://your-site.com

No accessibility issues found. All clear!
```

---

## The FrontPR scanner repo

The scanner itself lives at [github.com/carl773/FrontPR](https://github.com/carl773/FrontPR).

It contains two folders:

- **`scanner/`** — The actual scanning code. Written in TypeScript. Opens a browser, visits the URL, runs axe, and saves the results.
- **`github-action/`** — The wrapper that makes the scanner installable as a GitHub Action. When you write `uses: carl773/FrontPR/github-action@main` in a workflow file, this is what GitHub downloads and runs.

You do not need to touch that repo to use FrontPR. It is only relevant if you want to change how the scanner works.





---

## This is V0 — what works and what doesn't yet

This version proves the core idea works. When a PR is opened, the scanner runs, visits the live site, and posts a comment with the findings. That's the whole loop — and it works.

But V0 has known limitations that we already understand and will fix in V1 and V2. Here's an honest breakdown:

### Problem 1 — The scanner scans the wrong version of the site

**What happens now:** When you open a PR, the scanner visits the live production URL (the Azure site). But the PR hasn't been merged yet, so the live site still shows the old code. The scanner is not scanning the changes from the PR — it's scanning whatever was last deployed.

**Why it works for V0:** It still proves the scanning works and the comment posts correctly. For demo purposes, the site already has known accessibility issues baked in, so findings will always show up.

**The V1 fix:** Use Azure Static Web Apps preview URLs. Azure automatically creates a temporary URL for every PR, like `https://brave-pond-0eeb5f910-pr-5.azurestaticapps.net`. The scanner should point at that URL instead of production. This way it scans exactly what's in the PR, not the live site.

---

### Problem 2 — The scanner only checks what axe can see in the browser

**What happens now:** The scanner opens Chrome, loads the page, and runs axe on whatever is rendered. This catches runtime accessibility issues — things that exist in the final HTML that the user actually sees.

**What it misses:** Issues in the source code that axe can't detect. For example: components that are written incorrectly but don't show up on this particular page, ARIA attributes that are wrong in the code but happen to render okay, or issues that only appear on certain screen sizes or interactions.

**The V1/V2 fix:** Add a second layer of scanning that analyzes the raw source code directly — without opening a browser. Tools like ESLint with accessibility plugins (`eslint-plugin-jsx-a11y`) can catch issues at the code level before the page even renders. The full picture is: code-level scan + browser scan combined.

---

### Problem 3 — One comment per scan, no history

**What happens now:** Every time the scan runs, it posts a new comment. If you push 3 commits to the same PR, you get 3 separate comments. There is no tracking of whether issues were fixed between scans.

**The V1 fix:** Keep track of the previous scan result. If a re-scan finds fewer issues, update the comment to show what was fixed. This requires storing scan history somewhere — which leads into the backend and database work.

---

### Problem 4 — No pass/fail status on the PR itself

**What happens now:** The scanner posts a comment but the PR can still be merged even if serious issues are found. GitHub has a concept called a "check" — a green or red status that can block merging. We're not using that yet.

**The V1 fix:** Use the GitHub Checks API to post a proper pass/fail status on the PR. If critical or serious issues are found, the merge button turns red and the PR is blocked until they are fixed.

---

### Problem 5 — No user accounts, no dashboard, no billing

**What happens now:** Anyone can copy the workflow file and use the scanner for free with no limits. There is no way to know who is using it, how many scans are running, or to charge for it.

**The V2 fix:** This is where the backend, database (Xano), and dashboard come in. Users sign up, get a project ID and API token, and the scanner sends results to our backend. This unlocks usage tracking, scan history, billing, and AI-powered fix suggestions.

---
