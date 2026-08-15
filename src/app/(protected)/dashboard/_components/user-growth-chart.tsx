'use client'

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/app/_components/ui/chart'

type UserGrowthChartProps = {
  data: { month: string; total: number }[]
}

const chartConfig = {
  total: {
    label: 'Usuários',
    color: '#003d9b',
  },
} satisfies ChartConfig

const UserGrowthChart = ({ data }: UserGrowthChartProps) => {
  return (
    <ChartContainer config={chartConfig} className='aspect-auto h-64 w-full'>
      <LineChart data={data} margin={{ left: -20, right: 12, top: 12 }}>
        <CartesianGrid vertical={false} stroke='#eaf5fc' />
        <XAxis
          dataKey='month'
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          className='capitalize'
        />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} width={40} />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent labelClassName='capitalize' />}
        />
        <Line
          dataKey='total'
          type='monotone'
          stroke='var(--color-total)'
          strokeWidth={2}
          dot={{ fill: 'var(--color-total)', r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ChartContainer>
  )
}

export default UserGrowthChart
