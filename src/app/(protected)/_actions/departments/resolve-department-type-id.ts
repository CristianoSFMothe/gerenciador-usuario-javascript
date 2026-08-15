import { prisma } from '@/app/_lib/prisma'

import { OTHER_DEPARTMENT_TYPE_VALUE } from './department-type-constants'

export const resolveDepartmentTypeId = async (
  departmentTypeId: string,
  customDepartmentName: string | undefined,
) => {
  if (departmentTypeId !== OTHER_DEPARTMENT_TYPE_VALUE) {
    return departmentTypeId
  }

  const name = customDepartmentName?.trim() ?? ''

  const departmentType = await prisma.departmentType.upsert({
    where: { name },
    update: {},
    create: { name },
  })

  return departmentType.id
}
