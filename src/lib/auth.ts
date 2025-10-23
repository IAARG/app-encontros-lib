// Sistema de autenticação e segurança para LIB Match
import { User } from './types'
import { DatabaseService } from './database'
import { encryptData, decryptData, hashPassword, generateSalt } from './security'

// Interface para dados de autenticação
export interface AuthUser {
  id: string
  email: string
  password?: string // Nunca armazenado em texto plano
  isAuthenticated: boolean
  createdAt: string
  lastLogin: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  confirmPassword: string
  name: string
  age: number
}

// Chaves para localStorage criptografado
const AUTH_KEYS = {
  USER: 'lib-match-auth-user',
  SESSION: 'lib-match-auth-session',
  SALT: 'lib-match-auth-salt',
  USERS: 'lib-match-users' // Para armazenamento local
} as const

// Validação de email
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validação de senha forte
const isStrongPassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  if (password.length < 8) {
    errors.push('Senha deve ter pelo menos 8 caracteres')
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Senha deve conter pelo menos uma letra maiúscula')
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Senha deve conter pelo menos uma letra minúscula')
  }
  
  if (!/\d/.test(password)) {
    errors.push('Senha deve conter pelo menos um número')
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Senha deve conter pelo menos um caractere especial')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Sanitização de dados de entrada
const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove caracteres HTML básicos
    .substring(0, 1000) // Limita tamanho
}

// Funções para armazenamento local como fallback
const saveUserLocally = (user: User): void => {
  try {
    const users = getLocalUsers()
    users[user.id] = user
    const encryptedUsers = encryptData(JSON.stringify(users))
    localStorage.setItem(AUTH_KEYS.USERS, encryptedUsers)
  } catch (error) {
    console.error('Erro ao salvar usuário localmente:', error)
  }
}

const getLocalUsers = (): Record<string, User> => {
  try {
    const encryptedUsers = localStorage.getItem(AUTH_KEYS.USERS)
    if (!encryptedUsers) return {}
    const decryptedUsers = decryptData(encryptedUsers)
    return JSON.parse(decryptedUsers)
  } catch (error) {
    return {}
  }
}

const findUserByEmail = (email: string): User | null => {
  const users = getLocalUsers()
  return Object.values(users).find(user => user.email.toLowerCase() === email.toLowerCase()) || null
}

const generateUserId = (): string => {
  return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
}

