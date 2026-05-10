# FrontendForDemoTesting

Demo-portfolio-sajt som används för att testa **FrontPR** — ett verktyg som automatiskt skannar webbplatser för tillgänglighetsproblem (a11y) vid varje Pull Request.

**Live:** https://brave-pond-0eeb5f910.7.azurestaticapps.net

---

## Hur FrontPR-scannern fungerar

När en PR öppnas i det här repot körs FrontPR-scannern automatiskt i **två faser**:

### Fas 1 — Statisk kodanalys (~5 sekunder)
- Analyserar JSX/TSX-källkod med `eslint-plugin-jsx-a11y`
- Hittar buggar med exakt **fil- och radnummer**
- Blockerar merge om allvarliga fel hittas (errors)

### Fas 2 — Runtime-skanning (~1-3 minuter)
- Öppnar en riktig Chrome-browser (osynlig) via Playwright
- Besöker live-sajten
- Kör **axe-core** — kontrollerar kontrast, ARIA-roller, saknade labels m.m.
- Jämför med föregående scan och visar vad som är nytt/fixat

### Resultat
Resultaten postas direkt på PR:n som:
- **GitHub Check Runs** (grön/röd status i PR-gränssnittet)
- **PR-kommentar** med sammanfattning av static + runtime-fynd

Och lagras i FrontPR-dashboarden för historik och trend-analys.

---

## Intentionella buggar i detta repo

Sajten innehåller medvetna a11y-problem för att verifiera att scannern fungerar:

- `<img>` utan `alt`-attribut
- Formulärfält utan `<label>`
- `<div>` med `onClick` (ej semantisk knapp)
- `<button>` utan synlig text
- Låg kontrast: grå text `#cccccc` på grå bakgrund `#f0f0f0`

**Rör inte dessa — de ska vara kvar.**

---

## Lägg till FrontPR i ett nytt repo

Skapa `.github/workflows/frontpr.yml`:

```yaml
name: FrontPR Scan

on:
  pull_request:

jobs:
  scan:
    runs-on: ubuntu-latest
    permissions:
      pull-requests: write
      checks: write
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Run FrontPR Scanner
        uses: carl773/FrontPR/github-action@main
        with:
          target_url: https://DIN-SAJT-HÄR.com
          api_key: ${{ secrets.FRONTPR_API_KEY }}
```

Lägg till `FRONTPR_API_KEY` som GitHub Secret (hämtas från FrontPR-dashboarden).

---

## Trigga en testskan

```bash
git checkout -b test/skanna-detta
# Gör en liten ändring i src/App.tsx
git add . && git commit -m "test"
git push origin test/skanna-detta
```

Öppna en PR på GitHub — scannern startar automatiskt.
