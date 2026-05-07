# FrontendForDemoTesting

This is a demo portfolio website used to test the **FrontPR** scanner.

Live site: https://brave-pond-0eeb5f910.7.azurestaticapps.net

FrontPR is a tool that automatically scans a website for accessibility issues every time a Pull Request is opened on GitHub. It posts a comment directly on the PR with a list of what needs to be fixed.

---

## What is a Pull Request?

A Pull Request (PR) is how developers propose changes to a project. Instead of changing the code directly, you create a separate "branch" (a copy of the project), make your changes there, and then open a PR to say "hey, I'd like to merge these changes into the main project." Other people can review it before it goes live.

FrontPR hooks into this process — the moment a PR is opened, the scanner runs automatically.

---

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
