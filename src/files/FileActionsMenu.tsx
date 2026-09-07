import { useEffect, useRef, useState } from 'react'
import { DownloadIcon, EyeIcon, MenuIcon, TrashIcon } from '../components/icons'

interface FileActionsMenuProps {
  canDownload: boolean
  canDelete: boolean
  onView: () => void
  onDownload: () => void
  onDelete: () => void
}

export function FileActionsMenu({ canDownload, canDelete, onView, onDownload, onDelete }: FileActionsMenuProps) {
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node
      if (containerRef.current?.contains(target)) return
      setOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  const toggleOpen = () => {
    if (!open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setPosition({ top: rect.bottom + 4, left: rect.right - 170 })
    }
    setOpen((value) => !value)
  }

  const runAndClose = (action: () => void) => {
    setOpen(false)
    action()
  }

  return (
    <div className="actions-menu" ref={containerRef}>
      <button
        type="button"
        ref={triggerRef}
        className="actions-menu-trigger"
        onClick={toggleOpen}
        aria-label="Acciones"
        title="Acciones"
      >
        <MenuIcon />
      </button>
      {open && position && (
        <div className="actions-menu-list" style={{ top: position.top, left: position.left }}>
          {canDownload && (
            <button type="button" onClick={() => runAndClose(onView)}>
              <EyeIcon /> Ver
            </button>
          )}
          {canDownload && (
            <button type="button" onClick={() => runAndClose(onDownload)}>
              <DownloadIcon /> Descargar
            </button>
          )}
          {canDelete && (
            <button type="button" className="danger" onClick={() => runAndClose(onDelete)}>
              <TrashIcon /> Eliminar
            </button>
          )}
        </div>
      )}
    </div>
  )
}
