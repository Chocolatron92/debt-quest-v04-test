# Debt Quest v0.7 — Sprite-sheet Combat Revamp

Deploy all **nine** files to the root of your existing GitHub Pages test repository. Do not upload only the ZIP. `hero-sprites.png` and `skeleton-sprites.png` are mandatory new files. The updated `battle.js` loads these actual six-frame PNG sheets and falls back to older procedural drawing if images fail to load.

## Changes
- Two original transparent 6-frame sprite sheets (idle, lunge, strike, hit, victory) with swords drawn in the hands.
- Cache version changed to `debt-quest-v07-assets` and battle script versioned with `?v=07`.
- Cancel delayed battle actions when leaving/restarting an encounter.
- Correct enemy damage-number bookkeeping.

## Limits
- This is a first original pixel-art asset pass, not studio-quality frame-by-frame animation or an Octopath asset reproduction.
- The selected character creator cosmetics do not yet affect the sprites.
- Financial information is saved locally; back up saves before deployment.
