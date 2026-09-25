import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { GalleryItem } from '@/models/GalleryItem';
import { getSessionFromRequest } from '@/lib/auth';
import { AuditLog } from '@/models/AuditLog';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    await connectToDatabase();
    const item = await GalleryItem.findByIdAndUpdate(id, { $set: body }, { new: true });
    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    await AuditLog.create({
      userId: session.userId,
      userEmail: session.email,
      action: 'UPDATE_GALLERY_ITEM',
      entity: 'GalleryItem',
      entityId: id,
      details: `Updated gallery item: ${item.title}`,
    });

    return NextResponse.json({ success: true, item });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update item' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = getSessionFromRequest(req);
    if (!session || (session.role !== 'SUPER_ADMIN' && session.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await connectToDatabase();
    const item = await GalleryItem.findByIdAndDelete(id);
    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    await AuditLog.create({
      userId: session.userId,
      userEmail: session.email,
      action: 'DELETE_GALLERY_ITEM',
      entity: 'GalleryItem',
      entityId: id,
      details: `Deleted gallery item: ${item.title}`,
    });

    return NextResponse.json({ success: true, message: 'Item deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete item' }, { status: 500 });
  }
}
