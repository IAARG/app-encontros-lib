import { supabase, isSupabaseConfigured } from './supabase'
import { User, Match, Message, Event } from './types'
import { encryptData, decryptData } from './security'

// Classe para gerenciar operações do banco de dados
export class DatabaseService {
  // Verificar se Supabase está disponível
  private static isOnline(): boolean {
    return isSupabaseConfigured() && supabase !== null
  }

  // Usuários
  static async createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User | null> {
    if (!this.isOnline()) {
      console.log('Supabase não configurado, usando armazenamento local')
      return null
    }

    try {
      // Criptografar dados sensíveis
      const encryptedData = {
        ...userData,
        email: encryptData(userData.email),
        passwordHash: userData.passwordHash, // Já vem hasheado
        name: encryptData(userData.name),
        bio: encryptData(userData.bio || ''),
        location: encryptData(userData.location || '')
      }

      const { data, error } = await supabase!
        .from('users')
        .insert({
          email: encryptedData.email,
          password_hash: encryptedData.passwordHash,
          name: encryptedData.name,
          age: userData.age,
          bio: encryptedData.bio,
          interests: userData.interests || [],
          location: encryptedData.location,
          photos: userData.photos || [],
          preferences: userData.preferences || {
            ageRange: [18, 65],
            maxDistance: 50,
            interests: []
          }
        })
        .select()
        .single()

      if (error) {
        console.error('Erro ao criar usuário:', error)
        return null
      }

      return this.decryptUser(data)
    } catch (error) {
      console.error('Erro ao criar usuário:', error)
      return null
    }
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    if (!this.isOnline()) {
      return null
    }

    try {
      const encryptedEmail = encryptData(email)
      
      const { data, error } = await supabase!
        .from('users')
        .select('*')
        .eq('email', encryptedEmail)
        .single()

      if (error || !data) {
        return null
      }

      return this.decryptUser(data)
    } catch (error) {
      console.error('Erro ao buscar usuário:', error)
      return null
    }
  }

  static async getUserById(id: string): Promise<User | null> {
    if (!this.isOnline()) {
      return null
    }

    try {
      const { data, error } = await supabase!
        .from('users')
        .select('*')
        .eq('id', id)
        .single()

      if (error || !data) {
        return null
      }

      return this.decryptUser(data)
    } catch (error) {
      console.error('Erro ao buscar usuário:', error)
      return null
    }
  }

  static async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    if (!this.isOnline()) {
      return null
    }

    try {
      const encryptedUpdates: any = { ...updates }
      
      // Criptografar campos sensíveis se estiverem sendo atualizados
      if (updates.email) encryptedUpdates.email = encryptData(updates.email)
      if (updates.name) encryptedUpdates.name = encryptData(updates.name)
      if (updates.bio) encryptedUpdates.bio = encryptData(updates.bio)
      if (updates.location) encryptedUpdates.location = encryptData(updates.location)

      const { data, error } = await supabase!
        .from('users')
        .update(encryptedUpdates)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Erro ao atualizar usuário:', error)
        return null
      }

