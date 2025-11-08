/**
 * Renderer - Canvas rendering system with GBC-style pixel art
 * Handles retro and modern resolution modes
 */

// GBC Color Palette (10 colors optimized for v2.4)
const GBC_COLORS = {
    DARKEST: '#0f380f',
    DARK_GREEN: '#306230',
    MID_GREEN: '#8bac0f',
    LIGHT: '#9bbc0f',
    LIGHTEST: '#e0f8d0',
    SHADOW: '#081820',
    BLUE: '#1a5f7a',
    BROWN: '#8b4513',
    RED: '#aa3232',
    GOLD: '#ffd700'
};

// Tile color mapping
const TILE_COLORS = {
    0: GBC_COLORS.LIGHTEST,    // Floor
    1: GBC_COLORS.DARK_GREEN,  // Wall
    2: GBC_COLORS.BROWN,       // Door
    3: GBC_COLORS.BLUE,        // Stairs Down
    4: GBC_COLORS.BLUE,        // Stairs Up
    5: GBC_COLORS.GOLD,        // Treasure
    6: GBC_COLORS.BLUE,        // Water
    7: GBC_COLORS.RED,         // Lava
    8: GBC_COLORS.MID_GREEN,   // Grass
    9: GBC_COLORS.SHADOW       // Stone
};

