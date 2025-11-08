/**
 * World Generator - Procedural Dungeon Generation
 * Based on Drunkard's Walk algorithm with room generation
 * Creates 64x36 tile maps with 2-tile thick boundary walls
 */

// Tile types
const TILES = {
    FLOOR: 0,
    WALL: 1,
    DOOR: 2,
    STAIRS_DOWN: 3,
    STAIRS_UP: 4,
    TREASURE: 5,
    WATER: 6,
    LAVA: 7,
    GRASS: 8,
    STONE: 9
};

class WorldGenerator {
    constructor(seed, width = 64, height = 36) {
        this.seed = seed;
        this.width = width;
        this.height = height;
        this.rng = new SeededRNG(seed);
        this.map = [];
        this.rooms = [];
        this.isNexus = (seed === 'NEXUS-HUB-001');
    }
    
    /**
     * Generate the world map
     */
    generate() {
        if (this.isNexus) {
            return this.generateNexus();
        }
        return this.generateDungeon();
    }
    
    /**
     * Generate NEXUS hub (starfield, no dungeon map)
     */
    generateNexus() {
        // NEXUS has no tile map, just a starfield background
        this.map = null;
        return {
            map: null,
            rooms: [],
            spawnPoint: { x: this.width / 2, y: this.height / 2 },
            isNexus: true
        };
    }
    
    /**
     * Generate dungeon using room-based approach
     */
    generateDungeon() {
        // Initialize map with all walls
        this.initializeMap();
        
        // Create boundary walls (2-tile thick border) - v2.4 fix
        this.createBoundary();
        
        // Generate rooms
        this.generateRooms();
        
        // Connect rooms with corridors
        this.connectRooms();
        
        // Add details (doors, treasures, etc.)
        this.addDetails();
        
        // Find valid spawn point
        const spawnPoint = this.findSpawnPoint();
        
        return {
            map: this.map,
            rooms: this.rooms,
            spawnPoint: spawnPoint,
            isNexus: false
        };
    }
    
    /**
     * Initialize map with all walls
     */
    initializeMap() {
        this.map = [];
        for (let y = 0; y < this.height; y++) {
            this.map[y] = [];
            for (let x = 0; x < this.width; x++) {
                this.map[y][x] = TILES.WALL;
            }
        }
    }
    
    /**
     * Create 2-tile thick boundary walls (v2.4 fix)
     */
    createBoundary() {
        // Top and bottom borders (2 tiles thick)
        for (let x = 0; x < this.width; x++) {
            this.map[0][x] = TILES.WALL;
            this.map[1][x] = TILES.WALL;
            this.map[this.height - 1][x] = TILES.WALL;
            this.map[this.height - 2][x] = TILES.WALL;
        }
        
        // Left and right borders (2 tiles thick)
        for (let y = 0; y < this.height; y++) {
            this.map[y][0] = TILES.WALL;
            this.map[y][1] = TILES.WALL;
            this.map[y][this.width - 1] = TILES.WALL;
            this.map[y][this.width - 2] = TILES.WALL;
        }
    }
    
    /**
     * Generate rooms using non-overlapping algorithm
     */
    generateRooms() {
        const minRooms = 4;
        const maxRooms = 8;
        const minRoomSize = 5;
        const maxRoomSize = 12;
        
        const targetRooms = this.rng.randomInt(minRooms, maxRooms);
        let attempts = 0;
        const maxAttempts = 100;
        
        while (this.rooms.length < targetRooms && attempts < maxAttempts) {
            attempts++;
            
            const roomWidth = this.rng.randomInt(minRoomSize, maxRoomSize);
            const roomHeight = this.rng.randomInt(minRoomSize, maxRoomSize);
            
            // Leave space for 2-tile boundary
            const x = this.rng.randomInt(3, this.width - roomWidth - 3);
            const y = this.rng.randomInt(3, this.height - roomHeight - 3);
            
            const newRoom = {
                x: x,
                y: y,
                width: roomWidth,
                height: roomHeight,
                centerX: x + Math.floor(roomWidth / 2),
                centerY: y + Math.floor(roomHeight / 2)
            };
            
            // Check if room overlaps with existing rooms
            if (!this.roomOverlaps(newRoom)) {
                this.rooms.push(newRoom);
                this.carveRoom(newRoom);
            }
        }
    }
    
