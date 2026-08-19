import { renderToBuffer } from '@react-pdf/renderer'
import { headers } from 'next/headers'

import { auth } from '@/app/_lib/auth'

export type ExportPdfResult =
  | { success: true; base64: string; filename: string }
  | { success: false; message: string }

type PdfDocumentElement = Parameters<typeof renderToBuffer>[0]

type ExportPdfActionParams<TItem> = {
  fetchItems: () => Promise<TItem[]>
  emptyMessage: string
  filenamePrefix: string
  buildDocument: (items: TItem[]) => PdfDocumentElement
}

// fetchItems runs after the session check so unauthenticated requests never touch the database.
export const exportPdfAction = async <TItem>({
  fetchItems,
  emptyMessage,
  filenamePrefix,
  buildDocument,
}: ExportPdfActionParams<TItem>): Promise<ExportPdfResult> => {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    return {
      success: false,
      message: 'Sua sessão expirou. Faça login novamente.',
    }
  }

  const items = await fetchItems()

  if (items.length === 0) {
    return { success: false, message: emptyMessage }
  }

  const buffer = await renderToBuffer(buildDocument(items))

  return {
    success: true,
    base64: buffer.toString('base64'),
    filename: `${filenamePrefix}-${Date.now()}.pdf`,
  }
}
