#!/usr/bin/env python3
"""
Test Token Generator

Generates fake tokens for testing and development purposes.
These tokens are NOT real and cannot be used for actual authentication.

Supported token formats:
- GitHub Classic: ghp_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX (40 chars)
- GitHub Fine-grained: github_pat_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX (varies)
- GitLab: glpat-XXXXXXXXXXXXXXXXXXXX (26 chars total)
- NPM: npm_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX (40 chars)
- AWS Access Key: AKIA + 16 chars (20 chars total)
- AWS Secret Key: 40 character base64-like string
"""

import argparse
import random
import string
import secrets
import sys
from typing import List


class TestTokenGenerator:
    """Generate fake tokens for testing purposes."""
    
    # Token prefixes
    GITHUB_CLASSIC_PREFIX = "ghp_"
    GITHUB_FINE_GRAINED_PREFIX = "github_pat_"
    GITLAB_PREFIX = "glpat-"
    NPM_PREFIX = "npm_"
    AWS_ACCESS_KEY_PREFIX = "AKIA"
    
    # Characters used in tokens
    TOKEN_CHARS = string.ascii_letters + string.digits
    NPM_TOKEN_CHARS = string.ascii_letters + string.digits + "_-"  # NPM allows underscores and hyphens
    AWS_SECRET_CHARS = string.ascii_letters + string.digits + "+/"  # Base64-like characters
    
    def __init__(self):
        """Initialize the token generator."""
        self.generated_tokens = set()
    
    def generate_github_classic_token(self, ensure_unique: bool = True) -> str:
        """
        Generate a fake classic GitHub personal access token.
        
        Args:
            ensure_unique: If True, ensures the token hasn't been generated before
            
        Returns:
            A fake token string starting with 'ghp_'
        """
        while True:
            # Classic tokens have 36 characters after the prefix
            token_body = ''.join(secrets.choice(self.TOKEN_CHARS) for _ in range(36))
            token = f"{self.GITHUB_CLASSIC_PREFIX}{token_body}"
            
            if not ensure_unique or token not in self.generated_tokens:
                if ensure_unique:
                    self.generated_tokens.add(token)
                return token
    
    def generate_github_fine_grained_token(self, length: int = 93, ensure_unique: bool = True) -> str:
        """
        Generate a fake fine-grained GitHub personal access token.
        
        Args:
            length: Total length of the token (default 93 is common)
            ensure_unique: If True, ensures the token hasn't been generated before
            
        Returns:
            A fake token starting with 'github_pat_'
        """
        if length < len(self.GITHUB_FINE_GRAINED_PREFIX) + 10:
            raise ValueError(f"Token length must be at least {len(self.GITHUB_FINE_GRAINED_PREFIX) + 10}")
        
        while True:
            # Calculate body length after removing prefix
            body_length = length - len(self.GITHUB_FINE_GRAINED_PREFIX)
            token_body = ''.join(secrets.choice(self.TOKEN_CHARS) for _ in range(body_length))
            token = f"{self.GITHUB_FINE_GRAINED_PREFIX}{token_body}"
            
            if not ensure_unique or token not in self.generated_tokens:
                if ensure_unique:
                    self.generated_tokens.add(token)
                return token
    
    def generate_gitlab_token(self, ensure_unique: bool = True) -> str:
        """
        Generate a fake GitLab personal access token.
        
        Args:
            ensure_unique: If True, ensures the token hasn't been generated before
            
        Returns:
            A fake token string starting with 'glpat-'
        """
        while True:
            # GitLab tokens have 20 characters after the prefix (26 total)
            token_body = ''.join(secrets.choice(self.TOKEN_CHARS) for _ in range(20))
            token = f"{self.GITLAB_PREFIX}{token_body}"
            
            if not ensure_unique or token not in self.generated_tokens:
                if ensure_unique:
                    self.generated_tokens.add(token)
                return token
    
    def generate_aws_access_key(self, ensure_unique: bool = True) -> str:
        """
        Generate a fake AWS access key ID.
        
        Args:
            ensure_unique: If True, ensures the token hasn't been generated before
            
        Returns:
            A fake AWS access key starting with 'AKIA'
        """
        while True:
            # AWS access keys have 16 characters after AKIA prefix (20 total)
            token_body = ''.join(secrets.choice(string.ascii_uppercase + string.digits) for _ in range(16))
            token = f"{self.AWS_ACCESS_KEY_PREFIX}{token_body}"
            
            if not ensure_unique or token not in self.generated_tokens:
                if ensure_unique:
                    self.generated_tokens.add(token)
                return token
    
    def generate_aws_secret_key(self, ensure_unique: bool = True) -> str:
        """
        Generate a fake AWS secret access key.
        
        Args:
            ensure_unique: If True, ensures the token hasn't been generated before
            
        Returns:
            A fake AWS secret key (40 characters, base64-like)
        """
        while True:
            # AWS secret keys are 40 characters, base64-like encoding
            token = ''.join(secrets.choice(self.AWS_SECRET_CHARS) for _ in range(40))
            
            if not ensure_unique or token not in self.generated_tokens:
                if ensure_unique:
                    self.generated_tokens.add(token)
                return token
    
    def generate_npm_token(self, ensure_unique: bool = True) -> str:
        """
        Generate a fake NPM access token.
        
        Args:
            ensure_unique: If True, ensures the token hasn't been generated before
            
        Returns:
            A fake token string starting with 'npm_'
        """
        while True:
            # NPM tokens have 36 characters after the prefix
            token_body = ''.join(secrets.choice(self.NPM_TOKEN_CHARS) for _ in range(36))
            token = f"{self.NPM_PREFIX}{token_body}"
            
            if not ensure_unique or token not in self.generated_tokens:
                if ensure_unique:
                    self.generated_tokens.add(token)
                return token
    
    def generate_batch(self, count: int, token_type: str = "github_classic") -> List[str]:
        """
        Generate multiple test tokens at once.
        
        Args:
            count: Number of tokens to generate
            token_type: Type of token ("github_classic", "github_fine_grained", "gitlab", "npm", "aws_access_key", or "aws_secret_key")
            
        Returns:
            List of generated tokens
        """
        tokens = []
        for _ in range(count):
            if token_type.lower() == "github_classic":
                tokens.append(self.generate_github_classic_token())
            elif token_type.lower() == "github_fine_grained":
                tokens.append(self.generate_github_fine_grained_token())
            elif token_type.lower() == "gitlab":
                tokens.append(self.generate_gitlab_token())
            elif token_type.lower() == "npm":
                tokens.append(self.generate_npm_token())
            elif token_type.lower() == "aws_access_key":
                tokens.append(self.generate_aws_access_key())
            elif token_type.lower() == "aws_secret_key":
                tokens.append(self.generate_aws_secret_key())
            else:
                raise ValueError("token_type must be 'github_classic', 'github_fine_grained', 'gitlab', 'npm', 'aws_access_key', or 'aws_secret_key'")
        
        return tokens
    
    def clear_history(self):
        """Clear the history of generated tokens."""
        self.generated_tokens.clear()
    
    def get_generated_count(self) -> int:
        """Get the number of unique tokens generated so far."""
        return len(self.generated_tokens)


