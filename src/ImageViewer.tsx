import { useId, useRef } from 'react';
import { X, ZoomIn } from 'lucide-react';
import { Button } from './components/ui/button';

interface ImageViewerProps { imageUrl: string; title: string; caption: string; onOpen: () => void }

// Native modal behavior avoids Base UI 1.9's exposed, unnamed focus guards in WebKit.
// See the browser evidence and upstream issue in docs/IMPLEMENTATION-NOTES.md.
export function ImageViewer({ imageUrl, title, caption, onOpen }: ImageViewerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  return (
    <>
      <Button ref={triggerRef} variant="control" className="mx-auto mt-2 flex" onClick={() => { onOpen(); dialogRef.current?.showModal(); }}><ZoomIn data-icon="inline-start" />View larger</Button>
      <dialog ref={dialogRef} className="screenshot-viewer" aria-labelledby={titleId} aria-describedby={descriptionId} onClose={() => triggerRef.current?.focus()}>
        <div className="viewer-header"><h2 id={titleId}>{title}</h2><Button variant="control" aria-label="Close larger view" onClick={() => dialogRef.current?.close()}><X data-icon="inline-start" />Close</Button></div>
        <p id={descriptionId}>{caption}</p>
        <div className="screenshot-scroll" tabIndex={0} role="region" aria-label="App screenshot"><img src={imageUrl} alt={caption} width="720" height="1564" /></div>
      </dialog>
    </>
  );
}
