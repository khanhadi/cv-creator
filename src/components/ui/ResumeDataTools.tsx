// @ts-nocheck
import { useState, useEffect, useCallback, useRef } from 'react'
import { toast } from 'sonner'
import validateResumeData from '../../utils/validateResumeData'
import { Button } from '../ui/button'
import { Upload } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'

export default function ResumeDataTools({ resumeData, resumeDataHandler, uiState, setUiState, handlers }) {
  const [exportUrl, setExportUrl] = useState(null)
  const [importOpen, setImportOpen] = useState(false)
  const [resetOpen, setResetOpen] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const isProcessingExport = useRef(false)
  const exportLinkRef = useRef(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (exportUrl && exportLinkRef.current && !isProcessingExport.current) {
      isProcessingExport.current = true
      exportLinkRef.current.click()
      URL.revokeObjectURL(exportUrl)
      setTimeout(() => { setExportUrl(null); isProcessingExport.current = false }, 0)
    }
  }, [exportUrl])

  const handleExport = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (isProcessingExport.current) return
    const blob = new Blob([JSON.stringify(resumeData, null, 2)], { type: 'application/json' })
    toast.success('Resume data exported!')
    setExportUrl(URL.createObjectURL(blob))
  }, [resumeData])

  const handleImport = useCallback((file) => {
    if (!file) { toast.error('No file selected'); return }
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result)
        if (validateResumeData(importedData)) {
          handlers.resumeDataHandler(importedData, true)
          toast.success('Resume data imported!')
          setUiState((prev) => ({ ...prev, loadedFile: file.name }))
          setImportOpen(false)
        } else {
          toast.error('Invalid resume data format.')
        }
      } catch {
        toast.error('Error reading file. Check the format.')
      }
    }
    reader.onerror = () => toast.error('Error reading file.')
    reader.readAsText(file)
  }, [handlers, setUiState])

  const handleDrag = (e) => {
    e.preventDefault(); e.stopPropagation()
    setDragActive(e.type === 'dragenter' || e.type === 'dragover')
  }

  return (
    <div className="flex items-center">
      <div className="flex flex-col px-1 py-2">
        {uiState.loadedFile && (
          <span className="mb-1 text-xs text-zinc-400">{uiState.loadedFile}</span>
        )}
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={handleExport}>Export</Button>
          <a ref={exportLinkRef} href={exportUrl}
            download={resumeData.fullName?.split(' ')[0] + '_resume_data.json'}
            className="hidden" />
          <Button variant="secondary" size="sm" onClick={() => setImportOpen(true)}>Import</Button>
          <Button variant="secondary" size="sm" onClick={() => setResetOpen(true)}>Reset</Button>
        </div>
      </div>

      {/* Import dialog */}
      <Dialog open={importOpen} onOpenChange={setImportOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Import Resume Data</DialogTitle></DialogHeader>
          <div
            className={`flex h-56 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 transition ${
              dragActive ? 'border-primary bg-primary/5' : 'border-zinc-300'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={(e) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); if (e.dataTransfer.files[0]) handleImport(e.dataTransfer.files[0]) }}
          >
            <Upload size={40} className="mb-3 text-zinc-400" />
            <p className="mb-1 text-sm text-zinc-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
            <p className="text-xs text-zinc-400">JSON files only</p>
            <input ref={fileInputRef} type="file" className="hidden" accept=".json"
              onChange={(e) => { if (e.target.files[0]) handleImport(e.target.files[0]) }} />
            <Button size="sm" className="mt-4" onClick={() => fileInputRef.current.click()}>Select File</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reset dialog */}
      <Dialog open={resetOpen} onOpenChange={setResetOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Reset resume data</DialogTitle></DialogHeader>
          <p className="text-sm text-zinc-600">
            Are you sure you want to <span className="font-semibold text-zinc-900">reset</span> all resume data? This cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setResetOpen(false)}>Cancel</Button>
            <Button variant="destructive" size="sm" onClick={() => {
              resumeDataHandler({}, false, true)
              setUiState((prev) => ({ ...prev, loadedFile: '' }))
              setResetOpen(false)
              toast.success('Resume data reset.')
            }}>Reset</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
