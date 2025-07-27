# fake-tokens - Generate fake access tokens

![fake-tokens](images/fake-tokens-banner-smaller.png)

Have you ever needed fake GitHub, NPM, GitLab or AWS credentials for testing purposes?  Well, I did, but when I went looking for a library to use, I couldn't find any, so I wrote my own.

fake-tokens is a Javascript library and CLI that generates fake access tokens for testing and development purposes.  fake-tokens currently supports GitHub, NPM, GitLab and AWS tokens.  These tokens are intended for use in unit tests, development environments, and other scenarios where you need placeholder authentication data.  You can import the library and use it in your project, or you can run it as a CLI tool. 

I've published this as an NPM package which you can find at [https://www.npmjs.com/package/fake-tokens](https://www.npmjs.com/package/fake-tokens)

## Overview

This tool creates realistic-looking but completely fake tokens that match the format of popular services. These tokens are intended for use in unit tests, development environments, and other scenarios where you need placeholder authentication data.

There's a Python native version of this script as well.  You can read me about it [HERE](PYTHONREADME.md).

**WARNING: All generated tokens are fake and cannot be used for actual authentication with any service.**

## Supported Token Types

- **GitHub Classic**: `ghp_` prefix, 40 characters total
- **GitHub Fine-grained**: `github_pat_` prefix, 93 characters total (customizable)
- **GitLab**: `glpat-` prefix, 26 characters total
- **NPM**: `npm_` prefix, 40 characters total
- **AWS Access Key**: `AKIA` prefix, 20 characters total
- **AWS Secret Key**: 40-character base64-like string

## Installation

Requires Node.js (version 12.0.0 or higher). No additional npm packages required - uses only built-in Node.js modules.

```bash
# Make the script executable (Unix-like systems)
chmod +x fake-tokens.js
```

### NPM package

fake-tokens is also available as an NPM package:

```bash
npm install fake-tokens
```

## Usage

### Basic Usage

Generate a single GitHub classic token (default):
```bash
fake-tokens.js
```

### Specify Token Type

Generate different types of tokens:
```bash
fake-tokens.js -t github_classic
fake-tokens.js -t github_fine_grained
fake-tokens.js -t gitlab
fake-tokens.js -t npm
fake-tokens.js -t aws_access_key
fake-tokens.js -t aws_secret_key
```

### Generate Multiple Tokens

Generate multiple tokens of the same type:
```bash
fake-tokens.js -c 5                    # 5 GitHub classic tokens
fake-tokens.js -c 10 -t npm            # 10 NPM tokens
fake-tokens.js -c 3 -t aws_access_key  # 3 AWS access keys
```

### Command Line Options

- `-t, --type`: Token type to generate (default: github_classic)
- `-c, --count`: Number of tokens to generate (default: 1)
- `-h, --help`: Show help message

### Help

```bash
fake-tokens.js --help
```

## Examples

### Generate AWS Credentials for Testing

```bash
# Generate access key
fake-tokens.js -t aws_access_key
# Output: AKIAIOSFODNN7EXAMPLE

# Generate secret key
fake-tokens.js -t aws_secret_key
# Output: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```

### Generate Multiple GitHub Tokens

```bash
fake-tokens.js -c 3 -t github_classic
# Output:
# ghp_1234567890abcdef1234567890abcdef12345678
# ghp_abcdef1234567890abcdef1234567890abcdef12
# ghp_567890abcdef1234567890abcdef1234567890ab
```

### Use in Shell Scripts

```bash
#!/bin/bash
# Generate test tokens for CI/CD pipeline
GITHUB_TOKEN=$(node fake-tokens.js -t github_classic)
NPM_TOKEN=$(node fake-tokens.js -t npm)
AWS_ACCESS_KEY=$(node fake-tokens.js -t aws_access_key)
AWS_SECRET_KEY=$(node fake-tokens.js -t aws_secret_key)

echo "GITHUB_TOKEN=$GITHUB_TOKEN" >> .env.test
echo "NPM_TOKEN=$NPM_TOKEN" >> .env.test
echo "AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY" >> .env.test
echo "AWS_SECRET_ACCESS_KEY=$AWS_SECRET_KEY" >> .env.test
```

## Use Cases

### Unit Testing with Jest

```javascript
const { execSync } = require('child_process');

function getFakeToken(tokenType) {
    const result = execSync(`node fake-tokens.js -t ${tokenType}`, { encoding: 'utf8' });
    return result.trim();
}

// In your tests
describe('GitHub API Client', () => {
    test('should handle authentication', () => {
        const fakeToken = getFakeToken('github_classic');
        const client = new GitHubClient(fakeToken);
        // Test your client with the fake token
    });
});
```

