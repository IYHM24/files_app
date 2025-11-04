import { NextRequest } from 'next/server';
import { UserController } from '../../../../src/controllers';

const userController = new UserController();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return userController.getUserById(request, { params });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return userController.updateUser(request, { params });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return userController.deleteUser(request, { params });
}