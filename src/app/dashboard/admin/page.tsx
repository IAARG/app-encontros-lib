"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Users, 
  CreditCard, 
  BarChart3, 
  Settings, 
  Globe, 
  Smartphone,
  Apple,
  Monitor,
  Shield,
  Crown,
  Diamond,
  Star
} from 'lucide-react'

interface AdminStats {
  totalUsers: number
  premiumUsers: number
  revenue: number
  activeMatches: number
}

export default function AdminDashboard() {
  const [stats] = useState<AdminStats>({
    totalUsers: 15420,
    premiumUsers: 3240,
    revenue: 89750.50,
    activeMatches: 8920
  })

  const [deploymentStatus, setDeploymentStatus] = useState({
    web: 'deployed',
    android: 'pending',
    ios: 'pending'
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Painel Administrativo
            </h1>
            <p className="text-gray-600 mt-1">
              LibMatch.com.br - Gestão Completa
            </p>
          </div>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Globe className="w-4 h-4 mr-1" />
            Online
          </Badge>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuários Totais</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+12% desde o mês passado</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuários Premium</CardTitle>
              <Crown className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.premiumUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">21% do total de usuários</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
              <CreditCard className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {stats.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
              <p className="text-xs text-muted-foreground">+8% desde o mês passado</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Matches Ativos</CardTitle>
              <BarChart3 className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeMatches.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+15% desde a semana passada</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="deployment" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="deployment">Deploy & Plataformas</TabsTrigger>
            <TabsTrigger value="users">Gestão de Usuários</TabsTrigger>
            <TabsTrigger value="payments">Pagamentos</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          {/* Deployment Tab */}
          <TabsContent value="deployment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Status de Deployment
                </CardTitle>
                <CardDescription>
                  Gerencie o deployment em diferentes plataformas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Web Deployment */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Monitor className="w-8 h-8 text-blue-600" />
                    <div>
                      <h3 className="font-semibold">Web Application</h3>
                      <p className="text-sm text-gray-600">libmatch.com.br</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      Deployed
                    </Badge>
                    <Button size="sm" variant="outline">
                      Gerenciar
                    </Button>
                  </div>
                </div>

                {/* Android Deployment */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-8 h-8 text-green-600" />
                    <div>
                      <h3 className="font-semibold">Android App</h3>
                      <p className="text-sm text-gray-600">Google Play Store</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                      Em Preparação
                    </Badge>
                    <Button size="sm">
                      Configurar
                    </Button>
                  </div>
                </div>

                {/* iOS Deployment */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Apple className="w-8 h-8 text-gray-800" />
                    <div>
                      <h3 className="font-semibold">iOS App</h3>
                      <p className="text-sm text-gray-600">Apple App Store</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                      Em Preparação
                    </Badge>
                    <Button size="sm">
                      Configurar
                    </Button>
                  </div>
                </div>

                {/* Domain Configuration */}
                <Card className="bg-blue-50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Shield className="w-5 h-5 text-blue-600" />
                      Configuração de Domínio
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="domain">Domínio Principal</Label>
                        <Input 
                          id="domain" 
                          value="libmatch.com.br" 
                          readOnly 
                          className="bg-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="subdomain">Subdomínio Admin</Label>
                        <Input 
                          id="subdomain" 
                          value="admin.libmatch.com.br" 
                          readOnly 
                          className="bg-white"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Verificar DNS
                      </Button>
                      <Button size="sm" variant="outline">
                        Renovar SSL
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Classificações de Usuários</CardTitle>
                <CardDescription>
                  Distribuição por tipo de assinatura
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg bg-gray-50">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-5 h-5 text-gray-600" />
                      <h3 className="font-semibold">Prata</h3>
                    </div>
                    <p className="text-2xl font-bold">8,420</p>
                    <p className="text-sm text-gray-600">54.6% dos usuários</p>
                  </div>
                  
                  <div className="p-4 border rounded-lg bg-yellow-50">
                    <div className="flex items-center gap-2 mb-2">
                      <Crown className="w-5 h-5 text-yellow-600" />
                      <h3 className="font-semibold">Ouro</h3>
                    </div>
                    <p className="text-2xl font-bold">2,180</p>
                    <p className="text-sm text-gray-600">14.1% dos usuários</p>
                  </div>
                  
                  <div className="p-4 border rounded-lg bg-blue-50">
                    <div className="flex items-center gap-2 mb-2">
                      <Diamond className="w-5 h-5 text-blue-600" />
                      <h3 className="font-semibold">Diamante</h3>
                    </div>
                    <p className="text-2xl font-bold">1,060</p>
                    <p className="text-sm text-gray-600">6.9% dos usuários</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Métodos de Pagamento Ativos</CardTitle>
                <CardDescription>
                  Configurações baseadas no modelo Tinder
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded">
                    <span>Cartão de Crédito/Débito</span>
                    <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <span>PIX via RecargaPay</span>
                    <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <span>PayPal</span>
                    <Badge className="bg-yellow-100 text-yellow-800">Limitado</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <span>Parcelamento 6x</span>
                    <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Configurações do Sistema
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="app-name">Nome da Aplicação</Label>
                    <Input id="app-name" value="LibMatch" />
                  </div>
                  <div>
                    <Label htmlFor="app-version">Versão</Label>
                    <Input id="app-version" value="1.0.0" />
                  </div>
                </div>
                <Button>Salvar Configurações</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}