import { NextRequest, NextResponse } from 'next/server';
import { jobStore } from '@/lib/jobStore';

export async function GET(_: NextRequest, { params }: { params: { jobId: string } }) {
  const job = jobStore.get(params.jobId);
  if (!job) return NextResponse.json({ error: 'Job not found' }, { status: 404 });
  return NextResponse.json(job);
}
