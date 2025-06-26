# scan-packages

A CLI tool to analyze and display the size of packages in your node_modules directory.

## Overview

This tool scans your project's node_modules directory and provides a comprehensive list of all installed packages along with their disk usage. It helps developers understand which packages are consuming the most space in their projects.

## Features

- Lists all packages with their sizes in human-readable format (B, KB, MB, GB)
- Supports both regular and scoped packages (@scope/package)
- Sorts packages by size (largest first)
- Shows total package count and combined size
- Handles custom node_modules paths
- Gracefully handles read errors and missing directories

## Installation

Clone this repository and install:

```bash
git clone <repository-url>
cd scan-packages
npm install
```

## Usage

### Run locally
```bash
npm run scan-packages
```

### Run with custom path
```bash
node scan-packages.js /path/to/node_modules
```

### Global installation
```bash
npm install -g .
scan-packages
```

## Output Example

```
Node Modules Package Size List

Package Name                            Size
-------------------------------------------------------
@babel/core                             15.2 MB
webpack                                 8.9 MB
typescript                              6.4 MB
@types/node                             2.1 MB
eslint                                  1.8 MB
-------------------------------------------------------
Total: 127 packages                     89.3 MB
```

## Requirements

- Node.js (any recent version)
- No external dependencies required