import { NextRequest } from 'next/server';
import { UserController } from '../../../../src/controllers';

const userController = new UserController();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  return userController.getUserById(request, { params: resolvedParams });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  return userController.updateUser(request, { params: resolvedParams });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  return userController.deleteUser(request, { params: resolvedParams });
}