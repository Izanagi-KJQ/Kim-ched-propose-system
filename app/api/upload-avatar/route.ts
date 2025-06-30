import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('avatar');
  if (!file || typeof file === 'string') {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }
  // @ts-ignore
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  // @ts-ignore
  const ext = file.name.split('.').pop();
  // @ts-ignore
  const filename = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
  const avatarsDir = path.join(process.cwd(), 'public', 'avatars');
  await fs.mkdir(avatarsDir, { recursive: true });
  const filePath = path.join(avatarsDir, filename);
  await fs.writeFile(filePath, buffer);
  const url = `/avatars/${filename}`;
  return NextResponse.json({ url });
} 