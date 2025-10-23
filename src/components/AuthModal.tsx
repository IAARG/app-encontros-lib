"use client"

import { useState } from 'react'
import { Eye, EyeOff, Mail, Lock, User, Calendar } from 'lucide-react'
import { authService, LoginCredentials, RegisterData } from '../lib/auth'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [loginData, setLoginData] = useState<LoginCredentials>({
    email: '',
    password: ''
  })
  
  const [registerData, setRegisterData] = useState<RegisterData>({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    age: 18
  })

  if (!isOpen) return null

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const result = await authService.login(loginData)
    
    if (result.success) {
      onSuccess()
      onClose()
    } else {
      setError(result.error || 'Erro no login')
    }
    
    setLoading(false)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const result = await authService.register(registerData)
    
    if (result.success) {
      onSuccess()
      onClose()
    } else {
      setError(result.error || 'Erro no cadastro')
    }
    
    setLoading(false)
  }

  const resetForm = () => {
    setLoginData({ email: '', password: '' })
    setRegisterData({ email: '', password: '', confirmPassword: '', name: '', age: 18 })
    setError('')
    setShowPassword(false)
    setShowConfirmPassword(false)
  }

  const switchMode = () => {
    setIsLogin(!isLogin)
    resetForm()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-6 text-white text-center">
          <h2 className="text-2xl font-bold">
            {isLogin ? 'Entrar no LIB Match' : 'Criar Conta'}
          </h2>
          <p className="text-pink-100 mt-2">
            {isLogin ? 'Bem-vindo de volta!' : 'Junte-se à nossa comunidade'}
          </p>
        </div>

        {/* Form */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-xl text-sm">
              {error}
            </div>
          )}

          <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome completo
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={registerData.name}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
                      placeholder="Seu nome completo"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Idade
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      required
                      min="18"
                      max="100"
                      value={registerData.age}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, age: parseInt(e.target.value) }))}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
                      placeholder="Sua idade"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={isLogin ? loginData.email : registerData.email}
                  onChange={(e) => {
                    if (isLogin) {
                      setLoginData(prev => ({ ...prev, email: e.target.value }))
                    } else {
                      setRegisterData(prev => ({ ...prev, email: e.target.value }))
                    }
                  }}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={isLogin ? loginData.password : registerData.password}
                  onChange={(e) => {
                    if (isLogin) {
                      setLoginData(prev => ({ ...prev, password: e.target.value }))
                    } else {
                      setRegisterData(prev => ({ ...prev, password: e.target.value }))
                    }
                  }}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
                  placeholder="Sua senha"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {!isLogin && (
                <p className="text-xs text-gray-500 mt-1">
                  Mínimo 8 caracteres, com maiúscula, minúscula, número e símbolo
                </p>
              )}
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
                    placeholder="Confirme sua senha"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
            >
              {loading ? 'Processando...' : (isLogin ? 'Entrar' : 'Criar Conta')}
            </button>
          </form>

          {/* Switch Mode */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
            </p>
            <button
              onClick={switchMode}
              className="text-pink-600 font-semibold hover:text-pink-700 mt-1"
            >
              {isLogin ? 'Criar conta' : 'Fazer login'}
            </button>
          </div>

          {/* Privacy Notice */}
          {!isLogin && (
            <div className="mt-4 p-3 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-600 text-center">
                Ao criar uma conta, você concorda com nossos termos de uso e política de privacidade. 
                Seus dados são criptografados e protegidos.
              </p>
            </div>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
        >
          ×
        </button>
      </div>
    </div>
  )
}