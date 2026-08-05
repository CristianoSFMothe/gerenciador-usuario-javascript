import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  logging: {
    // Evita que argumentos de Server Actions (ex.: senha em texto puro) sejam
    // impressos no terminal do servidor em modo dev.
    serverFunctions: false,
  },
}

export default nextConfig
