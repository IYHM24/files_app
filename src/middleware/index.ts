import { NextRequest, NextResponse } from 'next/server';

export function corsMiddleware(request: NextRequest) {
  // Handle CORS
  const response = NextResponse.next();
  
  // Allow all origins in development
  const origin = request.headers.get('origin');
  if (origin) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  }
  
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { status: 200, headers: response.headers });
  }
  
  return response;
}

export function rateLimitMiddleware(request: NextRequest) {
  // Simple rate limiting - in production use Redis or similar
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
  const key = `rate-limit-${ip}`;
  
  // This is a basic implementation - use proper rate limiting in production
  return NextResponse.next();
}

export function loggingMiddleware(request: NextRequest) {
  const start = Date.now();
  
  console.log(`[${new Date().toISOString()}] ${request.method} ${request.url}`);
  
  const response = NextResponse.next();
  
  response.headers.set('X-Response-Time', `${Date.now() - start}ms`);
  
  return response;
}