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

export type EmployeePdfRow = {
  registrationNumber: string
  firstName: string
  lastName: string
  cpf: string
  email: string
  phone: string
  companyName: string
  position: string
  departmentName: string
  status: string
}

type EmployeesPdfDocumentProps = {
  employees: EmployeePdfRow[]
  generatedAt: Date
}

const COLUMNS: { key: keyof EmployeePdfRow; label: string; width: string }[] = [
  { key: 'registrationNumber', label: 'Matrícula', width: '9%' },
  { key: 'firstName', label: 'Nome', width: '10%' },
  { key: 'lastName', label: 'Sobrenome', width: '10%' },
  { key: 'cpf', label: 'CPF', width: '12%' },
  { key: 'email', label: 'Email', width: '19%' },
  { key: 'companyName', label: 'Empresa', width: '14%' },
  { key: 'position', label: 'Cargo', width: '14%' },
  { key: 'status', label: 'Status', width: '8%' },
]

const EmployeesPdfDocument = ({
  employees,
  generatedAt,
}: EmployeesPdfDocumentProps) => (
  <Document>
    <Page size='A4' orientation='landscape' style={styles.page}>
      <Text style={styles.title}>Listagem de Funcionários</Text>
      <Text style={styles.subtitle}>
        Gerado em {generatedAt.toLocaleString('pt-BR')} — {employees.length}{' '}
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

      {employees.map((employee, index) => (
        <View key={index} style={styles.row} wrap={false}>
          {COLUMNS.map((column) => (
            <Text
              key={column.key}
              style={[styles.cell, { width: column.width }]}
            >
              {employee[column.key]}
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

export default EmployeesPdfDocument
