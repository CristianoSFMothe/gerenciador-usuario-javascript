export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      {/* sidebar + topbar */}
      {children}
    </div>
  )
}
