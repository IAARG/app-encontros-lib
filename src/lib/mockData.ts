import { User, Event } from './types'

// Dados mock de usuários para demonstração
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Ana',
    age: 28,
    bio: 'Explorando conexões autênticas e relacionamentos não convencionais. Amo arte, música e conversas profundas sobre a vida.',
    photos: ['https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=600&fit=crop'],
    interests: ['Arte', 'Música', 'Filosofia', 'Yoga'],
    relationshipType: ['Relacionamento Aberto', 'Poliamoroso'],
    location: 'São Paulo, SP',
    isOnline: true
  },
  {
    id: '2',
    name: 'Carlos',
    age: 35,
    bio: 'Casal liberal em busca de novas experiências e amizades. Adoramos viajar e conhecer pessoas interessantes.',
    photos: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop'],
    interests: ['Viagem', 'Culinária', 'Dança', 'Fotografia'],
    relationshipType: ['Swing', 'Relacionamento Aberto'],
    location: 'Rio de Janeiro, RJ',
    isOnline: false,
    lastSeen: '2h atrás'
  },
  {
    id: '3',
    name: 'Marina',
    age: 31,
    bio: 'Livre, autêntica e em busca de conexões genuínas. Acredito no amor em todas as suas formas e possibilidades.',
    photos: ['https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop'],
    interests: ['Literatura', 'Teatro', 'Meditação', 'Natureza'],
    relationshipType: ['Poliamoroso', 'Relacionamento Aberto'],
    location: 'Belo Horizonte, MG',
    isOnline: true
  },
  {
    id: '4',
    name: 'Rafael',
    age: 29,
    bio: 'Músico e artista visual. Procuro pessoas que compartilhem da mesma visão livre sobre relacionamentos e vida.',
    photos: ['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop'],
    interests: ['Música', 'Arte', 'Cinema', 'Fotografia'],
    relationshipType: ['Relacionamento Aberto', 'Casual'],
    location: 'Porto Alegre, RS',
    isOnline: true
  },
  {
    id: '5',
    name: 'Juliana',
    age: 26,
    bio: 'Psicóloga especializada em relacionamentos alternativos. Amo dançar, viajar e conhecer culturas diferentes.',
    photos: ['https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=600&fit=crop'],
    interests: ['Dança', 'Viagem', 'Filosofia', 'Culinária'],
    relationshipType: ['Poliamoroso', 'Swing'],
    location: 'Florianópolis, SC',
    isOnline: false,
    lastSeen: '1h atrás'
  },
  {
    id: '6',
    name: 'Diego',
    age: 33,
    bio: 'Chef de cozinha apaixonado por gastronomia e experiências sensoriais. Busco conexões profundas e autênticas.',
    photos: ['https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop'],
    interests: ['Culinária', 'Viagem', 'Música', 'Natureza'],
    relationshipType: ['Relacionamento Aberto', 'Amizade Liberal'],
    location: 'Salvador, BA',
    isOnline: true
  }
]

// Dados mock de eventos
export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Encontro Liberal SP',
    description: 'Evento mensal para pessoas liberais se conhecerem em um ambiente descontraído e seguro. Música, drinks e muita conversa boa.',
    date: '2024-02-15',
    location: 'São Paulo, SP',
    attendees: 24,
    maxAttendees: 50,
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=300&fit=crop',
    type: 'party'
  },
  {
    id: '2',
    title: 'Workshop: Comunicação em Relacionamentos Abertos',
    description: 'Aprenda técnicas de comunicação não-violenta para relacionamentos saudáveis e harmoniosos.',
    date: '2024-02-20',
    location: 'Rio de Janeiro, RJ',
    attendees: 12,
    maxAttendees: 20,
    image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400&h=300&fit=crop',
    type: 'workshop'
  },
  {
    id: '3',
    title: 'Meetup Poliamoroso BH',
    description: 'Encontro casual para pessoas que praticam poliamor. Vamos conversar sobre experiências e desafios.',
    date: '2024-02-25',
    location: 'Belo Horizonte, MG',
    attendees: 18,
    maxAttendees: 30,
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop',
    type: 'meetup'
  },
  {
    id: '4',
    title: 'Festa Swing Floripa',
    description: 'Noite especial para casais e solteiros liberais. Ambiente exclusivo e discreto com toda segurança.',
    date: '2024-03-01',
    location: 'Florianópolis, SC',
    attendees: 32,
    maxAttendees: 60,
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=300&fit=crop',
    type: 'party'
  },
  {
    id: '5',
    title: 'Workshop: Consentimento e Limites',
    description: 'Discussão importante sobre consentimento, limites e comunicação em relacionamentos não-monogâmicos.',
    date: '2024-03-05',
    location: 'Porto Alegre, RS',
    attendees: 8,
    maxAttendees: 15,
    image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=300&fit=crop',
    type: 'workshop'
  }
]

// Usuário padrão para demonstração
export const defaultUser: User = {
  id: 'me',
  name: 'Você',
  age: 30,
  bio: 'Explorando novas conexões e relacionamentos autênticos...',
  photos: ['https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=600&fit=crop'],
  interests: ['Música', 'Arte', 'Viagem'],
  relationshipType: ['Relacionamento Aberto'],
  location: 'São Paulo, SP',
  isOnline: true
}

// Mensagens de exemplo para demonstração
export const sampleMessages = [
  "Oi! Vi que temos interesses em comum 😊",
  "Que legal seu perfil! Também amo arte e música",
  "Você vai no evento de SP esse mês?",
  "Adoraria conversar mais sobre relacionamentos abertos",
  "Que tal marcarmos um café para nos conhecermos melhor?",
  "Seu gosto musical é incrível! Qual sua banda favorita?",
  "Vi que você pratica yoga. Onde você costuma ir?",
  "Que coincidência, também sou de SP! Qual região?"
]