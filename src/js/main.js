/**
 * Main - Entry point for IME v3.0
 * Initializes the game engine when page loads
 */

let game;

// Initialize game when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
    console.log('='.repeat(60));
    console.log('IME v3.0 - Integrated Multiverse Engine');
    console.log('Based on NEXUS HUB 2.4');
    console.log('Agent Development Build - Playtest Mode');
    console.log('='.repeat(60));
    
    // Initialize game engine
    try {
        game = new GameEngine();
        console.log('✓ Game engine initialized successfully');
    } catch (error) {
        console.error('✗ Failed to initialize game engine:', error);
        showError('Failed to start game. Check console for details.');
    }
});

/**
 * Show error message to user
 */
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #aa3232;
        color: #e0f8d0;
        padding: 20px;
        border: 3px solid #8bac0f;
        border-radius: 8px;
        font-family: 'Courier New', monospace;
        font-size: 14px;
        z-index: 10000;
        max-width: 400px;
        text-align: center;
    `;
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
}

// Handle page visibility changes (pause/resume)
document.addEventListener('visibilitychange', () => {
    if (game) {
        if (document.hidden) {
            console.log('Game paused (tab hidden)');
            game.running = false;
        } else {
            console.log('Game resumed (tab visible)');
            game.running = true;
            game.loop();
        }
    }
});

// Global error handler
window.addEventListener('error', (event) => {
    console.error('Global error caught:', event.error);
    showError('An error occurred. Check console for details.');
});

// Console welcome message
console.log(`
╔════════════════════════════════════════════════════════════╗
║           WELCOME TO THE INTEGRATED MULTIVERSE             ║
║                      ENGINE (IME) v3.0                     ║
╠════════════════════════════════════════════════════════════╣
║  Architect: Precog                                         ║
║  Development: Master Agent Team                            ║
║  Status: PLAYTEST BUILD                                    ║
╠════════════════════════════════════════════════════════════╣
║  Controls:                                                 ║
║    WASD / Arrow Keys - Move                                ║
║    F - Toggle Resolution                                   ║
║    P - Portal Jump (enter seed)                            ║
║    V - Vault (NEXUS only)                                  ║
║    ESC - Return to NEXUS                                   ║
╠════════════════════════════════════════════════════════════╣
║  Features:                                                 ║
║    • Seed-based procedural dungeon generation              ║
║    • NEXUS hub with starfield                              ║
║    • Local storage persistence                             ║
║    • Gold collection system                                ║
║    • Entropy collection (for crypto integration)           ║
╠════════════════════════════════════════════════════════════╣
║  Try these seeds:                                          ║
║    FOREST-001, CAVES-001, RUINS-001, TEST-123              ║
╚════════════════════════════════════════════════════════════╝
`);

// Development helpers (accessible from console)
window.IME = {
    game: () => game,
    player: () => game ? game.player : null,
    world: () => game ? game.currentWorld : null,
    
    // Debugging functions
    resetPlayer: () => {
        if (game && game.player) {
            game.player.reset();
            console.log('Player data reset');
            game.updateUI();
        }
    },
    
    addGold: (amount) => {
        if (game && game.player) {
            game.player.addGold(amount);
            console.log(`Added ${amount} gold`);
            game.updateUI();
        }
    },
    
    jumpToWorld: (seed) => {
        if (game) {
            game.loadWorld(seed);
            console.log(`Jumped to world: ${seed}`);
        }
    },
    
    getStats: () => {
        if (game && game.player) {
            return game.player.getStats();
        }
        return null;
    },
    
    toggleDebug: () => {
        const debugPanel = document.getElementById('debug-panel');
        debugPanel.style.display = debugPanel.style.display === 'none' ? 'block' : 'none';
    },
    
    help: () => {
        console.log(`
IME Development Console Commands:
----------------------------------
IME.game()           - Get game engine instance
IME.player()         - Get player instance
IME.world()          - Get current world
IME.resetPlayer()    - Reset player data
IME.addGold(amount)  - Add gold to player
IME.jumpToWorld(seed) - Jump to specific world
IME.getStats()       - Get player stats
IME.toggleDebug()    - Show/hide debug panel
IME.help()           - Show this help
        `);
    }
};

console.log('💡 Tip: Type "IME.help()" in console for development commands');