class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // Resolution modes
        this.resolutions = {
            retro: { width: 160, height: 144, ratio: 10/9 },
            modern: { width: 256, height: 144, ratio: 16/9 }
        };
        
        this.currentMode = 'modern';
        this.setResolution(this.currentMode);
        
        // Tile size for rendering
        this.tileSize = 8;
        
        // Camera
        this.camera = { x: 0, y: 0 };
        
        // Starfield for NEXUS
        this.stars = [];
        this.initStarfield();
    }
    
    /**
     * Set resolution mode
     */
    setResolution(mode) {
        this.currentMode = mode;
        const res = this.resolutions[mode];
        this.canvas.width = res.width;
        this.canvas.height = res.height;
        
        // Disable image smoothing for pixel art
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.mozImageSmoothingEnabled = false;
        this.ctx.webkitImageSmoothingEnabled = false;
        this.ctx.msImageSmoothingEnabled = false;
    }
    
    /**
     * Toggle between retro and modern resolutions
     */
    toggleResolution() {
        this.currentMode = (this.currentMode === 'retro') ? 'modern' : 'retro';
        this.setResolution(this.currentMode);
        return this.currentMode;
    }
    
    /**
     * Initialize starfield for NEXUS background
     */
    initStarfield() {
        this.stars = [];
        for (let i = 0; i < 100; i++) {
            this.stars.push({
                x: Math.random() * 256,
                y: Math.random() * 144,
                size: Math.random() * 2 + 0.5,
                speed: Math.random() * 0.5 + 0.1,
                brightness: Math.random() * 0.5 + 0.5
            });
        }
    }
    
    /**
     * Update starfield animation
     */
    updateStarfield() {
        for (const star of this.stars) {
            star.y += star.speed;
            if (star.y > 144) {
                star.y = 0;
                star.x = Math.random() * 256;
            }
        }
    }
    
    /**
     * Clear canvas
     */
    clear() {
        this.ctx.fillStyle = GBC_COLORS.DARKEST;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    /**
     * Render NEXUS hub (starfield)
     */
    renderNexus() {
        // Dark background
        this.ctx.fillStyle = GBC_COLORS.SHADOW;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw stars
        for (const star of this.stars) {
            const alpha = star.brightness;
            this.ctx.fillStyle = `rgba(224, 248, 208, ${alpha})`;
            this.ctx.fillRect(Math.floor(star.x), Math.floor(star.y), 
                            Math.ceil(star.size), Math.ceil(star.size));
        }
        
        // NEXUS title
        this.ctx.fillStyle = GBC_COLORS.GOLD;
        this.ctx.font = '16px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('NEXUS HUB', this.canvas.width / 2, 30);
        
        // Instructions
        this.ctx.fillStyle = GBC_COLORS.LIGHTEST;
        this.ctx.font = '8px monospace';
        this.ctx.fillText('Press P to Portal Jump', this.canvas.width / 2, 60);
        this.ctx.fillText('Press V for Vault', this.canvas.width / 2, 75);
    }
    
    /**
     * Render dungeon world
     */
    renderDungeon(world, player) {
        if (!world.map) {
            this.renderNexus();
            return;
        }
        
        // Update camera to follow player
        this.updateCamera(player, world);
        
        // Calculate visible tile range
        const tilesX = Math.ceil(this.canvas.width / this.tileSize);
        const tilesY = Math.ceil(this.canvas.height / this.tileSize);
        
        const startX = Math.floor(this.camera.x);
        const startY = Math.floor(this.camera.y);
        
        // Render tiles
        for (let ty = 0; ty < tilesY; ty++) {
            for (let tx = 0; tx < tilesX; tx++) {
                const worldX = startX + tx;
                const worldY = startY + ty;
                
                if (worldX >= 0 && worldX < world.map[0].length &&
                    worldY >= 0 && worldY < world.map.length) {
                    
                    const tile = world.map[worldY][worldX];
                    this.renderTile(tx * this.tileSize, ty * this.tileSize, tile);
                }
            }
        }
        
        // Render player
        this.renderPlayer(player);
    }
    
    /**
     * Update camera to follow player
     */
    updateCamera(player, world) {
        const tilesX = Math.ceil(this.canvas.width / this.tileSize);
        const tilesY = Math.ceil(this.canvas.height / this.tileSize);
        
        // Center camera on player
        this.camera.x = player.x - tilesX / 2;
        this.camera.y = player.y - tilesY / 2;
        
        // Clamp camera to world bounds
        this.camera.x = Math.max(0, Math.min(this.camera.x, world.map[0].length - tilesX));
        this.camera.y = Math.max(0, Math.min(this.camera.y, world.map.length - tilesY));
    }
    
    /**
     * Render a single tile
     */
    renderTile(screenX, screenY, tileType) {
        const color = TILE_COLORS[tileType] || GBC_COLORS.DARKEST;
        this.ctx.fillStyle = color;
        this.ctx.fillRect(screenX, screenY, this.tileSize, this.tileSize);
        
        // Add border for walls
        if (tileType === 1) {
            this.ctx.strokeStyle = GBC_COLORS.SHADOW;
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(screenX, screenY, this.tileSize, this.tileSize);
        }
        
        // Special rendering for special tiles
        if (tileType === 3 || tileType === 4) { // Stairs
            this.ctx.fillStyle = GBC_COLORS.LIGHTEST;
            this.ctx.fillRect(screenX + 2, screenY + 2, 4, 4);
        }
        
        if (tileType === 5) { // Treasure
            this.ctx.fillStyle = GBC_COLORS.RED;
            this.ctx.fillRect(screenX + 3, screenY + 3, 2, 2);
        }
    }
    
    /**
     * Render player
     */
    renderPlayer(player) {
        const screenX = (player.x - this.camera.x) * this.tileSize;
        const screenY = (player.y - this.camera.y) * this.tileSize;
        
        // Player sprite (simple colored square for now)
        this.ctx.fillStyle = GBC_COLORS.GOLD;
        this.ctx.fillRect(screenX + 1, screenY + 1, this.tileSize - 2, this.tileSize - 2);
        
        // Player outline
        this.ctx.strokeStyle = GBC_COLORS.SHADOW;
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(screenX + 1, screenY + 1, this.tileSize - 2, this.tileSize - 2);
    }
    
    /**
     * Render HUD overlay
     */
    renderHUD(player) {
        // Semi-transparent background for HUD
        this.ctx.fillStyle = 'rgba(15, 56, 15, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, 20);
        
        // Text
        this.ctx.fillStyle = GBC_COLORS.LIGHTEST;
        this.ctx.font = '8px monospace';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`Gold: ${player.gold}`, 5, 12);
        
        this.ctx.textAlign = 'right';
        this.ctx.fillText(`Pos: ${Math.floor(player.x)},${Math.floor(player.y)}`, 
                         this.canvas.width - 5, 12);
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Renderer, GBC_COLORS, TILE_COLORS };
}
