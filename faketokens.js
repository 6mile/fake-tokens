#!/usr/bin/env node

/**
 * Test Token Generator
 * 
 * Generates fake tokens for testing and development purposes.
 * These tokens are NOT real and cannot be used for actual authentication.
 * 
 * Supported token formats:
 * - GitHub Classic: ghp_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX (40 chars)
 * - GitHub Fine-grained: github_pat_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX (varies)
 * - GitLab: glpat-XXXXXXXXXXXXXXXXXXXX (26 chars total)
 * - NPM: npm_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX (40 chars)
 * - AWS Access Key: AKIA + 16 chars (20 chars total)
 * - AWS Secret Key: 40 character base64-like string
 */

const crypto = require('crypto');

class TestTokenGenerator {
    constructor() {
        this.generatedTokens = new Set();
        
        // Token prefixes
        this.GITHUB_CLASSIC_PREFIX = "ghp_";
        this.GITHUB_FINE_GRAINED_PREFIX = "github_pat_";
        this.GITLAB_PREFIX = "glpat-";
        this.NPM_PREFIX = "npm_";
        this.AWS_ACCESS_KEY_PREFIX = "AKIA";
        
        // Character sets
        this.TOKEN_CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        this.NPM_TOKEN_CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-";
        this.AWS_SECRET_CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/";
        this.AWS_ACCESS_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    }

    /**
     * Generate random string from character set
     * @param {string} chars - Character set to use
     * @param {number} length - Length of string to generate
     * @returns {string} Random string
     */
    generateRandomString(chars, length) {
        let result = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = crypto.randomInt(0, chars.length);
            result += chars[randomIndex];
        }
        return result;
    }

    /**
     * Generate a fake classic GitHub personal access token
     * @param {boolean} ensureUnique - If true, ensures the token hasn't been generated before
     * @returns {string} A fake token string starting with 'ghp_'
     */
    generateGitHubClassicToken(ensureUnique = true) {
        while (true) {
            const tokenBody = this.generateRandomString(this.TOKEN_CHARS, 36);
            const token = this.GITHUB_CLASSIC_PREFIX + tokenBody;
            
            if (!ensureUnique || !this.generatedTokens.has(token)) {
                if (ensureUnique) {
                    this.generatedTokens.add(token);
                }
                return token;
            }
        }
    }

    /**
     * Generate a fake fine-grained GitHub personal access token
     * @param {number} length - Total length of the token (default 93)
     * @param {boolean} ensureUnique - If true, ensures the token hasn't been generated before
     * @returns {string} A fake token starting with 'github_pat_'
     */
    generateGitHubFineGrainedToken(length = 93, ensureUnique = true) {
        if (length < this.GITHUB_FINE_GRAINED_PREFIX.length + 10) {
            throw new Error(`Token length must be at least ${this.GITHUB_FINE_GRAINED_PREFIX.length + 10}`);
        }
        
        while (true) {
            const bodyLength = length - this.GITHUB_FINE_GRAINED_PREFIX.length;
            const tokenBody = this.generateRandomString(this.TOKEN_CHARS, bodyLength);
            const token = this.GITHUB_FINE_GRAINED_PREFIX + tokenBody;
            
            if (!ensureUnique || !this.generatedTokens.has(token)) {
                if (ensureUnique) {
                    this.generatedTokens.add(token);
                }
                return token;
            }
        }
    }

    /**
     * Generate a fake GitLab personal access token
     * @param {boolean} ensureUnique - If true, ensures the token hasn't been generated before
     * @returns {string} A fake token string starting with 'glpat-'
     */
    generateGitLabToken(ensureUnique = true) {
        while (true) {
            const tokenBody = this.generateRandomString(this.TOKEN_CHARS, 20);
            const token = this.GITLAB_PREFIX + tokenBody;
            
            if (!ensureUnique || !this.generatedTokens.has(token)) {
                if (ensureUnique) {
                    this.generatedTokens.add(token);
                }
                return token;
            }
        }
    }

    /**
     * Generate a fake NPM access token
     * @param {boolean} ensureUnique - If true, ensures the token hasn't been generated before
     * @returns {string} A fake token string starting with 'npm_'
     */
    generateNpmToken(ensureUnique = true) {
        while (true) {
            const tokenBody = this.generateRandomString(this.NPM_TOKEN_CHARS, 36);
            const token = this.NPM_PREFIX + tokenBody;
            
            if (!ensureUnique || !this.generatedTokens.has(token)) {
                if (ensureUnique) {
                    this.generatedTokens.add(token);
                }
                return token;
            }
        }
    }

    /**
     * Generate a fake AWS access key ID
     * @param {boolean} ensureUnique - If true, ensures the token hasn't been generated before
     * @returns {string} A fake AWS access key starting with 'AKIA'
     */
    generateAwsAccessKey(ensureUnique = true) {
        while (true) {
            const tokenBody = this.generateRandomString(this.AWS_ACCESS_CHARS, 16);
            const token = this.AWS_ACCESS_KEY_PREFIX + tokenBody;
            
            if (!ensureUnique || !this.generatedTokens.has(token)) {
                if (ensureUnique) {
                    this.generatedTokens.add(token);
                }
                return token;
            }
        }
    }

    /**
     * Generate a fake AWS secret access key
     * @param {boolean} ensureUnique - If true, ensures the token hasn't been generated before
     * @returns {string} A fake AWS secret key (40 characters, base64-like)
     */
    generateAwsSecretKey(ensureUnique = true) {
        while (true) {
            const token = this.generateRandomString(this.AWS_SECRET_CHARS, 40);
            
            if (!ensureUnique || !this.generatedTokens.has(token)) {
                if (ensureUnique) {
                    this.generatedTokens.add(token);
                }
                return token;
            }
        }
    }

    /**
     * Generate multiple test tokens at once
     * @param {number} count - Number of tokens to generate
     * @param {string} tokenType - Type of token to generate
     * @returns {string[]} Array of generated tokens
     */
    generateBatch(count, tokenType = "github_classic") {
        const tokens = [];
        
        for (let i = 0; i < count; i++) {
            switch (tokenType.toLowerCase()) {
                case "github_classic":
                    tokens.push(this.generateGitHubClassicToken());
                    break;
                case "github_fine_grained":
                    tokens.push(this.generateGitHubFineGrainedToken());
                    break;
                case "gitlab":
                    tokens.push(this.generateGitLabToken());
                    break;
                case "npm":
                    tokens.push(this.generateNpmToken());
                    break;
                case "aws_access_key":
                    tokens.push(this.generateAwsAccessKey());
                    break;
                case "aws_secret_key":
                    tokens.push(this.generateAwsSecretKey());
                    break;
                default:
                    throw new Error("token_type must be 'github_classic', 'github_fine_grained', 'gitlab', 'npm', 'aws_access_key', or 'aws_secret_key'");
            }
        }
        
        return tokens;
    }

    /**
     * Clear the history of generated tokens
     */
    clearHistory() {
        this.generatedTokens.clear();
    }

    /**
     * Get the number of unique tokens generated so far
     * @returns {number} Number of unique tokens generated
     */
    getGeneratedCount() {
        return this.generatedTokens.size;
    }
}

