import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { detectEngineFromZipBuffer } from '@/lib/engineDetection';
import { jobStore } from '@/lib/jobStore';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('modZip');

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'modZip is required' }, { status: 400 });
  }

  const buf = Buffer.from(await file.arrayBuffer());
  const jobId = uuidv4();
  const engine = detectEngineFromZipBuffer(buf);

  jobStore.set({ jobId, state: 'queued', logs: ['Upload received', `Detected engine: ${engine}`], engine });

  setTimeout(() => {
    jobStore.update(jobId, { state: 'running', logs: [...(jobStore.get(jobId)?.logs ?? []), 'Initializing Haxe...', 'Compiling Assets...', 'Zipping Build...'] });
  }, 1500);

  setTimeout(() => {
    jobStore.update(jobId, {
      state: 'done',
      logs: [...(jobStore.get(jobId)?.logs ?? []), 'Build complete'],
      downloadUrl: `/download/${jobId}/web_export.zip`
    });
  }, 4000);

  return NextResponse.json(jobStore.get(jobId));
}
