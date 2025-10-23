'use client'

import { useEffect, useState } from 'react'

export default function Home() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showInstallButton, setShowInstallButton] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstallButton(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null)
      setShowInstallButton(false)
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f9fafb',
      fontFamily: 'system-ui',
      padding: '20px'
    }}>
      {/* Header com botão de instalação */}
      {showInstallButton && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 1000
        }}>
          <button
            onClick={handleInstallClick}
            style={{
              backgroundColor: '#10b981',
              color: 'white',
              padding: '12px 20px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
            }}
          >
            📱 Instalar App
          </button>
        </div>
      )}

      {/* Conteúdo principal */}
      <div style={{ textAlign: 'center', maxWidth: '600px' }}>
        <div style={{
          backgroundColor: 'white',
          padding: '60px 40px',
          borderRadius: '20px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          marginBottom: '40px'
        }}>
          <h1 style={{ 
            fontSize: '64px', 
            color: '#ec4899', 
            marginBottom: '20px',
            fontWeight: 'bold'
          }}>
            LibMatch
          </h1>
          <p style={{ 
            fontSize: '24px', 
            color: '#6b7280',
            marginBottom: '30px',
            lineHeight: '1.5'
          }}>
            Plataforma de relacionamentos premium
          </p>
          <p style={{ 
            fontSize: '16px', 
            color: '#9ca3af',
            marginBottom: '40px'
          }}>
            Conecte-se com pessoas especiais através da nossa plataforma exclusiva
          </p>
          
          {/* Botões de ação */}
          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button style={{
              backgroundColor: '#ec4899',
              color: 'white',
              padding: '16px 32px',
              border: 'none',
              borderRadius: '12px',
              fontSize: '18px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(236, 72, 153, 0.3)'
            }}>
              💕 Começar Agora
            </button>
            
            <button style={{
              backgroundColor: 'transparent',
              color: '#ec4899',
              padding: '16px 32px',
              border: '2px solid #ec4899',
              borderRadius: '12px',
              fontSize: '18px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}>
              ✨ Saiba Mais
            </button>
          </div>
        </div>

        {/* Features */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px 20px',
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>🔒</div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#1f2937' }}>
              Seguro & Privado
            </h3>
            <p style={{ fontSize: '14px', color: '#6b7280' }}>
              Seus dados protegidos com criptografia de ponta
            </p>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '30px 20px',
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>🎯</div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#1f2937' }}>
              Matches Inteligentes
            </h3>
            <p style={{ fontSize: '14px', color: '#6b7280' }}>
              Algoritmo avançado para conexões perfeitas
            </p>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '30px 20px',
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>👑</div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#1f2937' }}>
              Experiência Premium
            </h3>
            <p style={{ fontSize: '14px', color: '#6b7280' }}>
              Recursos exclusivos para membros premium
            </p>
          </div>
        </div>

        {/* Status da aplicação */}
        <div style={{
          backgroundColor: '#10b981',
          color: 'white',
          padding: '16px 24px',
          borderRadius: '12px',
          fontSize: '16px',
          fontWeight: '500',
          marginBottom: '20px'
        }}>
          ✅ Aplicação pronta para publicação
        </div>

        {/* Links importantes */}
        <div style={{
          display: 'flex',
          gap: '20px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <a 
            href="/admin" 
            style={{
              color: '#6366f1',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: '500',
              padding: '8px 16px',
              border: '1px solid #6366f1',
              borderRadius: '8px',
              transition: 'all 0.3s ease'
            }}
          >
            🔧 Painel Admin
          </a>
          
          <a 
            href="/manifest.json" 
            target="_blank"
            style={{
              color: '#10b981',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: '500',
              padding: '8px 16px',
              border: '1px solid #10b981',
              borderRadius: '8px',
              transition: 'all 0.3s ease'
            }}
          >
            📱 PWA Manifest
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: '14px',
        color: '#9ca3af',
        textAlign: 'center'
      }}>
        LibMatch © 2024 - Plataforma Premium de Relacionamentos
      </footer>
    </div>
  )
}