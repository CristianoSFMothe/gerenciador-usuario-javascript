import { getCompanyOptions } from '@/app/(protected)/_actions/companies/get-company-options'
import { getDepartmentTypes } from '@/app/(protected)/_actions/departments/get-department-types'

import CreateEmployeeForm from '../_components/create-employee-form'

const NewEmployeePage = async () => {
  const [companies, departmentTypes] = await Promise.all([
    getCompanyOptions(),
    getDepartmentTypes(),
  ])

  return (
    <div className='p-4 sm:p-8'>
      <CreateEmployeeForm
        companies={companies}
        departmentTypes={departmentTypes}
      />
    </div>
  )
}

export default NewEmployeePage
