# Debt Quest Combat Rebuild v3 — Standalone Prototype

Deploy `index.html`, `engine.js`, and `combat.js` together to a **separate** GitHub Pages test repository. Do not overwrite the main Debt Quest application. No localStorage, network requests, or real financial data are used.

## Changes
- Discontinued the defective 12-frame extracted concept atlas.
- Built a resolution-independent SVG character rig with articulated shoulders and attached blades. This is clean vector placeholder art, **not** the final detailed pixel-art asset.
- Attack uses eased approach, anticipation, swing, timed contact, recoil, recovery, and return.
- Damage is triggered once at the defined swing contact threshold; the battle rules independently cap hit counts.
- Twin Blade uses two separate hit events. Defend, guard break, victory, defeat, and reset supported.
- Reset invalidates old animation frames and pending enemy turns via generation token.
- Background is drawn without any text contamination.

## Known limitations
- Artwork is a simple vector rig rather than the requested premium cinematic pixel art.
- Contact is authored to a choreography point, not true blade geometry collision.
- Not verified in an interactive iPhone browser; requires hands-on test before production integration.
- Enemy attack remains a simple lunge and needs its own art and animation polish.

## Tests
Run `node test-engine.cjs` and `node --check combat.js`.