      return this.decryptUser(data)
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error)
      return null
    }
  }

  static async getAllUsers(): Promise<User[]> {
    if (!this.isOnline()) {
      return []
    }

    try {
      const { data, error } = await supabase!
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao buscar usuários:', error)
        return []
      }

      return data.map(user => this.decryptUser(user))
    } catch (error) {
      console.error('Erro ao buscar usuários:', error)
      return []
    }
  }

  // Matches
  static async createMatch(user1Id: string, user2Id: string): Promise<Match | null> {
    if (!this.isOnline()) {
      return null
    }

    try {
      const { data, error } = await supabase!
        .from('matches')
        .insert({
          user1_id: user1Id,
          user2_id: user2Id,
          status: 'pending'
        })
        .select()
        .single()

      if (error) {
        console.error('Erro ao criar match:', error)
        return null
      }

      return {
        id: data.id,
        user1Id: data.user1_id,
        user2Id: data.user2_id,
        status: data.status,
        createdAt: data.created_at
      }
    } catch (error) {
      console.error('Erro ao criar match:', error)
      return null
    }
  }

  static async updateMatchStatus(matchId: string, status: 'matched' | 'rejected'): Promise<Match | null> {
    if (!this.isOnline()) {
      return null
    }

    try {
      const { data, error } = await supabase!
        .from('matches')
        .update({ status })
        .eq('id', matchId)
        .select()
        .single()

      if (error) {
        console.error('Erro ao atualizar match:', error)
        return null
      }

      return {
        id: data.id,
        user1Id: data.user1_id,
        user2Id: data.user2_id,
        status: data.status,
        createdAt: data.created_at
      }
    } catch (error) {
      console.error('Erro ao atualizar match:', error)
      return null
    }
  }

  static async getUserMatches(userId: string): Promise<Match[]> {
    if (!this.isOnline()) {
      return []
    }

    try {
      const { data, error } = await supabase!
        .from('matches')
        .select('*')
        .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
        .eq('status', 'matched')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao buscar matches:', error)
        return []
      }

      return data.map(match => ({
        id: match.id,
        user1Id: match.user1_id,
        user2Id: match.user2_id,
        status: match.status,
        createdAt: match.created_at
      }))
    } catch (error) {
      console.error('Erro ao buscar matches:', error)
      return []
    }
  }

  // Mensagens
  static async createMessage(matchId: string, senderId: string, content: string): Promise<Message | null> {
    if (!this.isOnline()) {
      return null
    }

    try {
      const encryptedContent = encryptData(content)
      
      const { data, error } = await supabase!
        .from('messages')
        .insert({
          match_id: matchId,
          sender_id: senderId,
          content: encryptedContent
        })
        .select()
        .single()

      if (error) {
        console.error('Erro ao criar mensagem:', error)
        return null
      }

      return {
        id: data.id,
        matchId: data.match_id,
        senderId: data.sender_id,
        content: decryptData(data.content),
        timestamp: data.created_at
      }
    } catch (error) {
      console.error('Erro ao criar mensagem:', error)
      return null
    }
  }

  static async getMatchMessages(matchId: string): Promise<Message[]> {
    if (!this.isOnline()) {
      return []
    }

    try {
      const { data, error } = await supabase!
        .from('messages')
        .select('*')
        .eq('match_id', matchId)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Erro ao buscar mensagens:', error)
        return []
      }

      return data.map(message => ({
        id: message.id,
        matchId: message.match_id,
        senderId: message.sender_id,
        content: decryptData(message.content),
        timestamp: message.created_at
      }))
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error)
      return []
    }
  }

  // Eventos
  static async createEvent(eventData: Omit<Event, 'id' | 'createdAt' | 'currentParticipants'>): Promise<Event | null> {
    if (!this.isOnline()) {
      return null
    }

    try {
      const encryptedData = {
        title: encryptData(eventData.title),
        description: encryptData(eventData.description),
        location: encryptData(eventData.location)
      }

      const { data, error } = await supabase!
        .from('events')
        .insert({
          title: encryptedData.title,
          description: encryptedData.description,
          date: eventData.date,
          location: encryptedData.location,
          max_participants: eventData.maxParticipants,
          created_by: eventData.createdBy
        })
        .select()
        .single()

      if (error) {
        console.error('Erro ao criar evento:', error)
        return null
      }

      return {
        id: data.id,
        title: decryptData(data.title),
        description: decryptData(data.description),
        date: data.date,
        location: decryptData(data.location),
        maxParticipants: data.max_participants,
        currentParticipants: data.current_participants,
        createdBy: data.created_by,
        createdAt: data.created_at
      }
    } catch (error) {
      console.error('Erro ao criar evento:', error)
      return null
    }
  }

  static async getAllEvents(): Promise<Event[]> {
    if (!this.isOnline()) {
      return []
    }

    try {
      const { data, error } = await supabase!
        .from('events')
        .select('*')
        .order('date', { ascending: true })

      if (error) {
        console.error('Erro ao buscar eventos:', error)
        return []
      }

      return data.map(event => ({
        id: event.id,
        title: decryptData(event.title),
        description: decryptData(event.description),
        date: event.date,
        location: decryptData(event.location),
        maxParticipants: event.max_participants,
        currentParticipants: event.current_participants,
        createdBy: event.created_by,
        createdAt: event.created_at
      }))
    } catch (error) {
      console.error('Erro ao buscar eventos:', error)
      return []
    }
  }

  static async joinEvent(eventId: string, userId: string): Promise<boolean> {
    if (!this.isOnline()) {
      return false
    }

    try {
      const { error } = await supabase!
        .from('event_participants')
        .insert({
          event_id: eventId,
          user_id: userId
        })

      if (error) {
        console.error('Erro ao participar do evento:', error)
        return false
      }

      // Atualizar contador de participantes
      await supabase!.rpc('increment_event_participants', { event_id: eventId })

      return true
    } catch (error) {
      console.error('Erro ao participar do evento:', error)
      return false
    }
  }

  // Função auxiliar para descriptografar dados do usuário
  private static decryptUser(encryptedUser: any): User {
    return {
      id: encryptedUser.id,
      email: decryptData(encryptedUser.email),
      passwordHash: encryptedUser.password_hash,
      name: decryptData(encryptedUser.name),
      age: encryptedUser.age,
      bio: decryptData(encryptedUser.bio || ''),
      interests: encryptedUser.interests || [],
      location: decryptData(encryptedUser.location || ''),
      photos: encryptedUser.photos || [],
      preferences: encryptedUser.preferences || {
        ageRange: [18, 65],
        maxDistance: 50,
        interests: []
      },
      createdAt: encryptedUser.created_at
    }
  }
}