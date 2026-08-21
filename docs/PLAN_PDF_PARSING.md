# Plan: Parse Uploaded Resume PDFs

## Goal

Replace the current filename-only behavior with real client-side PDF text extraction, then use the extracted resume content throughout analysis and refinement.

## Current Gap

- `UploadScreen` accepts a PDF and passes the `File` object upward.
- `App.handleAnalyze` discards the file contents and keeps only `file.name`.
- `analyzeResume()` always uses `SAMPLE_ANALYSIS` data.
- `ImproveResumeScreen` always refines `SAMPLE_RESUME`.
- There is no parsing error, unsupported-file, empty-document, or oversized-file state.

## Proposed Scope

### In Scope

- Validate uploaded files as PDFs and enforce the existing 10 MB limit.
- Extract text from text-based PDFs in the browser.
- Convert extracted text into the existing `ResumeData` shape.
- Pass parsed resume data into analysis and refinement.
- Preserve the sample-resume flow when no file is selected.
- Show actionable errors when parsing fails or produces no usable text.
- Keep generated PDF and Word exports working with parsed/edited data.

### Out of Scope for First Iteration

- OCR for scanned/image-only PDFs.
- DOC/DOCX parsing.
- Backend uploads or persistent storage.
- Real AI analysis.
- Perfect semantic extraction of every possible resume layout.

## Proposed Design

### 1. PDF Parser Module

Add a focused module such as `src/lib/parseResumePdf.ts`.

Responsibilities:

- Accept a `File`.
- Validate MIME type, extension, and file size.
- Read the file as an `ArrayBuffer`.
- Use a browser-compatible PDF text extraction library, likely `pdfjs-dist`.
- Extract text page by page and preserve page order.
- Normalize whitespace and line endings.
- Reject encrypted, corrupt, empty, or image-only PDFs with typed errors.

Suggested API:

```ts
type ParseResumeResult = {
  text: string;
  resume: ResumeData;
  pageCount: number;
};

async function parseResumePdf(file: File): Promise<ParseResumeResult>;
```

### 2. Resume Text Mapping

Add a separate mapping step rather than coupling PDF library details to UI components.

Suggested responsibilities:

- Identify common sections: contact, summary, skills, experience, projects, education, certifications, achievements.
- Parse section headings case-insensitively.
- Preserve unknown text instead of silently dropping it where practical.
- Use conservative defaults for missing sections.
- Generate stable IDs for experience, project, and education entries.
- Derive the candidate name from parsed contact text first, then fall back to the filename.

The first mapper should be deterministic and rule-based. It should produce usable structured data even when the resume format is imperfect, but it should not invent facts, metrics, skills, or employment history.

### 3. Application Flow Changes

Change the analysis callback from a synchronous simulation to an asynchronous operation.

Current conceptual flow:

```text
File -> filename -> simulated analysis
```

Target flow:

```text
File -> validate -> extract PDF text -> map to ResumeData -> analyze parsed data
```

Expected changes:

- `App.handleAnalyze` becomes `async` or delegates to an async handler.
- The parsed `ResumeData` is passed into `analyzeResume()`.
- `AnalysisResult` gains the parsed resume or a related source field so later screens use the same data.
- `ImproveResumeScreen` refines the parsed resume instead of `SAMPLE_RESUME`.
- The no-file path continues to use the existing sample data.

### 4. Analysis Changes

Update `analysis.ts` so analysis is based on the supplied resume data.

- Replace the hardcoded resume skill set with `resume.skills`.
- Use parsed resume content when calculating strengths, improvements, and missing skills.
- Pass parsed skills into job matching.
- Keep the current result types where possible to minimize UI changes.
- Keep sample constants as demo fixtures and fallback data only.

### 5. UI and Error States

Add explicit states at the application boundary:

- `idle`: ready for input.
- `parsing`: extracting and mapping the PDF.
- `analyzing`: generating analysis from parsed data.
- `error`: parse/validation failure with retry or replacement action.
- `results`: analysis completed.

User-facing errors should distinguish:

