# IME v3.0 - Integrated Multiverse Engine

**A seed-based procedural metaverse gaming platform**

## Overview

The Integrated Multiverse Engine (IME) is a GBC-style retro game engine that generates unique, persistent worlds from cryptographic seeds. Built with HTML5/Canvas and JavaScript, it features procedural dungeon generation, a central NEXUS hub, and planned cryptographic wallet integration.

### Current Version: 3.0.0-alpha (Playtest Build)
**Base**: NEXUS HUB 2.4  
**Status**: Active Development with AI Agent Team  
**Architect**: Precog

## Features

### ✅ Implemented (v3.0.0-alpha)
- **Procedural Dungeon Generation**: Seed-based world creation using xmur3a & sfc32 RNG
- **NEXUS Hub**: Central hub with animated starfield background
- **Portal Jumping**: Travel between worlds via seed input
- **Grid-Based Movement**: Smooth WASD/Arrow key controls
- **GBC-Style Graphics**: 10-color retro palette with pixel-perfect rendering
- **Dual Resolution**: Toggle between Retro (160x144) and Modern (256x144)
- **Local Persistence**: Player data saved to localStorage
- **Gold Collection**: Treasure system with persistent gold counter
- **Vault System**: Secure storage in NEXUS hub
- **Entropy Collection**: Movement tracking for future crypto integration
- **Debug Panel**: Real-time FPS, position, and tile information

### 🚧 In Development
- Enhanced dungeon variety (biomes, themes)
- Enemy AI and combat system
- Improved treasure and loot variety
- Cryptographic wallet integration
- Fourier transform-based behavior analysis
- Blockchain integration (Solana)
- Multiplayer NEXUS social hub

## Quick Start

### For Precog (Playtesting)

1. **Open the game**:
   ```
   Double-click index.html or open in browser
   ```

2. **Play**:
   - Move with WASD or Arrow Keys
   - Press P to Portal Jump
   - Try seeds: `FOREST-001`, `CAVES-001`, `RUINS-001`
   - Press ESC to return to NEXUS

3. **Full instructions**: See `HOW_TO_RUN.md`

4. **Report feedback**: Use `playtest-feedback/PLAYTEST_TEMPLATE.md`

### For AI Agents (Development)

1. **Review project structure**:
   ```
   /src/js/        - Game engine code
   /src/css/       - Styling
   /docs/          - Documentation
   /archive/       - Development history
   ```

2. **Read documentation**:
   - `KNOWLEDGE_BASE.md` - Project context
   - `AGENT_ROLES.md` - Your role definition
   - `PROJECT_SEED.md` - Project evolution
   - `COMMUNICATION_PROTOCOL.md` - Inter-agent messaging

3. **Understand the seed**: Review .rts archives when available

4. **Begin work**: Follow your agent role tasks

## Project Structure

```
testnets/
├── index.html                      # Main entry point
├── HOW_TO_RUN.md                  # Playtesting guide
├── README.md                      # This file
│
├── src/
│   ├── css/
│   │   └── style.css              # GBC-style styling
│   └── js/
│       ├── rng.js                 # Seeded RNG (xmur3a & sfc32)
│       ├── world-generator.js     # Procedural dungeon generation
│       ├── renderer.js            # Canvas rendering
│       ├── player.js              # Player state & movement
│       ├── game-engine.js         # Main game loop
│       └── main.js                # Initialization
│
├── archive/
│   ├── README.md                  # Archive documentation
│   ├── rts-development/           # .rts conversation archives
│   └── versions/                  # Historical builds
│
├── playtest-feedback/
│   ├── PLAYTEST_TEMPLATE.md       # Feedback form template
│   └── [session files]            # Precog's playtest reports
│
├── docs/                          # Additional documentation
│
└── Master Agent System/
    ├── MASTER_AGENT.md            # Master Agent definition
    ├── MASTER_AGENT_INIT.md       # One-click agent deployment
    ├── KNOWLEDGE_BASE.md          # Project knowledge & roadmap
    ├── AGENT_ROLES.md             # 10 specialized agent roles
    ├── COMMUNICATION_PROTOCOL.md  # Inter-agent messaging
    ├── CONSENSUS_COUNCIL.md       # Decision-making framework
    ├── PROJECT_SEED.md            # Project evolution document
    └── master_agent_diagnostics.py # Diagnostic system
```

