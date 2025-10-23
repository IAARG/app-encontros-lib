// Sistema de armazenamento local criptografado para LIB Match
import { encryptData, decryptData } from './security'

// Chaves para localStorage
const STORAGE_KEYS = {
  USER_PROFILE: 'lib-match-user-profile',
  MATCHES: 'lib-match-matches',
  MESSAGES: 'lib-match-messages',
  SETTINGS: 'lib-match-settings',
  EVENTS: 'lib-match-events'
} as const

// Interface para dados do usuário
interface UserProfile {
  id: string
  name: string
  age: number
  bio: string
  photos: string[]
  interests: string[]
  relationshipType: string[]
  location: string
  isOnline: boolean
  lastSeen?: string
}

// Interface para matches
interface Match {
  id: string
  user: UserProfile
  matchedAt: string
  lastMessage?: string
  unreadCount: number
}

// Interface para mensagens
interface Message {
  id: string
  senderId: string
  content: string
  timestamp: string
}

// Classe base para armazenamento
class SecureStorage<T> {
  private key: string

  constructor(key: string) {
    this.key = key
  }

  // Salvar dados criptografados
  save(data: T): void {
    try {
      const jsonData = JSON.stringify(data)
      const encryptedData = encryptData(jsonData)
      localStorage.setItem(this.key, encryptedData)
    } catch (error) {
      console.error(`Erro ao salvar ${this.key}:`, error)
    }
  }

  // Carregar dados descriptografados
  load(): T | null {
    try {
      const encryptedData = localStorage.getItem(this.key)
      if (!encryptedData) return null
      
      const jsonData = decryptData(encryptedData)
      return JSON.parse(jsonData)
    } catch (error) {
      console.error(`Erro ao carregar ${this.key}:`, error)
      return null
    }
  }

  // Remover dados
  remove(): void {
    try {
      localStorage.removeItem(this.key)
    } catch (error) {
      console.error(`Erro ao remover ${this.key}:`, error)
    }
  }

  // Verificar se existem dados
  exists(): boolean {
    return localStorage.getItem(this.key) !== null
  }
}

// Classe especializada para mensagens (por match)
class MessageStorage {
  private getKey(matchId: string): string {
    return `${STORAGE_KEYS.MESSAGES}-${matchId}`
  }

  // Salvar mensagens de um match específico
  save(matchId: string, messages: Message[]): void {
    try {
      const key = this.getKey(matchId)
      const jsonData = JSON.stringify(messages)
      const encryptedData = encryptData(jsonData)
      localStorage.setItem(key, encryptedData)
    } catch (error) {
      console.error(`Erro ao salvar mensagens do match ${matchId}:`, error)
    }
  }

  // Carregar mensagens de um match específico
  load(matchId: string): Message[] {
    try {
      const key = this.getKey(matchId)
      const encryptedData = localStorage.getItem(key)
      if (!encryptedData) return []
      
      const jsonData = decryptData(encryptedData)
      return JSON.parse(jsonData)
    } catch (error) {
      console.error(`Erro ao carregar mensagens do match ${matchId}:`, error)
      return []
    }
  }

  // Adicionar nova mensagem
  addMessage(matchId: string, message: Message): void {
    const messages = this.load(matchId)
    messages.push(message)
    this.save(matchId, messages)
  }

  // Remover mensagens de um match
  remove(matchId: string): void {
    try {
      const key = this.getKey(matchId)
      localStorage.removeItem(key)
    } catch (error) {
      console.error(`Erro ao remover mensagens do match ${matchId}:`, error)
    }
  }

  // Limpar todas as mensagens
  clearAll(): void {
    try {
      const keysToRemove: string[] = []
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key?.startsWith(STORAGE_KEYS.MESSAGES)) {
          keysToRemove.push(key)
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key))
    } catch (error) {
      console.error('Erro ao limpar todas as mensagens:', error)
    }
  }
}

// Instâncias dos storages
export const userStorage = new SecureStorage<UserProfile>(STORAGE_KEYS.USER_PROFILE)
export const matchStorage = new SecureStorage<Match[]>(STORAGE_KEYS.MATCHES)
export const messageStorage = new MessageStorage()
export const settingsStorage = new SecureStorage<any>(STORAGE_KEYS.SETTINGS)
export const eventsStorage = new SecureStorage<any[]>(STORAGE_KEYS.EVENTS)

