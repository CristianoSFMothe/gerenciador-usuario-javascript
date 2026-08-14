import { notFound } from 'next/navigation'

import { getCompany } from '@/app/(protected)/_actions/companies/get-company'

import CompanyForm from '../../_components/company-form'

type EditCompanyPageProps = {
  params: Promise<{ id: string }>
}

const EditCompanyPage = async ({ params }: EditCompanyPageProps) => {
  const { id } = await params
  const company = await getCompany(id)

  if (!company) notFound()

  return (
    <div className='p-4 sm:p-8'>
      <CompanyForm company={company} />
    </div>
  )
}

export default EditCompanyPage