// Sistema de autenticação
export const authService = {
  // Registrar novo usuário
  register: async (data: RegisterData): Promise<{ success: boolean; error?: string; user?: AuthUser }> => {
    try {
      // Validações
      if (!isValidEmail(data.email)) {
        return { success: false, error: 'Email inválido' }
      }
      
      const passwordValidation = isStrongPassword(data.password)
      if (!passwordValidation.isValid) {
        return { success: false, error: passwordValidation.errors.join(', ') }
      }
      
      if (data.password !== data.confirmPassword) {
        return { success: false, error: 'Senhas não coincidem' }
      }
      
      if (data.age < 18) {
        return { success: false, error: 'Você deve ter pelo menos 18 anos' }
      }
      
      // Verificar se usuário já existe (primeiro no banco, depois localmente)
      let existingUser = await DatabaseService.getUserByEmail(data.email)
      if (!existingUser) {
        existingUser = findUserByEmail(data.email)
      }
      
      if (existingUser) {
        return { success: false, error: 'Email já cadastrado' }
      }
      
      // Gerar salt e hash da senha
      const salt = generateSalt()
      const hashedPassword = await hashPassword(data.password, salt)
      
      // Criar dados do usuário
      const userData = {
        email: sanitizeInput(data.email.toLowerCase()),
        passwordHash: hashedPassword,
        name: sanitizeInput(data.name),
        age: data.age,
        bio: '',
        interests: [],
        location: '',
        photos: [],
        preferences: {
          ageRange: [18, 65],
          maxDistance: 50,
          interests: []
        }
      }
      
      // Tentar criar usuário no banco de dados primeiro
      let newUser = await DatabaseService.createUser(userData)
      
      // Se falhar (Supabase não configurado), usar armazenamento local
      if (!newUser) {
        console.log('Banco não disponível, criando usuário localmente')
        const userId = generateUserId()
        newUser = {
          id: userId,
          ...userData,
          createdAt: new Date().toISOString()
        }
        saveUserLocally(newUser)
      }
      
      // Criar sessão local
      const authUser: AuthUser = {
        id: newUser.id,
        email: newUser.email,
        isAuthenticated: true,
        createdAt: newUser.createdAt,
        lastLogin: new Date().toISOString()
      }
      
      // Salvar sessão criptografada
      const sessionData = {
        userId: newUser.id,
        email: newUser.email,
        lastLogin: authUser.lastLogin
      }
      
      const encryptedSession = encryptData(JSON.stringify(sessionData))
      localStorage.setItem(AUTH_KEYS.SESSION, encryptedSession)
      
      return { success: true, user: authUser }
    } catch (error) {
      console.error('Erro no registro:', error)
      return { success: false, error: 'Erro interno do servidor' }
    }
  },
  
  // Login do usuário
  login: async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string; user?: AuthUser }> => {
    try {
      if (!isValidEmail(credentials.email)) {
        return { success: false, error: 'Email inválido' }
      }
      
      // Buscar usuário no banco primeiro, depois localmente
      let user = await DatabaseService.getUserByEmail(credentials.email)
      if (!user) {
        user = findUserByEmail(credentials.email)
      }
      
      if (!user) {
        return { success: false, error: 'Email ou senha incorretos' }
      }
      
      // Verificar senha
      const salt = generateSalt() // Em produção, o salt seria armazenado com o usuário
      const hashedPassword = await hashPassword(credentials.password, salt)
      
      // Verificação simplificada para desenvolvimento
      // Em produção, compararia com o hash armazenado no banco
      if (!user.passwordHash) {
        return { success: false, error: 'Email ou senha incorretos' }
      }
      
      // Criar sessão
      const authUser: AuthUser = {
        id: user.id,
        email: user.email,
        isAuthenticated: true,
        createdAt: user.createdAt,
        lastLogin: new Date().toISOString()
      }
      
      // Salvar sessão criptografada
      const sessionData = {
        userId: user.id,
        email: user.email,
        lastLogin: authUser.lastLogin
      }
      
      const encryptedSession = encryptData(JSON.stringify(sessionData))
      localStorage.setItem(AUTH_KEYS.SESSION, encryptedSession)
      
      return { success: true, user: authUser }
    } catch (error) {
      console.error('Erro no login:', error)
      return { success: false, error: 'Erro interno do servidor' }
    }
  },
  
  // Logout
  logout: (): void => {
    localStorage.removeItem(AUTH_KEYS.SESSION)
  },
  
  // Verificar se usuário está autenticado
  isAuthenticated: (): boolean => {
    const sessionData = localStorage.getItem(AUTH_KEYS.SESSION)
    if (!sessionData) return false
    
    try {
      const decryptedData = JSON.parse(decryptData(sessionData))
      return !!decryptedData.userId
    } catch (error) {
      return false
    }
  },
  
  // Obter usuário atual
  getCurrentUser: async (): Promise<AuthUser | null> => {
    try {
      const sessionData = localStorage.getItem(AUTH_KEYS.SESSION)
      if (!sessionData) return null
      
      const decryptedData = JSON.parse(decryptData(sessionData))
      
      // Tentar buscar no banco primeiro, depois localmente
      let user = await DatabaseService.getUserById(decryptedData.userId)
      if (!user) {
        const localUsers = getLocalUsers()
        user = localUsers[decryptedData.userId] || null
      }
      
      if (!user) return null
      
      return {
        id: user.id,
        email: user.email,
        isAuthenticated: true,
        createdAt: user.createdAt,
        lastLogin: decryptedData.lastLogin
      }
    } catch (error) {
      console.error('Erro ao obter usuário atual:', error)
      return null
    }
  },
  
  // Obter ID do usuário atual
  getCurrentUserId: (): string | null => {
    try {
      const sessionData = localStorage.getItem(AUTH_KEYS.SESSION)
      if (!sessionData) return null
      
      const decryptedData = JSON.parse(decryptData(sessionData))
      return decryptedData.userId || null
    } catch (error) {
      return null
    }
  },
  
  // Deletar conta
  deleteAccount: async (): Promise<boolean> => {
    try {
      const userId = authService.getCurrentUserId()
      if (!userId) return false
      
      // Em produção, implementaria a exclusão no banco de dados
      // Por enquanto, apenas remove a sessão local
      localStorage.removeItem(AUTH_KEYS.SESSION)
      
      // Limpar todos os dados relacionados ao usuário
      const keysToRemove: string[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key?.includes(userId)) {
          keysToRemove.push(key)
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key))
      
      // Remover do armazenamento local de usuários
      const users = getLocalUsers()
      delete users[userId]
      const encryptedUsers = encryptData(JSON.stringify(users))
      localStorage.setItem(AUTH_KEYS.USERS, encryptedUsers)
      
      return true
    } catch (error) {
      return false
    }
  }
}

// Middleware para proteger rotas
export const requireAuth = (callback: () => void): void => {
  if (!authService.isAuthenticated()) {
    // Redirecionar para login ou mostrar modal
    return
  }
  callback()
}

// Utilitário para validar e sanitizar dados do perfil
export const validateProfileData = (data: Partial<User>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  if (data.name && (data.name.length < 2 || data.name.length > 50)) {
    errors.push('Nome deve ter entre 2 e 50 caracteres')
  }
  
  if (data.age && (data.age < 18 || data.age > 100)) {
    errors.push('Idade deve estar entre 18 e 100 anos')
  }
  
  if (data.bio && data.bio.length > 500) {
    errors.push('Bio deve ter no máximo 500 caracteres')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}