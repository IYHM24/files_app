import { NextRequest, NextResponse } from 'next/server';
import { readFile, stat } from 'fs/promises';
import { join } from 'path';

function getMimeType(filename: string) {
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'png': return 'image/png';
    case 'jpg':
    case 'jpeg': return 'image/jpeg';
    case 'gif': return 'image/gif';
    case 'webp': return 'image/webp';
    case 'mp4': return 'video/mp4';
    case 'webm': return 'video/webm';
    case 'pdf': return 'application/pdf';
    case 'txt': return 'text/plain';
    case 'csv': return 'text/csv';
    case 'json': return 'application/json';
    default: return 'application/octet-stream';
  }
}

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    const segments = params.path || [];
    if (segments.length === 0) {
      return NextResponse.json({ error: 'No path provided' }, { status: 400 });
    }

    // Construir la ruta dentro de public/storage
    const filePath = join(process.cwd(), 'public', 'storage', ...segments);

    // Verificar existencia y leer archivo
    try {
      await stat(filePath);
    } catch (err) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const filename = segments[segments.length - 1];
    const mime = getMimeType(filename);

    const data = await readFile(filePath);
    const headers = new Headers();
    headers.set('Content-Type', mime);

    return new Response(data, { headers });
  } catch (error) {
    console.error('Error serving file:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
