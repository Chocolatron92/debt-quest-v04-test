# Debt Quest Combat v4 — Art-first combat test

This is a standalone GitHub Pages experiment. Upload the *contents* of this folder to a separate test repository root. It does not access financial storage, service workers, or the main game.

## What is real
- Detailed original Night Hunter and Coin Wraith illustration assets, rather than the geometric v3 placeholders.
- Animation-driven approach, contact-frame HP reduction, enemy recoil, return, retaliation, focus, guard, victory and defeat.
- A guarded combat state machine, one-hit-per-token protection, and reset generation invalidation.
- No canvas cropping: full transparent character images scale with `object-fit:contain`.

## What is not yet real
- The art is **single-pose**, not twelve clean, professionally illustrated body poses. A transform-based lunge is not frame-by-frame sword animation.
- No real blade collision polygons; contact is choreographed to the animation timeline.
- No live iPhone Safari visual verification was possible here.

## Test
Run `node test-engine.cjs` for the engine assertions. To run locally: `python -m http.server 8000`, then open http://localhost:8000.

The visible header is `DEBT QUEST · COMBAT v4`. Deploy separately from your saved financial application.
