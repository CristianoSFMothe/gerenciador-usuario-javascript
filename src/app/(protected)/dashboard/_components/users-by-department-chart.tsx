'use client'

import { Cell, Pie, PieChart } from 'recharts'

import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/app/_components/ui/chart'

type UsersByDepartmentChartProps = {
  data: { name: string; count: number }[]
}

const PALETTE = [
  '#003d9b',
  '#38bdf8',
  '#a5b4fc',
  '#0f766e',
  '#f59e0b',
  '#d93025',
  '#7c3aed',
  '#059669',
  '#db2777',
  '#64748b',
]

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
      <div
        data-testid='dashboard-department-chart-empty'
        className='flex h-64 w-full items-center justify-center text-sm text-[#434654] dark:text-[#94a3b8]'
      >
        Nenhum departamento cadastrado.
      </div>
    )
  }

  const chartConfig = buildChartConfig(data)

  return (
    <ChartContainer
      data-testid='dashboard-department-chart'
      config={chartConfig}
      className='aspect-auto h-80 w-full'
    >
      <PieChart>
        <ChartTooltip
          content={
            <ChartTooltipContent
              nameKey='name'
              hideLabel
              formatter={(value, name, _item, index) => (
                <div className='flex w-full items-center gap-1.5'>
                  <span
                    className='size-2.5 shrink-0 rounded-[2px]'
                    style={{ backgroundColor: PALETTE[index % PALETTE.length] }}
                  />
                  <span className='text-[#434654] dark:text-[#94a3b8]'>
                    {name}
                    <span className='font-semibold text-[#121d22] dark:text-[#f1f5f9]'>
                      {' '}
                      - {value}
                    </span>
                  </span>
                </div>
              )}
            />
          }
        />
        <Pie
          data={data}
          dataKey='count'
          nameKey='name'
          innerRadius='50%'
          outerRadius='80%'
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
        <ChartLegend
          content={
            <ChartLegendContent
              nameKey='name'
              className='grid grid-cols-4 gap-x-4 gap-y-2'
            />
          }
        />
      </PieChart>
    </ChartContainer>
  )
}

export default UsersByDepartmentChart
