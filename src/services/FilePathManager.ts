import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { StorageSettings } from '@/types/news';

export class FilePathManager {
  private currentPath: string = '';
  private isInitialized: boolean = false;
  private readonly STORAGE_KEY = 'newsgen_storage_path';

  async initialize(): Promise<StorageSettings> {
    try {
      // First, try to load saved path from storage
      const savedPath = await this.loadSavedPath();
      
      if (savedPath) {
        const savedSettings = await this.validatePath(savedPath);
        if (savedSettings.isValid) {
          this.currentPath = savedPath;
          this.isInitialized = true;
          console.log('FilePathManager initialized with saved path:', savedPath);
          return savedSettings;
        } else {
          console.log('Saved path is no longer valid, falling back to default');
          await this.clearSavedPath();
        }
      }
      
      // Fallback to default path
      const defaultPath = await this.getDefaultPath();
      const storageSettings = await this.validatePath(defaultPath);
      
      if (storageSettings.isValid) {
        this.currentPath = defaultPath;
        this.isInitialized = true;
        await this.savePath(defaultPath);
        console.log('FilePathManager initialized with default path:', defaultPath);
      }

      return storageSettings;
    } catch (error) {
      console.error('Failed to initialize FilePathManager:', error);
      return {
        path: '',
        isValid: false,
        availableSpace: 0,
        totalSpace: 0
      };
    }
  }

  private async getDefaultPath(): Promise<string> {
    try {
      // Create NewsGen folder in Documents directory
      const newsGenPath = 'NewsGen';
      
      try {
        await Filesystem.mkdir({
          path: newsGenPath,
          directory: Directory.Documents,
          recursive: true
        });
      } catch (error) {
        // Directory might already exist
        console.log('NewsGen directory already exists or created');
      }

      return newsGenPath;
    } catch (error) {
      console.error('Failed to get default path:', error);
      throw error;
    }
  }

  async validatePath(path: string): Promise<StorageSettings> {
    try {
      // Test write access by creating a test file
      const testFileName = `test_${Date.now()}.txt`;
      const testContent = 'NewsGen test file';

      await Filesystem.writeFile({
        path: `${path}/${testFileName}`,
        data: testContent,
        directory: Directory.Documents,
        encoding: Encoding.UTF8
      });

      // Read it back to confirm
      await Filesystem.readFile({
        path: `${path}/${testFileName}`,
        directory: Directory.Documents,
        encoding: Encoding.UTF8
      });

      // Clean up test file
      await Filesystem.deleteFile({
        path: `${path}/${testFileName}`,
        directory: Directory.Documents
      });

      // Get storage info (mock values for now)
      const storageInfo = await this.getStorageInfo();

      return {
        path,
        isValid: true,
        availableSpace: storageInfo.availableSpace,
        totalSpace: storageInfo.totalSpace
      };

    } catch (error) {
      console.error('Path validation failed:', error);
      return {
        path,
        isValid: false,
        availableSpace: 0,
        totalSpace: 0
      };
    }
  }

  private async getStorageInfo(): Promise<{ availableSpace: number; totalSpace: number }> {
    try {
      // Note: Capacitor doesn't have direct storage info API
      // This would need to be implemented with a native plugin
      // For now, return mock values
      return {
        availableSpace: 5 * 1024 * 1024 * 1024, // 5GB
        totalSpace: 64 * 1024 * 1024 * 1024      // 64GB
      };
    } catch (error) {
      console.error('Failed to get storage info:', error);
      return { availableSpace: 0, totalSpace: 0 };
    }
  }

  async setCustomPath(customPath: string): Promise<StorageSettings> {
    const storageSettings = await this.validatePath(customPath);
    
    if (storageSettings.isValid) {
      this.currentPath = customPath;
      await this.savePath(customPath);
      console.log('Custom path set and saved:', customPath);
    }

    return storageSettings;
  }

  private async savePath(path: string): Promise<void> {
    try {
      // In a real mobile app, this would use SharedPreferences (Android) or UserDefaults (iOS)
      // For now, we'll use localStorage as a fallback
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(this.STORAGE_KEY, path);
      }
    } catch (error) {
      console.error('Failed to save path:', error);
    }
  }

  private async loadSavedPath(): Promise<string | null> {
    try {
      // In a real mobile app, this would read from SharedPreferences (Android) or UserDefaults (iOS)
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(this.STORAGE_KEY);
      }
      return null;
    } catch (error) {
      console.error('Failed to load saved path:', error);
      return null;
    }
  }

  private async clearSavedPath(): Promise<void> {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(this.STORAGE_KEY);
      }
    } catch (error) {
      console.error('Failed to clear saved path:', error);
    }
  }

  async saveImage(fileName: string, imageData: string): Promise<string> {
    if (!this.isInitialized || !this.currentPath) {
      throw new Error('FilePathManager not initialized or path not defined');
    }

    try {
      const fullPath = `${this.currentPath}/images/${fileName}`;
      
      // Ensure images directory exists
      try {
        await Filesystem.mkdir({
          path: `${this.currentPath}/images`,
          directory: Directory.Documents,
          recursive: true
        });
      } catch (error) {
        // Directory might already exist
      }

      // Save the image
      await Filesystem.writeFile({
        path: fullPath,
        data: imageData,
        directory: Directory.Documents
      });

      console.log('Image saved to:', fullPath);
      return fullPath;

    } catch (error) {
      console.error('Failed to save image:', error);
      throw new Error(`Failed to save image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async deleteImage(filePath: string): Promise<void> {
    try {
      await Filesystem.deleteFile({
        path: filePath,
        directory: Directory.Documents
      });
      console.log('Image deleted:', filePath);
    } catch (error) {
      console.error('Failed to delete image:', error);
      throw error;
    }
  }

  async listImages(): Promise<string[]> {
    if (!this.isInitialized || !this.currentPath) {
      return [];
    }

    try {
      const imagesPath = `${this.currentPath}/images`;
      const result = await Filesystem.readdir({
        path: imagesPath,
        directory: Directory.Documents
      });

      return result.files
        .filter(file => file.type === 'file' && /\.(jpg|jpeg|png|gif)$/i.test(file.name))
        .map(file => `${imagesPath}/${file.name}`);

    } catch (error) {
      console.error('Failed to list images:', error);
      return [];
    }
  }

  getCurrentPath(): string {
    return this.currentPath;
  }

  isPathValid(): boolean {
    return this.isInitialized && !!this.currentPath;
  }

  async getImageUri(filePath: string): Promise<string> {
    try {
      const result = await Filesystem.getUri({
        path: filePath,
        directory: Directory.Documents
      });
      return result.uri;
    } catch (error) {
      console.error('Failed to get image URI:', error);
      throw error;
    }
  }
}