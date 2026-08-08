import { getCompanyOptions } from '@/app/(protected)/_actions/companies/get-company-options'

import CreateDepartmentForm from '../_components/create-department-form'

const NewDepartmentPage = async () => {
  const companies = await getCompanyOptions()

  return (
    <div className='p-4 sm:p-8'>
      <CreateDepartmentForm companies={companies} />
    </div>
  )
}

export default NewDepartmentPage
