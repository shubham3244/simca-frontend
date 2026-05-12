import { useRef, type ChangeEvent, type DragEvent } from 'react';
import { cn } from '../../../../utils/cn';

interface UploadDocumentsStepProps {
  damagePhotos: File[];
  supportingDocs: File[];
  onDamagePhotosChange: (files: File[]) => void;
  onSupportingDocsChange: (files: File[]) => void;
  damagePhotosError?: string;
}

export function UploadDocumentsStep({
  damagePhotos,
  supportingDocs,
  onDamagePhotosChange,
  onSupportingDocsChange,
  damagePhotosError,
}: UploadDocumentsStepProps) {
  return (
    <section>
      <h2 className="text-2xl font-bold text-foreground">Upload Documents</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Please upload photos of the damage and any supporting documents.
      </p>

      <div className="mt-6 flex flex-col gap-6">
        <DropZone
          label="Photos of Damage"
          required
          accept="image/*"
          multiple
          files={damagePhotos}
          onFilesChange={onDamagePhotosChange}
          primaryHint="Drag and drop photos here, or click to browse"
          secondaryHint="Recommended: Multiple angles showing the full extent of damage"
          error={damagePhotosError}
        />

        <DropZone
          label="Supporting Documents"
          accept="image/*,application/pdf"
          multiple
          files={supportingDocs}
          onFilesChange={onSupportingDocsChange}
          primaryHint="Drag and drop documents here, or click to browse"
          secondaryHint="Police report, insurance documents, etc."
        />
      </div>
    </section>
  );
}

interface DropZoneProps {
  label: string;
  required?: boolean;
  accept: string;
  multiple?: boolean;
  files: File[];
  onFilesChange: (files: File[]) => void;
  primaryHint: string;
  secondaryHint: string;
  error?: string;
}

function DropZone({
  label,
  required,
  accept,
  multiple,
  files,
  onFilesChange,
  primaryHint,
  secondaryHint,
  error,
}: DropZoneProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => inputRef.current?.click();

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const list = event.target.files;
    if (!list) return;
    const next = multiple ? [...files, ...Array.from(list)] : Array.from(list);
    onFilesChange(next);
    event.target.value = ''; // allow re-selecting the same file
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const dropped = Array.from(event.dataTransfer.files);
    const next = multiple ? [...files, ...dropped] : dropped;
    onFilesChange(next);
  };

  const handleRemove = (index: number) => {
    const next = files.filter((_, i) => i !== index);
    onFilesChange(next);
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </span>

      <div
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed bg-background px-6 py-10 text-center transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          error ? 'border-destructive' : 'border-border',
        )}
      >
        <svg
          className="size-8 text-muted-foreground"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <p className="mt-3 text-sm font-medium text-foreground">{primaryHint}</p>
        <p className="mt-1 text-xs text-muted-foreground">{secondaryHint}</p>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          className="hidden"
        />
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}

      {files.length > 0 && (
        <ul className="mt-2 flex flex-col gap-1.5">
          {files.map((file, i) => (
            <li
              key={`${file.name}-${i}`}
              className="flex items-center justify-between rounded-md border border-border bg-background px-3 py-2 text-sm"
            >
              <div className="flex items-center gap-2 truncate">
                <svg
                  className="size-4 shrink-0 text-muted-foreground"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                <span className="truncate text-foreground">{file.name}</span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {formatBytes(file.size)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleRemove(i)}
                aria-label={`Remove ${file.name}`}
                className="text-muted-foreground hover:text-destructive"
              >
                <svg
                  className="size-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
