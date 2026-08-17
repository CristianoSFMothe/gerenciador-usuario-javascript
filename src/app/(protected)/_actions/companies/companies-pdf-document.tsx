import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: { padding: 24, fontSize: 8, fontFamily: 'Helvetica' },
  title: { fontSize: 14, fontWeight: 700, color: '#121d22', marginBottom: 4 },
  subtitle: { fontSize: 9, color: '#434654', marginBottom: 12 },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#dfe1e6',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#dfe1e6',
  },
  cellHeader: {
    fontSize: 7,
    fontWeight: 700,
    color: '#434654',
    textTransform: 'uppercase',
    paddingHorizontal: 4,
  },
  cell: { fontSize: 8, color: '#121d22', paddingHorizontal: 4 },
  footer: {
    position: 'absolute',
    bottom: 16,
    left: 24,
    right: 24,
    fontSize: 7,
    color: '#737685',
    textAlign: 'center',
  },
})

export type CompanyPdfRow = {
  tradeName: string
  legalName: string
  cnpj: string
  email: string
  website: string
  landlinePhone: string
  postalCode: string
  status: string
}

type CompaniesPdfDocumentProps = {
  companies: CompanyPdfRow[]
  generatedAt: Date
}

const COLUMNS: { key: keyof CompanyPdfRow; label: string; width: string }[] = [
  { key: 'tradeName', label: 'Nome', width: '15%' },
  { key: 'legalName', label: 'Razão Social', width: '20%' },
  { key: 'cnpj', label: 'CNPJ', width: '13%' },
  { key: 'email', label: 'Email', width: '18%' },
  { key: 'website', label: 'Site', width: '14%' },
  { key: 'landlinePhone', label: 'Telefone', width: '11%' },
  { key: 'status', label: 'Status', width: '9%' },
]

const CompaniesPdfDocument = ({
  companies,
  generatedAt,
}: CompaniesPdfDocumentProps) => (
  <Document>
    <Page size='A4' orientation='landscape' style={styles.page}>
      <Text style={styles.title}>Listagem de Empresas</Text>
      <Text style={styles.subtitle}>
        Gerado em {generatedAt.toLocaleString('pt-BR')} — {companies.length}{' '}
        registro(s)
      </Text>

      <View style={styles.headerRow} fixed>
        {COLUMNS.map((column) => (
          <Text
            key={column.key}
            style={[styles.cellHeader, { width: column.width }]}
          >
            {column.label}
          </Text>
        ))}
      </View>

      {companies.map((company, index) => (
        <View key={index} style={styles.row} wrap={false}>
          {COLUMNS.map((column) => (
            <Text
              key={column.key}
              style={[styles.cell, { width: column.width }]}
            >
              {company[column.key]}
            </Text>
          ))}
        </View>
      ))}

      <Text
        style={styles.footer}
        render={({ pageNumber, totalPages }) =>
          `Página ${pageNumber} de ${totalPages}`
        }
        fixed
      />
    </Page>
  </Document>
)

export default CompaniesPdfDocument
