import { NextRequest, NextResponse } from 'next/server';
import { readdir, stat } from 'fs/promises';
import { join } from 'path';

export async function GET() {
  try {
    const storageDir = join(process.cwd(), 'public', 'storage');
    
    // Función recursiva para listar archivos
    async function listFiles(dir: string, relativePath = ''): Promise<any[]> {
      const files: any[] = [];
      
      try {
        const items = await readdir(dir);
        
        for (const item of items) {
          if (item === '.gitkeep') continue; // Ignorar .gitkeep
          
          const fullPath = join(dir, item);
          const stats = await stat(fullPath);
          
          if (stats.isDirectory()) {
            const subFiles = await listFiles(fullPath, join(relativePath, item));
            files.push({
              name: item,
              type: 'directory',
              path: join(relativePath, item),
              files: subFiles
            });
          } else {
            files.push({
              name: item,
              type: 'file',
              size: stats.size,
              modified: stats.mtime,
              path: join(relativePath, item),
              publicUrl: `/storage/${join(relativePath, item).replace(/\\/g, '/')}`
            });
          }
        }
      } catch (error) {
        console.warn(`No se pudo leer el directorio: ${dir}`, error);
      }
      
      return files;
    }

    const files = await listFiles(storageDir);

    return NextResponse.json({
      success: true,
      storageDir,
      files
    });

  } catch (error) {
    console.error('Error listing files:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to list files',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}