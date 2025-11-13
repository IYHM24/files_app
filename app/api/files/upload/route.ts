import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, access } from 'fs/promises';
import { join } from 'path';

// Función para generar un nombre único si el archivo ya existe
async function generateUniqueFilename(dir: string, originalName: string): Promise<string> {
  const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.'));
  const extension = originalName.substring(originalName.lastIndexOf('.'));
  
  let filename = originalName;
  let counter = 1;
  
  while (true) {
    const fullPath = join(dir, filename);
    try {
      await access(fullPath);
      // El archivo existe, generar un nuevo nombre
      filename = `${nameWithoutExt}_(${counter})${extension}`;
      counter++;
    } catch {
      // El archivo no existe, usar este nombre
      break;
    }
  }
  
  return filename;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Convertir el archivo a Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Crear la ruta de destino en public/storage
    const uploadDir = join(process.cwd(), 'public', 'storage', file.type.split('/')[0]);
    
    // Crear el directorio si no existe
    await mkdir(uploadDir, { recursive: true });
    
    // Generar nombre único para evitar sobrescribir archivos
    const uniqueFilename = await generateUniqueFilename(uploadDir, file.name);
    const filePath = join(uploadDir, uniqueFilename);

  // Ruta relativa para servir el archivo (public) y vía API de servicio
  const publicPath = `/storage/${file.type.split('/')[0]}/${uniqueFilename}`;
  const servePath = `/api/files/serve/${file.type.split('/')[0]}/${encodeURIComponent(uniqueFilename)}`;

    try {
      // Guardar el archivo
      await writeFile(filePath, buffer);

      return NextResponse.json({
        success: true,
        message: 'File uploaded successfully',
        filename: uniqueFilename,
        originalName: file.name,
        size: file.size,
        type: file.type,
        path: filePath,
        publicUrl: publicPath, // URL para acceder al archivo desde el navegador
        serveUrl: servePath // URL para servir archivo vía API (stream)
      });
    } catch (writeError) {
      console.error('Error writing file:', writeError);
      return NextResponse.json(
        { error: 'Failed to save file' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error processing upload:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}