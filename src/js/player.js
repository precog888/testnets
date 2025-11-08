/**
 * Player - Player character with movement and state management
 * Handles soulSeed, inventory, gold, and persistence
 */

class Player {
    constructor() {
        // Position
        this.x = 0;
        this.y = 0;
        
        // Stats
        this.gold = 0;
        this.soulSeed = this.generateSoulSeed();
        
        // Inventory and vault
        this.inventory = [];
        this.vault = [];
        
        // Movement
        this.speed = 1;
        this.moveDelay = 150; // ms between moves
        this.lastMoveTime = 0;
        
        // Load saved data
        this.load();
    }
    
    /**
     * Generate unique soul seed for player
     */
    generateSoulSeed() {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000000);
        return `SOUL-${timestamp}-${random}`;
    }
    
    /**
     * Set player position
     */
    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }
    
    /**
     * Move player by delta
     */
    move(dx, dy, world) {
        const now = Date.now();
        if (now - this.lastMoveTime < this.moveDelay) {
            return false;
        }
        
        const newX = this.x + dx;
        const newY = this.y + dy;
        
        // Check if move is valid
        if (this.canMoveTo(newX, newY, world)) {
            this.x = newX;
            this.y = newY;
            this.lastMoveTime = now;
            
            // Check for tile interactions
            this.checkTileInteraction(world);
            
            // Collect entropy from movement
            this.collectEntropyFromMovement(dx, dy);
            
            return true;
        }
        
        return false;
    }
    
    /**
     * Check if player can move to position
     */
    canMoveTo(x, y, world) {
        // In NEXUS, always can move (free roam)
        if (world.isNexus) {
            return true;
        }
        
        // Check bounds
        if (x < 0 || x >= world.map[0].length || y < 0 || y >= world.map.length) {
            return false;
        }
        
        // Check if tile is walkable
        return world.isWalkable(x, y);
    }
    
    /**
     * Check for tile interactions (treasures, stairs, etc.)
     */
    checkTileInteraction(world) {
        if (world.isNexus || !world.map) return;
        
        const tile = world.getTile(this.x, this.y);
        
        // Treasure
        if (tile === 5) { // TILES.TREASURE
            const goldAmount = Math.floor(Math.random() * 50) + 10;
            this.addGold(goldAmount);
            world.map[this.y][this.x] = 0; // Convert to floor
            
            // Show notification (would need UI system)
            console.log(`Found ${goldAmount} gold!`);
        }
    }
    
    /**
     * Collect entropy from player movement (for wallet evolution)
     */
    collectEntropyFromMovement(dx, dy) {
        // This will feed into cryptographic wallet system in Phase 2
        // For now, just track movement patterns
        const timestamp = Date.now();
        const entropyData = {
            dx,
            dy,
            timestamp,
            position: { x: this.x, y: this.y }
        };
        
        // Store in entropy buffer (to be implemented with crypto system)
        if (!this.entropyBuffer) {
            this.entropyBuffer = [];
        }
        this.entropyBuffer.push(entropyData);
        
        // Keep buffer at reasonable size
        if (this.entropyBuffer.length > 1000) {
            this.entropyBuffer.shift();
        }
    }
    
    /**
     * Add gold to player
     */
    addGold(amount) {
        this.gold += amount;
        this.save();
    }
    
    /**
     * Add item to inventory
     */
    addItem(item) {
        this.inventory.push(item);
        this.save();
    }
    
    /**
     * Store item in vault (NEXUS only)
     */
    storeInVault(item) {
        this.vault.push(item);
        this.inventory = this.inventory.filter(i => i !== item);
        this.save();
    }
    
    /**
     * Retrieve item from vault
     */
    retrieveFromVault(item) {
        this.inventory.push(item);
        this.vault = this.vault.filter(i => i !== item);
        this.save();
    }
    
    /**
     * Save player data to localStorage
     */
    save() {
        const saveData = {
            soulSeed: this.soulSeed,
            gold: this.gold,
            inventory: this.inventory,
            vault: this.vault,
            entropyBuffer: this.entropyBuffer || []
        };
        
        try {
            localStorage.setItem('ime_player_data', JSON.stringify(saveData));
        } catch (e) {
            console.error('Failed to save player data:', e);
        }
    }
    
    /**
     * Load player data from localStorage
     */
    load() {
        try {
            const savedData = localStorage.getItem('ime_player_data');
            if (savedData) {
                const data = JSON.parse(savedData);
                this.soulSeed = data.soulSeed || this.soulSeed;
                this.gold = data.gold || 0;
                this.inventory = data.inventory || [];
                this.vault = data.vault || [];
                this.entropyBuffer = data.entropyBuffer || [];
            }
        } catch (e) {
            console.error('Failed to load player data:', e);
        }
    }
    
    /**
     * Reset player data (for testing)
     */
    reset() {
        this.gold = 0;
        this.inventory = [];
        this.vault = [];
        this.entropyBuffer = [];
        this.soulSeed = this.generateSoulSeed();
        this.save();
    }
    
    /**
     * Get player stats for display
     */
    getStats() {
        return {
            soulSeed: this.soulSeed,
            gold: this.gold,
            inventoryCount: this.inventory.length,
            vaultCount: this.vault.length,
            entropyCollected: this.entropyBuffer ? this.entropyBuffer.length : 0
        };
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Player };
}
