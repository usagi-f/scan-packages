#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getDirectorySize(dirPath) {
  let totalSize = 0;
  
  try {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const stats = fs.statSync(itemPath);
      
      if (stats.isDirectory()) {
        totalSize += getDirectorySize(itemPath);
      } else {
        totalSize += stats.size;
      }
    }
  } catch (error) {
    // Skip if directory cannot be read
    return 0;
  }
  
  return totalSize;
}

function scanNodeModules(nodeModulesPath = './node_modules') {
  if (!fs.existsSync(nodeModulesPath)) {
    console.log('node_modules directory not found.');
    console.log('Please run npm install to install packages.');
    return;
  }

  console.log('Node Modules Package Size List\n');
  console.log('Package Name'.padEnd(40) + 'Size');
  console.log('-'.repeat(55));

  const packages = [];
  
  try {
    const items = fs.readdirSync(nodeModulesPath);
    
    for (const item of items) {
      if (item.startsWith('.')) continue; // Skip hidden files/directories like .bin
      
      const packagePath = path.join(nodeModulesPath, item);
      const stats = fs.statSync(packagePath);
      
      if (stats.isDirectory()) {
        // Handle scoped packages (@xxx/yyy)
        if (item.startsWith('@')) {
          const scopedPackages = fs.readdirSync(packagePath);
          for (const scopedPackage of scopedPackages) {
            const scopedPackagePath = path.join(packagePath, scopedPackage);
            const scopedStats = fs.statSync(scopedPackagePath);
            
            if (scopedStats.isDirectory()) {
              const size = getDirectorySize(scopedPackagePath);
              packages.push({
                name: `${item}/${scopedPackage}`,
                size: size
              });
            }
          }
        } else {
          const size = getDirectorySize(packagePath);
          packages.push({
            name: item,
            size: size
          });
        }
      }
    }
    
    // Sort by size (largest first)
    packages.sort((a, b) => b.size - a.size);
    
    let totalSize = 0;
    for (const pkg of packages) {
      console.log(pkg.name.padEnd(40) + formatBytes(pkg.size));
      totalSize += pkg.size;
    }
    
    console.log('-'.repeat(55));
    console.log(`Total: ${packages.length} packages`.padEnd(40) + formatBytes(totalSize));
    
  } catch (error) {
    console.error('An error occurred:', error.message);
  }
}

// Allow specifying path via command line argument
const nodeModulesPath = process.argv[2] || './node_modules';
scanNodeModules(nodeModulesPath);