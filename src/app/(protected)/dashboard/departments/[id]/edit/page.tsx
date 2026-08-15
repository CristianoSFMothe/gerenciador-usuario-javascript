import { notFound } from 'next/navigation'

import { getCompanyOptions } from '@/app/(protected)/_actions/companies/get-company-options'
import { getDepartment } from '@/app/(protected)/_actions/departments/get-department'

import DepartmentForm from '../../_components/department-form'

type EditDepartmentPageProps = {
  params: Promise<{ id: string }>
}

const EditDepartmentPage = async ({ params }: EditDepartmentPageProps) => {
  const { id } = await params
  const [department, companies] = await Promise.all([
    getDepartment(id),
    getCompanyOptions(),
  ])

  if (!department) notFound()

  return (
    <div className='p-4 sm:p-8'>
      <DepartmentForm companies={companies} department={department} />
    </div>
  )
}

export default EditDepartmentPage
