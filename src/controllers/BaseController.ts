import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse } from '../types';

export abstract class BaseController {
  protected async handleRequest<T>(
    request: NextRequest,
    handler: () => Promise<T>
  ): Promise<NextResponse> {
    try {
      const result = await handler();
      return this.success(result);
    } catch (error) {
      return this.error(
        error instanceof Error ? error.message : 'Internal server error',
        500
      );
    }
  }

  protected success<T>(data: T, status: number = 200): NextResponse {
    const response: ApiResponse<T> = {
      success: true,
      data,
    };
    return NextResponse.json(response, { status });
  }

  protected error(message: string, status: number = 400): NextResponse {
    const response: ApiResponse = {
      success: false,
      error: message,
    };
    return NextResponse.json(response, { status });
  }

  protected async parseBody<T>(request: NextRequest): Promise<T> {
    try {
      return await request.json();
    } catch {
      throw new Error('Invalid JSON body');
    }
  }

  protected getQueryParam(request: NextRequest, key: string): string | null {
    return request.nextUrl.searchParams.get(key);
  }

  protected getPathParam(url: string, paramName: string): string {
    // Extract parameter from URL path
    const segments = url.split('/');
    const paramIndex = segments.indexOf(paramName) + 1;
    return segments[paramIndex] || '';
  }
}