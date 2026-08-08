import { getCompanyOptions } from '@/app/(protected)/_actions/companies/get-company-options'
import { getDepartmentOptions } from '@/app/(protected)/_actions/departments/get-department-options'
import { getPositionOptions } from '@/app/(protected)/_actions/positions/get-position-options'

import CreateEmployeeForm from '../_components/create-employee-form'

const NewEmployeePage = async () => {
  const [companies, positions, departments] = await Promise.all([
    getCompanyOptions(),
    getPositionOptions(),
    getDepartmentOptions(),
  ])

  return (
    <div className='p-4 sm:p-8'>
      <CreateEmployeeForm
        companies={companies}
        positions={positions}
        departments={departments}
      />
    </div>
  )
}

export default NewEmployeePage
