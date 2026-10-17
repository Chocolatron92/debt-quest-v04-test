# Debt Quest — Combat Loop Lab (audited revision)

Standalone prototype only. No financial data is read, written, or modified. Upload the CONTENTS of this folder to a separate GitHub Pages test repository, not the main Debt Quest app.

## Fixes in this revision
- Attack contacts are recorded by the deterministic battle engine, once per intended hit (one for Attack, two for Twin-Blade Art).
- Each hit decreases enemy HP and creates an event containing actual applied damage (capped by remaining HP).
- Focus costs and gains, guard break, defended damage, victory, defeat, and turn transitions are validated in `test-engine.cjs`.
- Input is locked outside the ready phase; reset invalidates all running asynchronous animations and delayed enemy-recoil callbacks.
- Guard break skips one enemy retaliation; a win ends combat before the enemy acts.

## Verification
Run `node test-engine.cjs` to execute 10 passing deterministic rule tests. `node --check engine.js` and `node --check combat.js` pass. Browser automation was attempted but this environment blocked browser navigation, so real Safari/iPhone rendering and end-to-end interaction remain UNVERIFIED. Do not call this a flawless or production-ready combat loop yet.

## Known limitations
- Contact is keyed to animation frame 6, not geometric blade collision.
- Character art remains sourced from blurry, imperfect concept illustrations.
- Enemy attack uses simple movement, not a frame-by-frame animation.
- This is not integrated with the main Debt Quest battle engine.
