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
    case 'avi': return 'video/x-msvideo';
    case 'mov': return 'video/quicktime';
    case 'wmv': return 'video/x-ms-wmv';
    case 'pdf': return 'application/pdf';
    case 'txt': return 'text/plain';
    case 'csv': return 'text/csv';
    case 'json': return 'application/json';
    default: return 'application/octet-stream';
  }
}

function isVideoFile(filename: string): boolean {
  const ext = filename.split('.').pop()?.toLowerCase();
  return ['mp4', 'webm', 'avi', 'mov', 'wmv'].includes(ext || '');
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    const resolvedParams = await params;
    const segments = resolvedParams.path || [];
    if (segments.length === 0) {
      return NextResponse.json({ error: 'No path provided' }, { status: 400 });
    }

    // Construir la ruta dentro de public/storage
    const filePath = join(process.cwd(), 'public', 'storage', ...segments);

    // Verificar existencia y obtener estadísticas del archivo
    let fileStats;
    try {
      fileStats = await stat(filePath);
    } catch (err) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const filename = segments[segments.length - 1];
    const mime = getMimeType(filename);
    const isVideo = isVideoFile(filename);

    // Para videos, soportar streaming con Range headers
    if (isVideo) {
      const range = request.headers.get('range');
      const fileSize = fileStats.size;

      if (range) {
        const parts = range.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunkSize = (end - start) + 1;

        const data = await readFile(filePath);
        const chunk = data.subarray(start, end + 1);

        const headers = new Headers();
        headers.set('Content-Range', `bytes ${start}-${end}/${fileSize}`);
        headers.set('Accept-Ranges', 'bytes');
        headers.set('Content-Length', chunkSize.toString());
        headers.set('Content-Type', mime);
        headers.set('Cache-Control', 'public, max-age=31536000');

        return new Response(chunk, { status: 206, headers });
      }
    }

    // Servir archivo completo
    const data = await readFile(filePath);
    const headers = new Headers();
    headers.set('Content-Type', mime);
    headers.set('Content-Length', fileStats.size.toString());
    
    if (isVideo) {
      headers.set('Accept-Ranges', 'bytes');
      headers.set('Cache-Control', 'public, max-age=31536000');
    }

    return new Response(data, { headers });
  } catch (error) {
    console.error('Error serving file:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
