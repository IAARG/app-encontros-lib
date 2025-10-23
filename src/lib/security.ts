// Sistema de segurança e criptografia para LIB Match

// Chave de criptografia (em produção, seria uma variável de ambiente)
const ENCRYPTION_KEY = 'lib-match-secure-key-2024'

// Função para gerar salt aleatório
export const generateSalt = (length: number = 32): string => {
  if (typeof window !== 'undefined') {
    // Cliente: usar crypto.getRandomValues
    const array = new Uint8Array(length)
    crypto.getRandomValues(array)
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
  } else {
    // Servidor: usar Math.random como fallback
    const chars = '0123456789abcdef'
    let result = ''
    for (let i = 0; i < length * 2; i++) {
      result += chars[Math.floor(Math.random() * chars.length)]
    }
    return result
  }
}

// Função para hash de senha com salt
export const hashPassword = async (password: string, salt: string): Promise<string> => {
  if (typeof window !== 'undefined') {
    // Cliente: usar Web Crypto API
    const encoder = new TextEncoder()
    const data = encoder.encode(password + salt)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  } else {
    // Servidor: usar implementação simples
    let hash = 0
    const str = password + salt
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16)
  }
}

// Função simples de criptografia para dados locais
export const encryptData = (data: string): string => {
  try {
    // Implementação simples usando Base64 + XOR
    // Em produção, usaria AES-256-GCM
    const key = ENCRYPTION_KEY
    let encrypted = ''
    
    for (let i = 0; i < data.length; i++) {
      const keyChar = key.charCodeAt(i % key.length)
      const dataChar = data.charCodeAt(i)
      encrypted += String.fromCharCode(dataChar ^ keyChar)
    }
    
    return btoa(encrypted)
  } catch (error) {
    console.error('Erro na criptografia:', error)
    return btoa(data) // Fallback para Base64 simples
  }
}

// Função para descriptografar dados
export const decryptData = (encryptedData: string): string => {
  try {
    const encrypted = atob(encryptedData)
    const key = ENCRYPTION_KEY
    let decrypted = ''
    
    for (let i = 0; i < encrypted.length; i++) {
      const keyChar = key.charCodeAt(i % key.length)
      const encryptedChar = encrypted.charCodeAt(i)
      decrypted += String.fromCharCode(encryptedChar ^ keyChar)
    }
    
    return decrypted
  } catch (error) {
    console.error('Erro na descriptografia:', error)
    return atob(encryptedData) // Fallback para Base64 simples
  }
}

// Função para validar integridade dos dados
export const validateDataIntegrity = (data: string, hash: string): boolean => {
  try {
    // Implementação simples de hash
    let calculatedHash = 0
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i)
      calculatedHash = ((calculatedHash << 5) - calculatedHash) + char
      calculatedHash = calculatedHash & calculatedHash
    }
    return Math.abs(calculatedHash).toString(16) === hash
  } catch (error) {
    return false
  }
}

// Função para sanitizar dados de entrada
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove caracteres HTML básicos
    .replace(/javascript:/gi, '') // Remove javascript: URLs
    .replace(/on\w+=/gi, '') // Remove event handlers
    .substring(0, 1000) // Limita tamanho
}

// Função para gerar token de sessão
export const generateSessionToken = (): string => {
  const timestamp = Date.now().toString()
  const random = generateSalt(16)
  return btoa(timestamp + ':' + random)
}

// Função para validar token de sessão
export const validateSessionToken = (token: string, maxAge: number = 24 * 60 * 60 * 1000): boolean => {
  try {
    const decoded = atob(token)
    const [timestamp] = decoded.split(':')
    const tokenAge = Date.now() - parseInt(timestamp)
    return tokenAge < maxAge
  } catch (error) {
    return false
  }
}

// Função para mascarar dados sensíveis em logs
export const maskSensitiveData = (data: string, visibleChars: number = 4): string => {
  if (data.length <= visibleChars * 2) {
    return '*'.repeat(data.length)
  }
  
  const start = data.substring(0, visibleChars)
  const end = data.substring(data.length - visibleChars)
  const middle = '*'.repeat(data.length - visibleChars * 2)
  
  return start + middle + end
}

// Configurações de segurança
export const SECURITY_CONFIG = {
  PASSWORD_MIN_LENGTH: 8,
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 horas
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutos
  SALT_LENGTH: 32,
  TOKEN_LENGTH: 64
} as const

// Função para verificar força da senha
export const checkPasswordStrength = (password: string): {
  score: number
  feedback: string[]
  isStrong: boolean
} => {
  const feedback: string[] = []
  let score = 0

  // Comprimento
  if (password.length >= 8) score += 1
  else feedback.push('Use pelo menos 8 caracteres')

  if (password.length >= 12) score += 1

  // Caracteres
  if (/[a-z]/.test(password)) score += 1
  else feedback.push('Adicione letras minúsculas')

  if (/[A-Z]/.test(password)) score += 1
  else feedback.push('Adicione letras maiúsculas')

  if (/\d/.test(password)) score += 1
  else feedback.push('Adicione números')

  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1
  else feedback.push('Adicione caracteres especiais')

  // Padrões comuns
  if (!/(.)\1{2,}/.test(password)) score += 1
  else feedback.push('Evite repetir caracteres')

  return {
    score,
    feedback,
    isStrong: score >= 5
  }
}