import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Painel Administrativo',
  description: 'Painel de administração do LibMatch - Gerencie usuários, pagamentos e deployments',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  )
}