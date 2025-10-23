// Tipos e interfaces para LIB Match

// Interface principal do usuário
export interface User {
  id: string
  email: string
  passwordHash?: string
  name: string
  age: number
  bio: string
  interests: string[]
  location: string
  photos: string[]
  preferences: UserPreferences
  createdAt: string
  updatedAt: string
  isActive: boolean
  lastSeen: string
}

// Preferências do usuário
export interface UserPreferences {
  ageRange: [number, number]
  maxDistance: number
  interests: string[]
  genderPreference?: 'male' | 'female' | 'both'
  showOnlyVerified?: boolean
}

// Interface para matches
export interface Match {
  id: string
  user1Id: string
  user2Id: string
  createdAt: string
  status: 'pending' | 'matched' | 'rejected'
  chatId?: string
}

// Interface para mensagens
export interface Message {
  id: string
  chatId: string
  senderId: string
  receiverId: string
  content: string
  timestamp: string
  isRead: boolean
  messageType: 'text' | 'image' | 'emoji'
}

// Interface para chat
export interface Chat {
  id: string
  participants: string[]
  lastMessage?: Message
  createdAt: string
  updatedAt: string
  isActive: boolean
}

// Interface para eventos
export interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  organizerId: string
  participants: string[]
  maxParticipants: number
  category: EventCategory
  imageUrl?: string
  createdAt: string
  isActive: boolean
}

// Categorias de eventos
export type EventCategory = 
  | 'social'
  | 'cultural'
  | 'sports'
  | 'food'
  | 'music'
  | 'art'
  | 'technology'
  | 'education'
  | 'outdoor'
  | 'other'

// Interface para notificações
export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  isRead: boolean
  createdAt: string
  data?: any
}

// Tipos de notificação
export type NotificationType =
  | 'new_match'
  | 'new_message'
  | 'event_invitation'
  | 'profile_view'
  | 'system'

// Interface para perfil público (dados visíveis para outros usuários)
export interface PublicProfile {
  id: string
  name: string
  age: number
  bio: string
  interests: string[]
  location: string
  photos: string[]
  lastSeen: string
  isVerified?: boolean
}

// Interface para dados de registro
export interface RegisterData {
  email: string
  password: string
  confirmPassword: string
  name: string
  age: number
  acceptTerms: boolean
}

// Interface para dados de login
export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

// Interface para atualização de perfil
export interface ProfileUpdateData {
  name?: string
  bio?: string
  interests?: string[]
  location?: string
  photos?: string[]
  preferences?: Partial<UserPreferences>
}

// Interface para filtros de busca
export interface SearchFilters {
  ageRange?: [number, number]
  maxDistance?: number
  interests?: string[]
  location?: string
  isOnline?: boolean
}

// Interface para estatísticas do usuário
export interface UserStats {
  totalMatches: number
  totalMessages: number
  profileViews: number
  eventsAttended: number
  joinDate: string
}

// Interface para configurações do app
export interface AppSettings {
  notifications: {
    newMatches: boolean
    newMessages: boolean
    events: boolean
    marketing: boolean
  }
  privacy: {
    showOnlineStatus: boolean
    showLastSeen: boolean
    allowProfileViews: boolean
  }
  theme: 'light' | 'dark' | 'auto'
  language: string
}

// Interface para dados de localização
export interface Location {
  latitude: number
  longitude: number
  city: string
  state: string
  country: string
}

// Interface para upload de fotos
export interface PhotoUpload {
  file: File
  preview: string
  isUploading: boolean
  error?: string
}

// Interface para resposta da API
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Interface para paginação
export interface PaginationParams {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// Interface para resposta paginada
export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Tipos para status de carregamento
export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

// Interface para estado de erro
export interface ErrorState {
  hasError: boolean
  message?: string
  code?: string
}

// Interface para dados de sessão
export interface SessionData {
  userId: string
  email: string
  lastLogin: string
  expiresAt: string
}

// Constantes para interesses disponíveis
export const AVAILABLE_INTERESTS = [
  'Música',
  'Cinema',
  'Livros',
  'Esportes',
  'Viagem',
  'Culinária',
  'Arte',
  'Tecnologia',
  'Natureza',
  'Fotografia',
  'Dança',
  'Yoga',
  'Academia',
  'Jogos',
  'Pets',
  'Moda',
  'Carros',
  'Política',
  'Ciência',
  'História'
] as const

// Tipo para interesses
export type Interest = typeof AVAILABLE_INTERESTS[number]

// Constantes para categorias de eventos
export const EVENT_CATEGORIES: Record<EventCategory, string> = {
  social: 'Social',
  cultural: 'Cultural',
  sports: 'Esportes',
  food: 'Gastronomia',
  music: 'Música',
  art: 'Arte',
  technology: 'Tecnologia',
  education: 'Educação',
  outdoor: 'Ao ar livre',
  other: 'Outros'
}

// Tipo para status de match
export type MatchStatus = 'pending' | 'matched' | 'rejected'

// Tipo para status de mensagem
export type MessageStatus = 'sent' | 'delivered' | 'read'

// Interface para webhook de notificação
export interface WebhookPayload {
  type: string
  userId: string
  data: any
  timestamp: string
}