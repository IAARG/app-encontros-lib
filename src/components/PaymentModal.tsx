"use client"

import { useState } from 'react'
import { X, CreditCard, Calendar, Shield, Star, Crown, Diamond, Check } from 'lucide-react'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (plan: string, period: string) => void
}

// Planos de assinatura baseados no Tinder com classificação Prata, Ouro, Diamante
const subscriptionPlans = {
  prata: {
    name: 'Prata',
    icon: Star,
    color: 'from-gray-400 to-gray-600',
    features: [
      'Likes ilimitados',
      'Ver quem curtiu você',
      'Rewind (desfazer ação)',
      '1 Super Like por dia',
      'Boost mensal'
    ],
    prices: {
      '1': { price: 18.99, total: 18.99 },
      '6': { price: 12.66, total: 75.96 },
      '12': { price: 9.58, total: 114.96 }
    }
  },
  ouro: {
    name: 'Ouro',
    icon: Crown,
    color: 'from-yellow-400 to-yellow-600',
    features: [
      'Todos os recursos Prata',
      'Ver quem curtiu você primeiro',
      '5 Super Likes por dia',
      'Boost semanal',
      'Controles de privacidade',
      'Modo invisível'
    ],
    prices: {
      '1': { price: 29.99, total: 29.99 },
      '6': { price: 19.16, total: 114.96 },
      '12': { price: 14.16, total: 169.92 }
    }
  },
  diamante: {
    name: 'Diamante',
    icon: Diamond,
    color: 'from-blue-400 to-purple-600',
    features: [
      'Todos os recursos Ouro',
      'Mensagem antes do match',
      'Ver leituras de mensagem',
      'Lista de prioridade',
      'Super Likes ilimitados',
      'Boost diário',
      'Suporte VIP'
    ],
    prices: {
      '1': { price: 64.99, total: 64.99 },
      '6': { price: 40.83, total: 244.98 },
      '12': { price: 31.66, total: 379.92 }
    }
  }
}

const paymentMethods = [
  {
    id: 'credit',
    name: 'Cartão de Crédito/Débito',
    description: 'Visa, MasterCard, Elo',
    icon: CreditCard,
    available: true
  },
  {
    id: 'pix',
    name: 'PIX via RecargaPay',
    description: 'Cartão virtual com PIX',
    icon: Shield,
    available: true
  },
  {
    id: 'paypal',
    name: 'PayPal',
    description: 'Disponível em algumas regiões',
    icon: Shield,
    available: false
  }
]

