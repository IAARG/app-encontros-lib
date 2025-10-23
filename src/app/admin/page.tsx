'use client'

import { useState } from 'react'

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [credentials, setCredentials] = useState({ username: '', password: '' })

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Autenticação simples para demonstração
    if (credentials.username === 'admin' && credentials.password === 'libmatch2024') {
      setIsAuthenticated(true)
    } else {
      alert('Credenciais inválidas')
    }
  }

  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1f2937',
        fontFamily: 'system-ui'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          width: '100%',
          maxWidth: '400px'
        }}>
          <h1 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '24px',
            textAlign: 'center'
          }}>
            🔐 Painel Administrativo
          </h1>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Usuário
              </label>
              <input
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '16px'
                }}
                required
              />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Senha
              </label>
              <input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '16px'
                }}
                required
              />
            </div>
            <button
              type="submit"
              style={{
                width: '100%',
                backgroundColor: '#ec4899',
                color: 'white',
                padding: '12px',
                border: 'none',
                borderRadius: '6px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      fontFamily: 'system-ui'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '16px 24px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#ec4899'
          }}>
            LibMatch Admin
          </h1>
          <button
            onClick={() => setIsAuthenticated(false)}
            style={{
              backgroundColor: '#ef4444',
              color: 'white',
              padding: '8px 16px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Sair
          </button>
        </div>
      </header>

      {/* Dashboard */}
      <main style={{ padding: '24px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          marginBottom: '32px'
        }}>
          {/* Estatísticas */}
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
              📊 Estatísticas
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Usuários Ativos:</span>
                <strong>1,247</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Matches Hoje:</span>
                <strong>89</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Receita Mensal:</span>
                <strong>R$ 15.680</strong>
              </div>
            </div>
          </div>

          {/* Usuários */}
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
              👥 Gerenciar Usuários
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button style={{
                padding: '12px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}>
                Ver Todos os Usuários
              </button>
              <button style={{
                padding: '12px',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}>
                Usuários Premium
              </button>
              <button style={{
                padding: '12px',
                backgroundColor: '#f59e0b',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}>
                Relatórios
              </button>
            </div>
          </div>

          {/* Configurações */}
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
              ⚙️ Configurações
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button style={{
                padding: '12px',
                backgroundColor: '#6366f1',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}>
                Configurações Gerais
              </button>
              <button style={{
                padding: '12px',
                backgroundColor: '#8b5cf6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}>
                Planos Premium
              </button>
              <button style={{
                padding: '12px',
                backgroundColor: '#ec4899',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}>
                Backup & Segurança
              </button>
            </div>
          </div>
        </div>

        {/* Atividade Recente */}
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
            📈 Atividade Recente
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ padding: '12px', backgroundColor: '#f3f4f6', borderRadius: '6px' }}>
              <strong>Novo usuário cadastrado:</strong> Maria Silva - há 5 minutos
            </div>
            <div style={{ padding: '12px', backgroundColor: '#f3f4f6', borderRadius: '6px' }}>
              <strong>Match realizado:</strong> João ❤️ Ana - há 12 minutos
            </div>
            <div style={{ padding: '12px', backgroundColor: '#f3f4f6', borderRadius: '6px' }}>
              <strong>Assinatura Premium:</strong> Carlos Santos - há 1 hora
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}