/**
 * Parse command line arguments
 * @returns {object} Parsed arguments
 */
function parseArgs() {
    const args = process.argv.slice(2);
    const result = {
        count: 1,
        type: "github_classic",
        help: false
    };

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        
        if (arg === '-h' || arg === '--help') {
            result.help = true;
        } else if (arg === '-c' || arg === '--count') {
            if (i + 1 >= args.length) {
                throw new Error(`${arg} requires a value`);
            }
            result.count = parseInt(args[++i]);
            if (isNaN(result.count) || result.count < 1) {
                throw new Error('Count must be a positive integer');
            }
        } else if (arg === '-t' || arg === '--type') {
            if (i + 1 >= args.length) {
                throw new Error(`${arg} requires a value`);
            }
            const validTypes = ["github_classic", "github_fine_grained", "gitlab", "npm", "aws_access_key", "aws_secret_key"];
            result.type = args[++i];
            if (!validTypes.includes(result.type)) {
                throw new Error(`Invalid token type. Choose from: ${validTypes.join(', ')}`);
            }
        } else {
            throw new Error(`Unknown argument: ${arg}`);
        }
    }

    return result;
}

/**
 * Display help message
 */
function showHelp() {
    console.log(`Test Token Generator

Generate fake tokens for testing (GitHub, GitLab, NPM, and AWS)

Usage: node faketokens.js [options]

Options:
  -c, --count <number>    Number of tokens to generate (default: 1)
  -t, --type <type>       Token type to generate (default: github_classic)
  -h, --help             Show this help message

Token types:
  github_classic         GitHub classic tokens (ghp_...)
  github_fine_grained    GitHub fine-grained tokens (github_pat_...)
  gitlab                 GitLab tokens (glpat-...)
  npm                    NPM tokens (npm_...)
  aws_access_key         AWS access keys (AKIA...)
  aws_secret_key         AWS secret keys

Examples:
  node faketokens.js                          # Generate 1 GitHub classic token
  node faketokens.js -c 5                     # Generate 5 GitHub classic tokens
  node faketokens.js -t github_fine_grained   # Generate GitHub fine-grained token
  node faketokens.js -t gitlab                # Generate GitLab token
  node faketokens.js -t npm                   # Generate NPM token
  node faketokens.js -t aws_access_key        # Generate AWS access key
  node faketokens.js -t aws_secret_key        # Generate AWS secret key
  node faketokens.js -c 3 -t aws_access_key   # Generate 3 AWS access keys`);
}

/**
 * Main function
 */
function main() {
    try {
        const args = parseArgs();
        
        if (args.help) {
            showHelp();
            return;
        }

        const generator = new TestTokenGenerator();
        const tokens = generator.generateBatch(args.count, args.type);
        
        tokens.forEach(token => console.log(token));
        
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

// Run if this file is executed directly
if (require.main === module) {
    main();
}

module.exports = TestTokenGenerator;
