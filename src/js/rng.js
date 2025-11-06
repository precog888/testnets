/**
 * RNG.js - Seeded Random Number Generator
 * Implementation of xmur3a (hash) and sfc32 (PRNG)
 * Provides reproducible random number generation for procedural content
 */

/**
 * xmur3a - Simple hash function for seeding
 * @param {string} str - Input string to hash
 * @returns {function} Hash function
 */
function xmur3a(str) {
    let h = 1779033703 ^ str.length;
    for (let i = 0; i < str.length; i++) {
        h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
        h = h << 13 | h >>> 19;
    }
    return function() {
        h = Math.imul(h ^ h >>> 16, 2246822507);
        h = Math.imul(h ^ h >>> 13, 3266489909);
        return (h ^= h >>> 16) >>> 0;
    };
}

/**
 * sfc32 - Simple Fast Counter PRNG
 * @param {number} a - Seed component 1
 * @param {number} b - Seed component 2
 * @param {number} c - Seed component 3
 * @param {number} d - Seed component 4
 * @returns {function} Random number generator (0 to 1)
 */
function sfc32(a, b, c, d) {
    return function() {
        a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0;
        let t = (a + b) | 0;
        a = b ^ b >>> 9;
        b = c + (c << 3) | 0;
        c = (c << 21 | c >>> 11);
        d = d + 1 | 0;
        t = t + d | 0;
        c = c + t | 0;
        return (t >>> 0) / 4294967296;
    };
}

/**
 * SeededRNG - Main RNG class combining xmur3a and sfc32
 */
class SeededRNG {
    constructor(seed) {
        this.seed = seed;
        const hash = xmur3a(seed);
        this.rng = sfc32(hash(), hash(), hash(), hash());
    }
    
    /**
     * Get random float between 0 and 1
     */
    random() {
        return this.rng();
    }
    
    /**
     * Get random integer between min and max (inclusive)
     */
    randomInt(min, max) {
        return Math.floor(this.random() * (max - min + 1)) + min;
    }
    
    /**
     * Get random float between min and max
     */
    randomFloat(min, max) {
        return this.random() * (max - min) + min;
    }
    
    /**
     * Choose random item from array
     */
    choose(array) {
        return array[this.randomInt(0, array.length - 1)];
    }
    
    /**
     * Shuffle array using Fisher-Yates
     */
    shuffle(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = this.randomInt(0, i);
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    
    /**
     * Random chance (0-100)
     */
    chance(percentage) {
        return this.random() * 100 < percentage;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SeededRNG, xmur3a, sfc32 };
}