export default function PaymentModal({ isOpen, onClose, onSuccess }: PaymentModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<'prata' | 'ouro' | 'diamante'>('ouro')
  const [selectedPeriod, setSelectedPeriod] = useState<'1' | '6' | '12'>('6')
  const [selectedPayment, setSelectedPayment] = useState('credit')
  const [step, setStep] = useState<'plans' | 'payment' | 'processing'>('plans')
  const [installments, setInstallments] = useState(1)

  if (!isOpen) return null

  const currentPlan = subscriptionPlans[selectedPlan]
  const currentPrice = currentPlan.prices[selectedPeriod]
  const maxInstallments = selectedPayment === 'credit' ? 6 : 1

  const handlePlanSelect = (plan: 'prata' | 'ouro' | 'diamante') => {
    setSelectedPlan(plan)
  }

  const handleContinue = () => {
    if (step === 'plans') {
      setStep('payment')
    } else if (step === 'payment') {
      setStep('processing')
      // Simular processamento
      setTimeout(() => {
        onSuccess(selectedPlan, selectedPeriod)
        onClose()
      }, 2000)
    }
  }

  const PlanCard = ({ planKey, plan }: { planKey: string, plan: any }) => {
    const Icon = plan.icon
    const isSelected = selectedPlan === planKey
    const isPopular = planKey === 'ouro'
    
    return (
      <div 
        onClick={() => handlePlanSelect(planKey as any)}
        className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all ${
          isSelected 
            ? 'border-pink-500 bg-pink-50 scale-105' 
            : 'border-gray-200 bg-white hover:border-gray-300'
        }`}
      >
        {isPopular && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
              Mais Popular
            </span>
          </div>
        )}
        
        <div className="text-center mb-4">
          <div className={`w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-r ${plan.color} flex items-center justify-center`}>
            <Icon className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
        </div>
        
        <div className="space-y-3 mb-6">
          {plan.features.map((feature: string, index: number) => (
            <div key={index} className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-sm text-gray-700">{feature}</span>
            </div>
          ))}
        </div>
        
        <div className="space-y-2">
          {Object.entries(plan.prices).map(([period, priceData]: [string, any]) => (
            <div 
              key={period}
              onClick={(e) => {
                e.stopPropagation()
                setSelectedPeriod(period as any)
                handlePlanSelect(planKey as any)
              }}
              className={`p-3 rounded-xl border cursor-pointer transition-colors ${
                selectedPlan === planKey && selectedPeriod === period
                  ? 'border-pink-500 bg-pink-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-semibold text-gray-900">
                    {period === '1' ? '1 mês' : period === '6' ? '6 meses' : '12 meses'}
                  </span>
                  {period !== '1' && (
                    <div className="text-sm text-green-600">
                      Economize {Math.round((1 - priceData.price / plan.prices['1'].price) * 100)}%
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg text-gray-900">
                    R$ {priceData.price.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {period === '1' ? '/mês' : '/mês'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const PlansStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Escolha seu Plano</h2>
        <p className="text-gray-600">Desbloqueie recursos premium e encontre conexões especiais</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        {Object.entries(subscriptionPlans).map(([key, plan]) => (
          <PlanCard key={key} planKey={key} plan={plan} />
        ))}
      </div>
      
      <div className="text-center">
        <button
          onClick={handleContinue}
          className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold hover:scale-105 transition-transform"
        >
          Continuar com {currentPlan.name} - R$ {currentPrice.total.toFixed(2)}
        </button>
      </div>
    </div>
  )

  const PaymentStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Forma de Pagamento</h2>
        <p className="text-gray-600">Como você gostaria de pagar?</p>
      </div>
      
      {/* Resumo do plano */}
      <div className="bg-gray-50 rounded-2xl p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${currentPlan.color} flex items-center justify-center`}>
            <currentPlan.icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{currentPlan.name}</h3>
            <p className="text-gray-600">
              {selectedPeriod === '1' ? '1 mês' : selectedPeriod === '6' ? '6 meses' : '12 meses'}
            </p>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-700">Total:</span>
          <span className="text-2xl font-bold text-gray-900">R$ {currentPrice.total.toFixed(2)}</span>
        </div>
        
        {selectedPeriod !== '1' && (
          <div className="text-sm text-green-600 text-right">
            R$ {currentPrice.price.toFixed(2)}/mês
          </div>
        )}
      </div>
      
      {/* Métodos de pagamento */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Método de Pagamento</h3>
        
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            onClick={() => method.available && setSelectedPayment(method.id)}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
              !method.available
                ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                : selectedPayment === method.id
                ? 'border-pink-500 bg-pink-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-4">
              <method.icon className="w-6 h-6 text-gray-600" />
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{method.name}</h4>
                <p className="text-sm text-gray-600">{method.description}</p>
              </div>
              {!method.available && (
                <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                  Indisponível
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Parcelamento */}
      {selectedPayment === 'credit' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Parcelamento</h3>
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: maxInstallments }, (_, i) => i + 1).map((num) => {
              const installmentValue = currentPrice.total / num
              return (
                <div
                  key={num}
                  onClick={() => setInstallments(num)}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    installments === num
                      ? 'border-pink-500 bg-pink-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="font-semibold text-gray-900">
                      {num}x de R$ {installmentValue.toFixed(2)}
                    </div>
                    {num === 1 ? (
                      <div className="text-sm text-green-600">À vista</div>
                    ) : (
                      <div className="text-sm text-gray-600">sem juros</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
      
      <div className="flex gap-4">
        <button
          onClick={() => setStep('plans')}
          className="flex-1 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
        >
          Voltar
        </button>
        <button
          onClick={handleContinue}
          className="flex-1 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold hover:scale-105 transition-transform"
        >
          Finalizar Pagamento
        </button>
      </div>
    </div>
  )

  const ProcessingStep = () => (
    <div className="text-center py-12">
      <div className="w-16 h-16 mx-auto mb-6 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Processando Pagamento</h2>
      <p className="text-gray-600">Aguarde enquanto confirmamos seu pagamento...</p>
    </div>
  )

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            LIB Match Premium
          </h1>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>
        
        <div className="p-6">
          {step === 'plans' && <PlansStep />}
          {step === 'payment' && <PaymentStep />}
          {step === 'processing' && <ProcessingStep />}
        </div>
        
        {/* Informações de segurança */}
        <div className="bg-gray-50 p-6 border-t">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <Shield className="w-4 h-4" />
            <span>Pagamento 100% seguro e criptografado</span>
          </div>
          <p className="text-xs text-gray-500 text-center mt-2">
            Os preços podem variar conforme idade, localização e promoções ativas.
            Renovação automática pode ser cancelada a qualquer momento.
          </p>
        </div>
      </div>
    </div>
  )
}