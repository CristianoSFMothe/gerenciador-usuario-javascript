import { getCompanyOptions } from '@/app/(protected)/_actions/companies/get-company-options'

import CreatePositionForm from '../_components/create-position-form'

const NewPositionPage = async () => {
  const companies = await getCompanyOptions()

  return (
    <div className='p-4 sm:p-8'>
      <CreatePositionForm companies={companies} />
    </div>
  )
}

export default NewPositionPage