// Utilitários para gerenciamento de dados
export const storageUtils = {
  // Limpar todos os dados do usuário
  clearAllUserData(): void {
    userStorage.remove()
    matchStorage.remove()
    messageStorage.clearAll()
    settingsStorage.remove()
    eventsStorage.remove()
  },

  // Verificar se há dados salvos
  hasUserData(): boolean {
    return userStorage.exists() || matchStorage.exists()
  },

  // Exportar dados do usuário (para backup)
  exportUserData(): {
    profile: UserProfile | null
    matches: Match[] | null
    settings: any | null
    timestamp: string
  } {
    return {
      profile: userStorage.load(),
      matches: matchStorage.load(),
      settings: settingsStorage.load(),
      timestamp: new Date().toISOString()
    }
  },

  // Importar dados do usuário (de backup)
  importUserData(data: {
    profile?: UserProfile
    matches?: Match[]
    settings?: any
  }): void {
    if (data.profile) {
      userStorage.save(data.profile)
    }
    if (data.matches) {
      matchStorage.save(data.matches)
    }
    if (data.settings) {
      settingsStorage.save(data.settings)
    }
  },

  // Obter estatísticas de uso do storage
  getStorageStats(): {
    totalKeys: number
    totalSize: number
    userDataSize: number
    messagesCount: number
  } {
    let totalKeys = 0
    let totalSize = 0
    let userDataSize = 0
    let messagesCount = 0

    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key) {
          totalKeys++
          const value = localStorage.getItem(key) || ''
          totalSize += value.length

          if (key.startsWith('lib-match-')) {
            userDataSize += value.length
            
            if (key.startsWith(STORAGE_KEYS.MESSAGES)) {
              messagesCount++
            }
          }
        }
      }
    } catch (error) {
      console.error('Erro ao calcular estatísticas:', error)
    }

    return {
      totalKeys,
      totalSize,
      userDataSize,
      messagesCount
    }
  },

  // Verificar integridade dos dados
  validateDataIntegrity(): {
    isValid: boolean
    errors: string[]
  } {
    const errors: string[] = []
    let isValid = true

    try {
      // Verificar perfil do usuário
      const profile = userStorage.load()
      if (profile) {
        if (!profile.id || !profile.name || !profile.age) {
          errors.push('Dados do perfil incompletos')
          isValid = false
        }
      }

      // Verificar matches
      const matches = matchStorage.load()
      if (matches) {
        matches.forEach((match, index) => {
          if (!match.id || !match.user || !match.matchedAt) {
            errors.push(`Match ${index + 1} com dados inválidos`)
            isValid = false
          }
        })
      }

      // Verificar se há dados órfãos de mensagens
      let messageKeys = 0
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key?.startsWith(STORAGE_KEYS.MESSAGES)) {
          messageKeys++
        }
      }

      const matchCount = matches?.length || 0
      if (messageKeys > matchCount * 2) { // Tolerância para chaves antigas
        errors.push('Possíveis dados órfãos de mensagens detectados')
      }

    } catch (error) {
      errors.push('Erro ao validar integridade dos dados')
      isValid = false
    }

    return { isValid, errors }
  },

  // Limpar dados órfãos
  cleanupOrphanedData(): number {
    let cleanedCount = 0

    try {
      const matches = matchStorage.load() || []
      const validMatchIds = new Set(matches.map(m => m.id))
      const keysToRemove: string[] = []

      // Encontrar chaves de mensagens órfãs
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key?.startsWith(STORAGE_KEYS.MESSAGES + '-')) {
          const matchId = key.replace(STORAGE_KEYS.MESSAGES + '-', '')
          if (!validMatchIds.has(matchId)) {
            keysToRemove.push(key)
          }
        }
      }

      // Remover chaves órfãs
      keysToRemove.forEach(key => {
        localStorage.removeItem(key)
        cleanedCount++
      })

    } catch (error) {
      console.error('Erro ao limpar dados órfãos:', error)
    }

    return cleanedCount
  }
}

// Hook para React (se necessário)
export const useSecureStorage = <T>(key: string, defaultValue: T) => {
  const storage = new SecureStorage<T>(key)
  
  const getValue = (): T => {
    const stored = storage.load()
    return stored !== null ? stored : defaultValue
  }
  
  const setValue = (value: T): void => {
    storage.save(value)
  }
  
  const removeValue = (): void => {
    storage.remove()
  }
  
  return {
    value: getValue(),
    setValue,
    removeValue,
    exists: storage.exists()
  }
}

// Configurações padrão
export const DEFAULT_SETTINGS = {
  theme: 'light',
  notifications: {
    newMatches: true,
    newMessages: true,
    events: true,
    marketing: false
  },
  privacy: {
    showOnlineStatus: true,
    showLastSeen: true,
    allowProfileViews: true
  },
  preferences: {
    ageRange: [18, 65],
    maxDistance: 50,
    interests: []
  }
}

// Inicializar configurações padrão se não existirem
export const initializeDefaultSettings = (): void => {
  if (!settingsStorage.exists()) {
    settingsStorage.save(DEFAULT_SETTINGS)
  }
}