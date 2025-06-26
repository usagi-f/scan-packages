import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('scan-packages', () => {
  let formatBytes, getDirectorySize, scanNodeModules;

  beforeEach(async () => {
    // Dynamically import the module
    const module = await import('../scan-packages.js');
    ({ formatBytes, getDirectorySize, scanNodeModules } = module);
  });

  describe('formatBytes', () => {
    it('should format 0 bytes correctly', () => {
      expect(formatBytes(0)).toBe('0 B');
    });

    it('should format bytes correctly', () => {
      expect(formatBytes(512)).toBe('512 B');
      expect(formatBytes(1023)).toBe('1023 B');
    });

    it('should format KB correctly', () => {
      expect(formatBytes(1024)).toBe('1 KB');
      expect(formatBytes(1536)).toBe('1.5 KB');
      expect(formatBytes(2048)).toBe('2 KB');
    });

    it('should format MB correctly', () => {
      expect(formatBytes(1024 * 1024)).toBe('1 MB');
      expect(formatBytes(1.5 * 1024 * 1024)).toBe('1.5 MB');
    });

    it('should format GB correctly', () => {
      expect(formatBytes(1024 * 1024 * 1024)).toBe('1 GB');
      expect(formatBytes(2.5 * 1024 * 1024 * 1024)).toBe('2.5 GB');
    });
  });

  describe('getDirectorySize', () => {
    it('should handle non-existent directory gracefully', () => {
      // Test with a non-existent directory - should return 0 due to error handling
      const result = getDirectorySize('/absolutely/fake/path/that/does/not/exist');
      expect(result).toBe(0);
    });
  });

  describe('scanNodeModules', () => {
    let consoleSpy;

    beforeEach(() => {
      consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
      consoleSpy.mockRestore();
    });

    it('should handle missing node_modules directory', () => {
      scanNodeModules('/absolutely/fake/path/that/does/not/exist');
      
      expect(consoleSpy).toHaveBeenCalledWith('node_modules directory not found.');
      expect(consoleSpy).toHaveBeenCalledWith('Please run npm install to install packages.');
    });

    it('should scan existing node_modules directory', () => {
      // Use the actual node_modules directory for this test
      scanNodeModules('./node_modules');
      
      expect(consoleSpy).toHaveBeenCalledWith('Node Modules Package Size List\n');
      // Should have at least vitest in output
      const calls = consoleSpy.mock.calls.flat();
      const hasPackages = calls.some(call => typeof call === 'string' && call.includes('vitest'));
      expect(hasPackages).toBe(true);
    });
  });
});