'use client'

import { Cell, Pie, PieChart } from 'recharts'

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/app/_components/ui/chart'

type UsersByDepartmentChartProps = {
  data: { name: string; count: number }[]
}

const PALETTE = ['#003d9b', '#38bdf8', '#a5b4fc', '#0f766e', '#dfe1e6']

const buildChartConfig = (data: { name: string }[]): ChartConfig =>
  data.reduce<ChartConfig>((config, item, index) => {
    config[item.name] = {
      label: item.name,
      color: PALETTE[index % PALETTE.length],
    }

    return config
  }, {})

const UsersByDepartmentChart = ({ data }: UsersByDepartmentChartProps) => {
  if (data.length === 0) {
    return (
      <div className='flex h-64 w-full items-center justify-center text-sm text-[#434654]'>
        Nenhum departamento cadastrado.
      </div>
    )
  }

  const chartConfig = buildChartConfig(data)

  return (
    <div className='flex h-64 w-full items-center justify-center gap-6'>
      <ChartContainer config={chartConfig} className='aspect-square h-full'>
        <PieChart>
          <ChartTooltip
            content={<ChartTooltipContent nameKey='name' hideLabel />}
          />
          <Pie
            data={data}
            dataKey='count'
            nameKey='name'
            innerRadius='60%'
            outerRadius='100%'
            strokeWidth={2}
          >
            {data.map((item, index) => (
              <Cell
                key={item.name}
                fill={PALETTE[index % PALETTE.length]}
                stroke='#ffffff'
              />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>

      <ul className='flex flex-col gap-2'>
        {data.map((item, index) => (
          <li key={item.name} className='flex items-center gap-2 text-sm'>
            <span
              className='size-2.5 shrink-0 rounded-full'
              style={{ backgroundColor: PALETTE[index % PALETTE.length] }}
            />
            <span className='text-[#434654]'>{item.name}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default UsersByDepartmentChart