    /**
     * Check if room overlaps with existing rooms
     */
    roomOverlaps(newRoom) {
        for (const room of this.rooms) {
            // Add 1 tile padding between rooms
            if (newRoom.x < room.x + room.width + 1 &&
                newRoom.x + newRoom.width + 1 > room.x &&
                newRoom.y < room.y + room.height + 1 &&
                newRoom.y + newRoom.height + 1 > room.y) {
                return true;
            }
        }
        return false;
    }
    
    /**
     * Carve out a room (set tiles to floor)
     */
    carveRoom(room) {
        for (let y = room.y; y < room.y + room.height; y++) {
            for (let x = room.x; x < room.x + room.width; x++) {
                this.map[y][x] = TILES.FLOOR;
            }
        }
    }
    
    /**
     * Connect rooms with corridors (Drunkard's Walk variant)
     */
    connectRooms() {
        for (let i = 0; i < this.rooms.length - 1; i++) {
            const roomA = this.rooms[i];
            const roomB = this.rooms[i + 1];
            
            // Use Drunkard's Walk to connect room centers
            this.carveCorridor(roomA.centerX, roomA.centerY, roomB.centerX, roomB.centerY);
        }
    }
    
    /**
     * Carve corridor between two points using Drunkard's Walk
     */
    carveCorridor(x1, y1, x2, y2) {
        let x = x1;
        let y = y1;
        
        while (x !== x2 || y !== y2) {
            // Carve 2-wide corridor for better navigation
            this.setTile(x, y, TILES.FLOOR);
            this.setTile(x + 1, y, TILES.FLOOR);
            this.setTile(x, y + 1, TILES.FLOOR);
            
            // Move towards target with some randomness
            if (this.rng.random() > 0.5) {
                // Move horizontally
                if (x < x2) x++;
                else if (x > x2) x--;
            } else {
                // Move vertically
                if (y < y2) y++;
                else if (y > y2) y--;
            }
        }
    }
    
    /**
     * Add details like doors, treasures, stairs
     */
    addDetails() {
        // Add stairs in first and last rooms
        if (this.rooms.length > 0) {
            const firstRoom = this.rooms[0];
            this.setTile(firstRoom.centerX, firstRoom.centerY, TILES.STAIRS_UP);
            
            const lastRoom = this.rooms[this.rooms.length - 1];
            this.setTile(lastRoom.centerX, lastRoom.centerY, TILES.STAIRS_DOWN);
        }
        
        // Add treasure in random rooms
        const treasureCount = Math.min(3, Math.floor(this.rooms.length / 2));
        const treasureRooms = this.rng.shuffle(this.rooms).slice(0, treasureCount);
        
        for (const room of treasureRooms) {
            const tx = this.rng.randomInt(room.x + 1, room.x + room.width - 2);
            const ty = this.rng.randomInt(room.y + 1, room.y + room.height - 2);
            this.setTile(tx, ty, TILES.TREASURE);
        }
    }
    
    /**
     * Find valid spawn point (in first room or fallback)
     */
    findSpawnPoint() {
        if (this.rooms.length > 0) {
            const firstRoom = this.rooms[0];
            return {
                x: firstRoom.centerX,
                y: firstRoom.centerY
            };
        }
        
        // Fallback: find any floor tile
        for (let y = 2; y < this.height - 2; y++) {
            for (let x = 2; x < this.width - 2; x++) {
                if (this.map[y][x] === TILES.FLOOR) {
                    return { x, y };
                }
            }
        }
        
        // Ultimate fallback: center of map
        return { x: Math.floor(this.width / 2), y: Math.floor(this.height / 2) };
    }
    
    /**
     * Safely set tile with bounds checking
     */
    setTile(x, y, tile) {
        if (x >= 2 && x < this.width - 2 && y >= 2 && y < this.height - 2) {
            this.map[y][x] = tile;
        }
    }
    
    /**
     * Get tile at position
     */
    getTile(x, y) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return TILES.WALL;
        }
        return this.map[y][x];
    }
    
    /**
     * Check if tile is walkable
     */
    isWalkable(x, y) {
        const tile = this.getTile(x, y);
        return tile === TILES.FLOOR || 
               tile === TILES.DOOR || 
               tile === TILES.STAIRS_DOWN || 
               tile === TILES.STAIRS_UP ||
               tile === TILES.GRASS;
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { WorldGenerator, TILES };
}