- File is not a PDF.
- File exceeds 10 MB.
- PDF is corrupt or encrypted.
- PDF contains no extractable text, likely because it is scanned.
- Resume text was extracted but could not be mapped into any usable content.

The existing loading UI should be updated so it does not imply AI analysis is happening while PDF parsing is still in progress.

## Data Contract

The parser must produce valid `ResumeData`:

- `contact` always exists, with empty strings for unavailable fields.
- `summary` is a string, possibly empty.
- `skills`, `experience`, `projects`, `education`, `certifications`, and `achievements` are always arrays.
- Missing values remain empty rather than being copied from `SAMPLE_RESUME`.
- Parsed content must be the source used by both analysis and refinement.

## Security and Reliability

- Process PDFs locally in the browser; do not upload resume contents.
- Do not render extracted text as HTML without escaping it.
- Enforce the size limit before reading the file.
- Release parser resources and avoid retaining `ArrayBuffer` data after parsing.
- Handle cancellation or stale results if the user starts a new analysis while parsing is active.
- Avoid logging resume text or personal contact information.

## Implementation Phases

### Phase 1: Parser Foundation

- Select and install a browser-compatible PDF text extraction dependency.
- Add typed parser errors and file validation constants.
- Implement page-by-page text extraction and normalization.
- Add unit tests for validation, empty PDFs, multi-page extraction, and parser failures.

### Phase 2: Resume Mapping

- Implement section detection and contact extraction.
- Implement mapping for skills, experience, projects, education, certifications, and achievements.
- Add filename fallback for the candidate name.
- Add fixtures representing common resume layouts and missing sections.

### Phase 3: Application Integration

- Pass `File` into the async parsing flow.
- Add parsing/analyzing/error state handling in `App` and `UploadScreen`.
- Pass parsed `ResumeData` into `AnalysisResult` and the improvement flow.
- Preserve the no-file sample behavior.

### Phase 4: Analysis and Refinement Integration

- Remove hardcoded skill comparison for uploaded resumes.
- Update refinement to operate on parsed data.
- Verify original/refined preview and both export formats.
- Ensure missing skills are recommendations only and never fabricated into the resume.

### Phase 5: Verification and Cleanup

- Test valid, invalid, corrupt, encrypted, empty, scanned, large, and multi-page PDFs.
- Run typecheck, lint, build, and automated tests.
- Check mobile behavior for parsing and error messages.
- Update `docs/LOW_LEVEL_DESIGN.md` to reflect the implemented architecture.

## Test Strategy

### Unit Tests

- File type and size validation.
- PDF text extraction and whitespace normalization.
- Section heading detection.
- Contact/name extraction.
- List and bullet parsing.
- Mapping with missing or reordered sections.
- Analysis based on supplied `ResumeData` rather than sample data.
- Refinement preserving parsed facts.

### Integration Tests

- Upload a text-based PDF and reach results using its actual content.
- Verify the candidate name and skills come from the PDF.
- Verify job matching uses parsed skills.
- Verify refinement and exports use the parsed resume.
- Verify no-file input still displays the sample demo.
- Verify parser failures return to a recoverable upload state.

## Acceptance Criteria

- A valid text-based uploaded PDF is actually read and parsed.
- Analysis no longer uses sample resume content for uploaded files.
- Parsed resume data is visible in the original preview.
- Job matching compares the job description against parsed skills.
- Refinement operates on parsed resume content and preserves facts.
- Invalid, oversized, corrupt, encrypted, and textless PDFs show clear errors.
- No-file demo behavior remains unchanged.
- PDF and Word exports work with parsed and edited resumes.
- Typecheck, lint, build, and tests pass.

## Decisions Needed Before Implementation

1. Should the first release support only text-based PDFs, or should scanned PDFs also be supported through OCR?
2. Is client-side-only processing required for privacy, or is a backend parser acceptable later?
3. Should unknown/unmapped resume text be shown to the user for manual correction?
4. Which PDF library is approved for bundle-size and licensing reasons?
