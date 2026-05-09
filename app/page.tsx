'use client';

import { FormEvent, useEffect, useState } from 'react';

type JobStatus = {
  jobId: string;
  state: 'queued' | 'running' | 'done' | 'error';
  logs: string[];
  downloadUrl?: string;
  engine?: string;
};

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<JobStatus | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!status?.jobId || status.state === 'done' || status.state === 'error') return;

    const timer = setInterval(async () => {
      const res = await fetch(`/api/status/${status.jobId}`);
      if (!res.ok) return;
      const next = (await res.json()) as JobStatus;
      setStatus(next);
    }, 1500);

    return () => clearInterval(timer);
  }, [status?.jobId, status?.state]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setBusy(true);
    const fd = new FormData();
    fd.append('modZip', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const data = (await res.json()) as JobStatus;
    setStatus(data);
    setBusy(false);
  };

  return (
    <main style={{ maxWidth: 800, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1>FNF HTML5 Port Builder</h1>
      <p>Upload a mods ZIP. We detect engine, compile, and return web_export.zip.</p>

      <form onSubmit={submit} style={{ border: '1px dashed #888', padding: 20, borderRadius: 8 }}>
        <input type="file" accept=".zip" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        <button type="submit" disabled={!file || busy} style={{ marginLeft: 12 }}>
          {busy ? 'Uploading...' : 'Start Build'}
        </button>
      </form>

      {status && (
        <section style={{ marginTop: 24 }}>
          <h2>Status: {status.state}</h2>
          <p><strong>Engine:</strong> {status.engine ?? 'Detecting...'}</p>
          <pre style={{ background: '#111', color: '#0f0', padding: 12, minHeight: 180 }}>
            {status.logs.join('\n')}
          </pre>
          {status.downloadUrl && (
            <a href={status.downloadUrl} download>
              Download web_export.zip
            </a>
          )}
        </section>
      )}
    </main>
  );
}