### Using as a Node.js Module

```javascript
const TestTokenGenerator = require('./fake-tokens.js');

const generator = new TestTokenGenerator();

// Generate single tokens
const githubToken = generator.generateGitHubClassicToken();
const npmToken = generator.generateNpmToken();
const awsAccessKey = generator.generateAwsAccessKey();

// Generate multiple tokens
const multipleTokens = generator.generateBatch(5, 'github_classic');

console.log('GitHub Token:', githubToken);
console.log('NPM Token:', npmToken);
console.log('AWS Access Key:', awsAccessKey);
console.log('Multiple Tokens:', multipleTokens);
```

### Package.json Scripts

```json
{
  "scripts": {
    "generate-test-tokens": "node fake-tokens.js -c 5 -t github_classic",
    "setup-test-env": "node -e \"console.log('GITHUB_TOKEN=' + require('child_process').execSync('node fake-tokens.js -t github_classic', {encoding: 'utf8'}).trim())\" >> .env.test"
  }
}
```

### Express.js Middleware Testing

```javascript
const TestTokenGenerator = require('./fake-tokens.js');

describe('Auth Middleware', () => {
    let generator;
    
    beforeEach(() => {
        generator = new TestTokenGenerator();
    });
    
    test('should validate GitHub token format', () => {
        const fakeToken = generator.generateGitHubClassicToken();
        const req = { headers: { authorization: `Bearer ${fakeToken}` } };
        
        // Test your middleware
        expect(authMiddleware.validateTokenFormat(req)).toBe(true);
    });
});
```
# Generate tokens during build
RUN echo "GITHUB_TOKEN=$(node /usr/local/bin/fake-tokens.js -t github_classic)" >> /app/.env.test
```

## API Reference

### Class: TestTokenGenerator

#### Constructor
```javascript
const generator = new TestTokenGenerator();
```

#### Methods

##### generateGitHubClassicToken(ensureUnique = true)
Returns a fake GitHub classic token starting with `ghp_`.

##### generateGitHubFineGrainedToken(length = 93, ensureUnique = true)
Returns a fake GitHub fine-grained token starting with `github_pat_`.

##### generateGitLabToken(ensureUnique = true)
Returns a fake GitLab token starting with `glpat-`.

##### generateNpmToken(ensureUnique = true)
Returns a fake NPM token starting with `npm_`.

##### generateAwsAccessKey(ensureUnique = true)
Returns a fake AWS access key starting with `AKIA`.

##### generateAwsSecretKey(ensureUnique = true)
Returns a fake AWS secret key (40 characters).

##### generateBatch(count, tokenType = "github_classic")
Returns an array of fake tokens of the specified type.

##### clearHistory()
Clears the history of generated tokens.

##### getGeneratedCount()
Returns the number of unique tokens generated.

## Security Notes

- All tokens generated by this script are completely fake
- Uses Node.js `crypto.randomInt()` for cryptographically secure random generation
- Do not use these tokens for actual authentication
- The tokens follow realistic formats but contain no real credentials
- Safe to commit to version control in test configurations
- No actual API keys or secrets are embedded in the script

## Token Format Details

### GitHub Classic Tokens
- Format: `ghp_` + 36 alphanumeric characters
- Total length: 40 characters
- Character set: a-z, A-Z, 0-9

### GitHub Fine-grained Tokens
- Format: `github_pat_` + variable length alphanumeric string
- Default length: 93 characters total
- Character set: a-z, A-Z, 0-9

### GitLab Tokens
- Format: `glpat-` + 20 alphanumeric characters
- Total length: 26 characters
- Character set: a-z, A-Z, 0-9

### NPM Tokens
- Format: `npm_` + 36 characters
- Total length: 40 characters
- Character set: a-z, A-Z, 0-9, _, -

### AWS Access Keys
- Format: `AKIA` + 16 uppercase alphanumeric characters
- Total length: 20 characters
- Character set: A-Z, 0-9

### AWS Secret Keys
- Format: 40-character base64-like string
- Character set: a-z, A-Z, 0-9, +, /

## Requirements

- Node.js 12.0.0 or higher
- No external dependencies (uses only built-in Node.js modules)

## Contributing

Feel free to submit issues or pull requests to add support for additional token formats or improve existing functionality.

## License

This script is provided as-is for testing and development purposes. Use responsibly and never for actual authentication.
