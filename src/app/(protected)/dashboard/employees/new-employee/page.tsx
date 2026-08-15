import { getCompanyOptions } from '@/app/(protected)/_actions/companies/get-company-options'
import { getDepartmentTypes } from '@/app/(protected)/_actions/departments/get-department-types'
import { getPositionOptions } from '@/app/(protected)/_actions/positions/get-position-options'

import CreateEmployeeForm from '../_components/create-employee-form'

const NewEmployeePage = async () => {
  const [companies, positions, departmentTypes] = await Promise.all([
    getCompanyOptions(),
    getPositionOptions(),
    getDepartmentTypes(),
  ])

  return (
    <div className='p-4 sm:p-8'>
      <CreateEmployeeForm
        companies={companies}
        positions={positions}
        departmentTypes={departmentTypes}
      />
    </div>
  )
}

export default NewEmployeePage
