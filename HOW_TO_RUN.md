# How to Run and Test IME v3.0

## Quick Start (Local Testing)

### Step 1: Open the Game
1. Navigate to the project folder: `/home/runner/work/testnets/testnets/`
2. Open `index.html` in your web browser
   - **Recommended browsers**: Chrome, Firefox, Edge (modern versions)
   - Simply double-click `index.html` or drag it into your browser

### Step 2: You're Playing!
The game should load automatically and show:
- Left panel: Controls and stats
- Center: Game canvas (NEXUS hub starfield)
- Right panel: Debug information

## Controls

### Movement
- **WASD** or **Arrow Keys** - Move your character
- Movement is grid-based with a slight delay

### Special Actions
- **F** - Toggle between Retro (160x144) and Modern (256x144) resolution
- **P** - Open Portal Jump menu to enter a new world seed
- **V** - Open Vault (only works in NEXUS hub)
- **ESC** - Return to NEXUS hub from any dungeon

## Testing Workflow

### 1. Basic Movement Test
- Start in NEXUS (starfield background)
- Try moving with WASD or arrow keys
- Character should move smoothly across the starfield

### 2. Portal Jump Test
- Press **P** to open portal menu
- Try one of the suggested seeds:
  - `FOREST-001`
  - `CAVES-001`  
  - `RUINS-001`
  - `TEST-123`
- Click "Jump" button
- You should teleport to a procedurally generated dungeon

### 3. Dungeon Exploration
- Move around the dungeon
- Look for:
  - Rooms (light colored floor tiles)
  - Corridors connecting rooms
  - Treasures (small red squares) - walk over them to collect gold
  - Stairs (blue tiles with white centers)
- Check the boundary walls are 2 tiles thick (v2.4 fix)

### 4. Return to NEXUS
- Press **ESC** at any time
- You should return to the NEXUS hub starfield

### 5. Resolution Toggle
- Press **F** to switch resolutions
- Notice the canvas size change
- Pixels should remain crisp (not blurry)

### 6. Persistence Test
- Collect some gold in a dungeon
- Close the browser tab
- Reopen `index.html`
- Your gold amount should be saved

## What to Look For

### ✅ Good Signs
- FPS counter shows 60 (or close to it)
- Movement feels responsive
- Dungeons have varied layouts
- No visual glitches
- Gold persists between sessions
- All controls work as expected

### ⚠️ Issues to Report
- FPS drops below 30
- Movement feels sluggish or unresponsive
- Dungeons look boring or broken
- Player gets stuck in walls
- Treasures don't collect
- Controls don't work
- Any console errors (press F12 to see console)

## Browser Developer Tools

### Open Console (Important!)
- **Chrome/Edge**: Press `F12` or `Ctrl+Shift+J`
- **Firefox**: Press `F12` or `Ctrl+Shift+K`
- Check for any red error messages

### Development Commands
Type these in the console for testing:

```javascript
IME.help()              // Show all commands
IME.getStats()          // Show player stats
IME.addGold(1000)       // Add 1000 gold for testing
IME.jumpToWorld('MY-SEED')  // Jump to specific seed
IME.resetPlayer()       // Reset player data (careful!)
IME.toggleDebug()       // Hide/show debug panel
```

## Performance Testing

### Check FPS
- Look at the debug panel (right side)
- FPS should be 55-60
- If it drops below 30, note when it happens

### Resolution Performance
- Test both retro and modern modes
- Note if one performs better than the other

### Different Seeds
- Try multiple seeds
- Some might generate more complex dungeons
- Note if certain seeds cause performance issues

## Common Issues & Solutions

### Game Won't Load
- **Check console** for error messages
- Make sure all files are in correct locations:
  ```
  /index.html
  /src/css/style.css
  /src/js/*.js
  ```
- Try a different browser

### Controls Don't Work
- Click on the canvas to ensure it has focus
- Check if any modals are open (ESC to close)
- Refresh the page (F5)

### Visual Glitches
- Try toggling resolution with **F**
- Check if browser zoom is at 100%
- Try disabling browser extensions

### Performance Issues
- Close other browser tabs
- Check Task Manager/Activity Monitor
- Try the retro resolution mode (smaller canvas)

## Reporting Bugs

When you find a bug, note:

1. **What you were doing** - "I was exploring CAVES-001 and collected a treasure"
2. **What happened** - "The game froze"
3. **What should have happened** - "I should have gained gold and kept playing"
4. **Browser and OS** - "Chrome 120 on Windows 11"
5. **Console errors** - Copy any red error messages

Save this info in a playtest feedback file!

## Playtest Feedback

After testing, fill out a playtest feedback form:
1. Copy `playtest-feedback/PLAYTEST_TEMPLATE.md`
2. Rename it with date: `playtest-feedback/2025-11-06_session-01.md`
3. Fill out all sections
4. Save it for the agents to review

## Next Steps

After you test and provide feedback:
1. Agents will review your feedback
2. Bugs will be prioritized and fixed
3. Features will be evaluated and implemented
4. New version will be created
5. You test again!

This is an iterative cycle where your playtesting drives the development.

---

## Quick Reference Card

```
┌─────────────────────────────────────────────┐
│         IME v3.0 - Quick Reference          │
├─────────────────────────────────────────────┤
│ Movement:  WASD / Arrow Keys                │
│ Portal:    P                                │
│ Vault:     V (NEXUS only)                   │
│ Return:    ESC                              │
│ Resolution: F                               │
├─────────────────────────────────────────────┤
│ Console:   F12                              │
│ Help:      IME.help()                       │
│ Debug:     IME.toggleDebug()                │
└─────────────────────────────────────────────┘
```

Happy playtesting! 🎮
