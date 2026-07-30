'use client'

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div>
      <p>Algo deu errado.</p>
      <button onClick={reset}>Tentar novamente</button>
    </div>
  )
}