def main():
    """Main function with command line argument parsing."""
    parser = argparse.ArgumentParser(
        description="Generate fake tokens for testing (GitHub, GitLab, NPM, and AWS)",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s                          # Generate 1 GitHub classic token
  %(prog)s -c 5                     # Generate 5 GitHub classic tokens
  %(prog)s -t github_fine_grained   # Generate GitHub fine-grained token
  %(prog)s -t gitlab                # Generate GitLab token
  %(prog)s -t npm                   # Generate NPM token
  %(prog)s -t aws_access_key        # Generate AWS access key
  %(prog)s -t aws_secret_key        # Generate AWS secret key
  %(prog)s -c 3 -t aws_access_key   # Generate 3 AWS access keys
        """
    )
    
    parser.add_argument(
        "-c", "--count",
        type=int,
        default=1,
        help="Number of tokens to generate (default: 1)"
    )
    
    parser.add_argument(
        "-t", "--type",
        choices=["github_classic", "github_fine_grained", "gitlab", "npm", "aws_access_key", "aws_secret_key"],
        default="github_classic",
        help="Token type to generate (default: github_classic)"
    )
    
    args = parser.parse_args()
    
    generator = TestTokenGenerator()
    
    # Generate and output tokens
    tokens = generator.generate_batch(args.count, args.type)
    for token in tokens:
        print(token)


if __name__ == "__main__":
    main()