## Development Workflow

### Precog's Role (Human-in-the-Loop)
1. **Playtest** new builds
2. **Provide feedback** via templates
3. **Approve/Reject** agent proposals
4. **Set priorities** for development
5. **Share resources** (.rts archives, ideas, etc.)
6. **Make key decisions** when agents need guidance

### AI Agent Team Role
1. **Review feedback** from Precog
2. **Implement features** per agent specialization
3. **Fix bugs** identified in playtesting
4. **Collaborate** through consensus councils
5. **Document** all changes
6. **Create** new playtest builds

### Iteration Cycle
```
Precog Tests → Provides Feedback → Agents Review → 
Agents Develop → New Build → Precog Tests → ...
```

## Technical Details

### Core Technologies
- **HTML5 Canvas** - Rendering
- **JavaScript (ES6+)** - Game logic
- **CSS3** - UI styling
- **LocalStorage** - Persistence

### Key Algorithms
- **xmur3a**: Hash function for seed generation
- **sfc32**: Simple Fast Counter PRNG
- **Drunkard's Walk**: Dungeon corridor generation
- **Room-based Generation**: Non-overlapping room placement

### Graphics
- **Palette**: 10-color GBC-inspired
- **Rendering**: Pixel-perfect (image-rendering: pixelated)
- **Tile Size**: 8x8 pixels
- **Map Size**: 64x36 tiles

## World Seeds

The engine uses seeds to generate deterministic worlds:
- `NEXUS-HUB-001` - Starting hub (no dungeon, starfield)
- `FOREST-001` - Forest-themed dungeon
- `CAVES-001` - Cave system
- `RUINS-001` - Ancient ruins
- `TEST-123` - Test world
- **Any string** - Custom unique world

## Console Commands

Open browser console (F12) and try:
```javascript
IME.help()                    // List all commands
IME.getStats()                // Player statistics
IME.addGold(1000)             // Add gold (testing)
IME.jumpToWorld('MY-SEED')    // Jump to seed
IME.resetPlayer()             // Reset save data
IME.toggleDebug()             // Toggle debug panel
```

## Development Phases

### Phase 0: Foundation ✅
- Master Agent system created
- Project structure established
- Initial playable build (v3.0.0-alpha)

### Phase 1: Core Enhancement (Weeks 1-4)
- Debug and polish existing features
- Enhanced procedural generation
- More dungeon variety
- Enemy AI basics

### Phase 2: Cryptography (Weeks 5-8)
- Wallet system using soulSeed
- Entropy collection from gameplay
- Fourier transform behavior analysis
- Wallet evolution mechanics

### Phase 3: Polish & Expansion (Weeks 9-12)
- Complete GBC visual overhaul
- UI enhancements
- Social systems planning
- More gameplay variety

### Phase 4: Blockchain (Weeks 13-16)
- Solana integration
- NFT items
- Token economy
- Smart contracts

### Phase 5: Metaverse (Weeks 17-20)
- Multiplayer NEXUS
- Social features
- Community systems
- Full platform launch

## Contributing

### For Precog
- Playtest regularly
- Provide detailed feedback
- Share .rts archives
- Guide vision and priorities

### For AI Agents
- Follow communication protocol
- Respect agent roles
- Collaborate through councils
- Document all work
- Reference archives before changes

## License

TBD (To be determined by Precog)

## Contact

**Project Architect**: Precog  
**Repository**: https://github.com/precog888/testnets

## Acknowledgments

- Original concept and development: Precog
- Initial rapid prototyping: Google Gemini 2.5 Flash
- Ongoing development: Master Agent AI Team
- Based on: NEXUS HUB 2.4 specification

---

**Version**: 3.0.0-alpha  
**Last Updated**: 2025-11-06  
**Status**: Active Playtest Build - Ready for Feedback

🎮 **Start playing**: Open `index.html`  
📖 **Need help**: Read `HOW_TO_RUN.md`  
📝 **Give feedback**: Use `playtest-feedback/PLAYTEST_TEMPLATE.md`
