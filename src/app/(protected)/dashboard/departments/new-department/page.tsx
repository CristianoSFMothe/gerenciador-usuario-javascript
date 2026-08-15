import { getCompanyOptions } from '@/app/(protected)/_actions/companies/get-company-options'

import DepartmentForm from '../_components/department-form'

const NewDepartmentPage = async () => {
  const companies = await getCompanyOptions()

  return (
    <div className='p-4 sm:p-8'>
      <DepartmentForm companies={companies} />
    </div>
  )
}

export default NewDepartmentPage
