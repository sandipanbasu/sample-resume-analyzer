import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('pdfjs-dist', () => ({
  getDocument: vi.fn(),
  GlobalWorkerOptions: { workerSrc: '' },
}));

import { MAX_RESUME_FILE_SIZE, parseResumePdf } from './parseResumePdf';
import { getDocument } from 'pdfjs-dist';

const mockedGetDocument = vi.mocked(getDocument);

describe('parseResumePdf validation', () => {
  beforeEach(() => mockedGetDocument.mockReset());

  it('rejects non-PDF files', async () => {
    const file = new File(['resume'], 'resume.txt', { type: 'text/plain' });

    await expect(parseResumePdf(file)).rejects.toMatchObject({
      code: 'invalid-file',
    });
  });

  it('rejects PDFs larger than 10 MB before parsing', async () => {
    const file = new File([new Uint8Array(MAX_RESUME_FILE_SIZE + 1)], 'resume.pdf', { type: 'application/pdf' });

    await expect(parseResumePdf(file)).rejects.toMatchObject({
      code: 'file-too-large',
    });
  });

  it('rejects a corrupt PDF', async () => {
    const file = new File(['not a real pdf'], 'resume.pdf', { type: 'application/pdf' });
    mockedGetDocument.mockReturnValue({ promise: Promise.reject(new Error('invalid')) } as never);

    await expect(parseResumePdf(file)).rejects.toMatchObject({
      code: 'invalid-pdf',
    });
  });
});
