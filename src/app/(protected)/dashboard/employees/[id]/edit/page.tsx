import { notFound } from 'next/navigation'

import { getCompanyOptions } from '@/app/(protected)/_actions/companies/get-company-options'
import { getDepartmentTypes } from '@/app/(protected)/_actions/departments/get-department-types'
import { getEmployee } from '@/app/(protected)/_actions/employees/get-employee'

import EmployeeForm from '../../_components/employee-form'

type EditEmployeePageProps = {
  params: Promise<{ id: string }>
}

const EditEmployeePage = async ({ params }: EditEmployeePageProps) => {
  const { id } = await params
  const [employee, companies, departmentTypes] = await Promise.all([
    getEmployee(id),
    getCompanyOptions(),
    getDepartmentTypes(),
  ])

  if (!employee) notFound()

  return (
    <div className='p-4 sm:p-8'>
      <EmployeeForm
        companies={companies}
        departmentTypes={departmentTypes}
        employee={employee}
      />
    </div>
  )
}

export default EditEmployeePage
