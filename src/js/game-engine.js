/**
 * Game Engine - Main game loop and state management
 */

class GameEngine {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.renderer = new Renderer(this.canvas);
        this.player = new Player();
        
        // Current world
        this.currentSeed = 'NEXUS-HUB-001';
        this.currentWorld = null;
        
        // Game state
        this.running = false;
        this.lastFrameTime = 0;
        this.fps = 0;
        this.frameCount = 0;
        this.fpsUpdateTime = 0;
        
        // Input
        this.keys = {};
        this.setupInput();
        
        // UI elements
        this.setupUI();
        
        // Initialize
        this.init();
    }
    
    /**
     * Initialize game
     */
    init() {
        // Load NEXUS hub
        this.loadWorld('NEXUS-HUB-001');
        
        // Start game loop
        this.running = true;
        this.loop();
        
        console.log('IME v3.0 initialized');
        console.log('Soul Seed:', this.player.soulSeed);
    }
    
    /**
     * Load a world by seed
     */
    loadWorld(seed) {
        this.currentSeed = seed;
        const generator = new WorldGenerator(seed);
        this.currentWorld = generator.generate();
        
        // Set player position
        if (this.currentWorld.spawnPoint) {
            this.player.setPosition(
                this.currentWorld.spawnPoint.x,
                this.currentWorld.spawnPoint.y
            );
        }
        
        // Update UI
        this.updateUI();
        
        console.log(`Loaded world: ${seed}`);
    }
    
    /**
     * Main game loop
     */
    loop(timestamp = 0) {
        if (!this.running) return;
        
        // Calculate delta time
        const deltaTime = timestamp - this.lastFrameTime;
        this.lastFrameTime = timestamp;
        
        // Update FPS counter
        this.updateFPS(timestamp);
        
        // Update game state
        this.update(deltaTime);
        
        // Render
        this.render();
        
        // Continue loop
        requestAnimationFrame((t) => this.loop(t));
    }
    
    /**
     * Update FPS counter
     */
    updateFPS(timestamp) {
        this.frameCount++;
        if (timestamp - this.fpsUpdateTime >= 1000) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.fpsUpdateTime = timestamp;
            document.getElementById('fps').textContent = this.fps;
        }
    }
    
    /**
     * Update game state
     */
    update(deltaTime) {
        // Handle input
        this.handleInput();
        
        // Update starfield if in NEXUS
        if (this.currentWorld && this.currentWorld.isNexus) {
            this.renderer.updateStarfield();
        }
        
        // Update UI
        this.updateDebugInfo();
    }
    
    /**
     * Handle player input
     */
    handleInput() {
        // Movement
        let dx = 0;
        let dy = 0;
        
        if (this.keys['ArrowUp'] || this.keys['w'] || this.keys['W']) dy = -1;
        if (this.keys['ArrowDown'] || this.keys['s'] || this.keys['S']) dy = 1;
        if (this.keys['ArrowLeft'] || this.keys['a'] || this.keys['A']) dx = -1;
        if (this.keys['ArrowRight'] || this.keys['d'] || this.keys['D']) dx = 1;
        
        // Only one direction at a time for grid-based movement
        if (dx !== 0 && dy !== 0) {
            // Prioritize vertical movement
            dx = 0;
        }
        
        if (dx !== 0 || dy !== 0) {
            this.player.move(dx, dy, this.currentWorld);
        }
    }
    
    /**
     * Render game
     */
    render() {
        this.renderer.clear();
        
        if (this.currentWorld) {
            if (this.currentWorld.isNexus) {
                this.renderer.renderNexus();
            } else {
                this.renderer.renderDungeon(this.currentWorld, this.player);
            }
        }
        
        // Render HUD
        if (!this.currentWorld || !this.currentWorld.isNexus) {
            this.renderer.renderHUD(this.player);
        }
    }
    
    /**
     * Setup input handlers
     */
    setupInput() {
        // Keyboard
        window.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            
            // Special keys
            if (e.key === 'f' || e.key === 'F') {
                const mode = this.renderer.toggleResolution();
                console.log(`Resolution: ${mode}`);
            }
            
            if (e.key === 'p' || e.key === 'P') {
                this.showPortalModal();
            }
            
            if (e.key === 'v' || e.key === 'V') {
                if (this.currentWorld && this.currentWorld.isNexus) {
                    this.showVaultModal();
                }
            }
            
            if (e.key === 'Escape') {
                this.returnToNexus();
            }
        });
        
        window.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
    }
    
    /**
     * Setup UI elements
     */
    setupUI() {
        // Portal jump
        document.getElementById('portal-jump-btn').addEventListener('click', () => {
            const seed = document.getElementById('seed-input').value.trim();
            if (seed) {
                this.loadWorld(seed);
                this.hidePortalModal();
            }
        });
        
        document.getElementById('portal-cancel-btn').addEventListener('click', () => {
            this.hidePortalModal();
        });
        
        // Seed suggestions
        document.querySelectorAll('.seed-suggestion').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const seed = e.target.getAttribute('data-seed');
                document.getElementById('seed-input').value = seed;
            });
        });
        
        // Vault
        document.getElementById('vault-close-btn').addEventListener('click', () => {
            this.hideVaultModal();
        });
        
        // Close modals on ESC
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hidePortalModal();
                this.hideVaultModal();
            }
        });
    }
    
    /**
     * Update UI displays
     */
    updateUI() {
        const stats = this.player.getStats();
        document.getElementById('soul-seed').textContent = stats.soulSeed.substring(0, 20) + '...';
        document.getElementById('gold').textContent = stats.gold;
        document.getElementById('current-world').textContent = 
            this.currentWorld && this.currentWorld.isNexus ? 'NEXUS' : this.currentSeed;
    }
    
    /**
     * Update debug info
     */
    updateDebugInfo() {
        document.getElementById('position').textContent = 
            `${Math.floor(this.player.x)}, ${Math.floor(this.player.y)}`;
        
        if (this.currentWorld && !this.currentWorld.isNexus) {
            const tile = this.currentWorld.getTile(
                Math.floor(this.player.x), 
                Math.floor(this.player.y)
            );
            document.getElementById('current-tile').textContent = tile;
            
            // Find which room player is in
            let inRoom = 'None';
            for (let i = 0; i < this.currentWorld.rooms.length; i++) {
                const room = this.currentWorld.rooms[i];
                if (this.player.x >= room.x && this.player.x < room.x + room.width &&
                    this.player.y >= room.y && this.player.y < room.y + room.height) {
                    inRoom = `Room ${i + 1}`;
                    break;
                }
            }
            document.getElementById('current-room').textContent = inRoom;
        } else {
            document.getElementById('current-tile').textContent = '-';
            document.getElementById('current-room').textContent = '-';
        }
    }
    
    /**
     * Show portal jump modal
     */
    showPortalModal() {
        document.getElementById('portal-modal').classList.remove('hidden');
        document.getElementById('seed-input').focus();
    }
    
    /**
     * Hide portal jump modal
     */
    hidePortalModal() {
        document.getElementById('portal-modal').classList.add('hidden');
        document.getElementById('seed-input').value = '';
    }
    
    /**
     * Show vault modal
     */
    showVaultModal() {
        const vaultContents = document.getElementById('vault-contents');
        if (this.player.vault.length === 0) {
            vaultContents.innerHTML = '<p>Vault is empty</p>';
        } else {
            vaultContents.innerHTML = '<ul>' + 
                this.player.vault.map(item => `<li>${item}</li>`).join('') +
                '</ul>';
        }
        document.getElementById('vault-modal').classList.remove('hidden');
    }
    
    /**
     * Hide vault modal
     */
    hideVaultModal() {
        document.getElementById('vault-modal').classList.add('hidden');
    }
    
    /**
     * Return to NEXUS hub
     */
    returnToNexus() {
        if (!this.currentWorld || !this.currentWorld.isNexus) {
            this.loadWorld('NEXUS-HUB-001');
        }
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GameEngine };
}
