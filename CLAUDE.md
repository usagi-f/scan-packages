# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Status

This project is a CLI command provided by npm packages. When executed, it will scan the contents of the node_modules installed in the project and list the capacity of each package.

## Initial Setup Commands

```bash
npm init -y                    # Initialize package.json
npm install                    # Install dependencies after adding them
```

## Expected Development Commands

```bash
npm test                       # Run tests
npm run scan-packages          # Run CLI command localy
npm run typecheck              # TypeScript type checking 
```
