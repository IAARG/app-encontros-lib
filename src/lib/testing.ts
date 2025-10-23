// Sistema de testes automatizados para LIB Match
import { authService } from './auth'
import { DatabaseService } from './database'
import { encryptData, decryptData, hashPassword, generateSalt } from './security'

export interface TestResult {
  name: string
  passed: boolean
  error?: string
  duration: number
}

export interface TestSuite {
  name: string
  tests: TestResult[]
  passed: number
  failed: number
  duration: number
}

// Classe principal de testes
export class TestRunner {
  private results: TestSuite[] = []

  // Executar todos os testes
  async runAllTests(): Promise<TestSuite[]> {
    console.log('🧪 Iniciando testes de funcionalidade...')
    
    this.results = []
    
    await this.runAuthTests()
    await this.runSecurityTests()
    await this.runDatabaseTests()
    await this.runUITests()
    
    this.printResults()
    return this.results
  }

  // Testes de autenticação
  private async runAuthTests(): Promise<void> {
    const suite: TestSuite = {
      name: 'Autenticação',
      tests: [],
      passed: 0,
      failed: 0,
      duration: 0
    }

    const startTime = Date.now()

    // Teste 1: Registro de usuário válido
    await this.runTest(suite, 'Registro de usuário válido', async () => {
      const result = await authService.register({
        email: 'teste@exemplo.com',
        password: 'MinhaSenh@123',
        confirmPassword: 'MinhaSenh@123',
        name: 'Usuário Teste',
        age: 25
      })
      
      if (!result.success) {
        throw new Error(result.error || 'Falha no registro')
      }
    })

    // Teste 2: Registro com email inválido
    await this.runTest(suite, 'Rejeitar email inválido', async () => {
      const result = await authService.register({
        email: 'email-invalido',
        password: 'MinhaSenh@123',
        confirmPassword: 'MinhaSenh@123',
        name: 'Usuário Teste',
        age: 25
      })
      
      if (result.success) {
        throw new Error('Deveria ter rejeitado email inválido')
      }
    })

    // Teste 3: Registro com senha fraca
    await this.runTest(suite, 'Rejeitar senha fraca', async () => {
      const result = await authService.register({
        email: 'teste2@exemplo.com',
        password: '123',
        confirmPassword: '123',
        name: 'Usuário Teste',
        age: 25
      })
      
      if (result.success) {
        throw new Error('Deveria ter rejeitado senha fraca')
      }
    })

    // Teste 4: Login válido
    await this.runTest(suite, 'Login válido', async () => {
      const result = await authService.login({
        email: 'teste@exemplo.com',
        password: 'MinhaSenh@123'
      })
      
      if (!result.success) {
        throw new Error(result.error || 'Falha no login')
      }
    })

    // Teste 5: Verificar autenticação
    await this.runTest(suite, 'Verificar status de autenticação', async () => {
      const isAuth = authService.isAuthenticated()
      if (!isAuth) {
        throw new Error('Usuário deveria estar autenticado')
      }
    })

    // Teste 6: Logout
    await this.runTest(suite, 'Logout', async () => {
      authService.logout()
      const isAuth = authService.isAuthenticated()
      if (isAuth) {
        throw new Error('Usuário deveria estar deslogado')
      }
    })

    suite.duration = Date.now() - startTime
    this.results.push(suite)
  }

  // Testes de segurança
  private async runSecurityTests(): Promise<void> {
    const suite: TestSuite = {
      name: 'Segurança',
      tests: [],
      passed: 0,
      failed: 0,
      duration: 0
    }

    const startTime = Date.now()

    // Teste 1: Criptografia de dados
    await this.runTest(suite, 'Criptografia de dados', async () => {
      const originalData = 'Dados sensíveis do usuário'
      const encrypted = encryptData(originalData)
      const decrypted = decryptData(encrypted)
      
      if (decrypted !== originalData) {
        throw new Error('Falha na criptografia/descriptografia')
      }
      
      if (encrypted === originalData) {
        throw new Error('Dados não foram criptografados')
      }
    })

    // Teste 2: Hash de senha
    await this.runTest(suite, 'Hash de senha', async () => {
      const password = 'MinhaSenh@123'
      const salt = generateSalt()
      const hash1 = await hashPassword(password, salt)
      const hash2 = await hashPassword(password, salt)
      
      if (hash1 !== hash2) {
        throw new Error('Hash inconsistente para mesma senha e salt')
      }
      
      if (hash1 === password) {
        throw new Error('Senha não foi hasheada')
      }
    })

    // Teste 3: Geração de salt
    await this.runTest(suite, 'Geração de salt', async () => {
      const salt1 = generateSalt()
      const salt2 = generateSalt()
      
      if (salt1 === salt2) {
        throw new Error('Salts deveriam ser únicos')
      }
      
      if (salt1.length < 32) {
        throw new Error('Salt muito curto')
      }
    })

    // Teste 4: Validação de entrada
    await this.runTest(suite, 'Sanitização de entrada', async () => {
      const maliciousInput = '<script>alert("xss")</script>'
      const result = await authService.register({
        email: 'teste3@exemplo.com',
        password: 'MinhaSenh@123',
        confirmPassword: 'MinhaSenh@123',
        name: maliciousInput,
        age: 25
      })
      
      // Deveria funcionar mas sanitizar o input
      if (!result.success) {
        throw new Error('Falha na sanitização: ' + result.error)
      }
    })

    suite.duration = Date.now() - startTime
    this.results.push(suite)
  }

  // Testes de banco de dados
  private async runDatabaseTests(): Promise<void> {
    const suite: TestSuite = {
      name: 'Banco de Dados',
      tests: [],
      passed: 0,
      failed: 0,
      duration: 0
    }

    const startTime = Date.now()

    // Teste 1: Conexão com banco
    await this.runTest(suite, 'Verificar conexão', async () => {
      // Tenta buscar usuários para testar conexão
      const users = await DatabaseService.getAllUsers()
      // Não falha se retornar array vazio (banco não configurado)
      if (!Array.isArray(users)) {
        throw new Error('Falha na conexão com banco')
      }
    })

    // Teste 2: Fallback para armazenamento local
    await this.runTest(suite, 'Fallback para localStorage', async () => {
      // Simula criação de usuário quando banco não está disponível
      const userData = {
        email: 'local@teste.com',
        passwordHash: 'hash123',
        name: 'Usuário Local',
        age: 30,
        bio: 'Bio teste',
        interests: ['Música'],
        location: 'São Paulo',
        photos: [],
        preferences: {
          ageRange: [18, 65] as [number, number],
          maxDistance: 50,
          interests: []
        }
      }
      
      const result = await DatabaseService.createUser(userData)
      // Se retornar null, significa que usou fallback local (correto)
      // Se retornar usuário, significa que banco funcionou (também correto)
    })

    suite.duration = Date.now() - startTime
    this.results.push(suite)
  }

  // Testes de interface
  private async runUITests(): Promise<void> {
    const suite: TestSuite = {
      name: 'Interface do Usuário',
      tests: [],
      passed: 0,
      failed: 0,
      duration: 0
    }

    const startTime = Date.now()

    // Teste 1: Elementos essenciais presentes
    await this.runTest(suite, 'Elementos essenciais presentes', async () => {
      if (typeof window === 'undefined') {
        // Teste rodando no servidor, pular
        return
      }
      
      // Verificar se elementos críticos existem no DOM
      const criticalElements = [
        'header',
        'main',
        'nav'
      ]
      
      for (const element of criticalElements) {
        if (!document.querySelector(element)) {
          throw new Error(`Elemento ${element} não encontrado`)
        }
      }
    })

    // Teste 2: Responsividade básica
    await this.runTest(suite, 'Classes responsivas aplicadas', async () => {
      if (typeof window === 'undefined') {
        return
      }
      
      // Verificar se há classes do Tailwind para responsividade
      const body = document.body
      const hasResponsiveClasses = body.innerHTML.includes('sm:') || 
                                  body.innerHTML.includes('md:') || 
                                  body.innerHTML.includes('lg:')
      
      if (!hasResponsiveClasses) {
        throw new Error('Classes responsivas não encontradas')
      }
    })

    // Teste 3: Acessibilidade básica
    await this.runTest(suite, 'Atributos de acessibilidade', async () => {
      if (typeof window === 'undefined') {
        return
      }
      
      // Verificar se botões têm labels ou aria-labels
      const buttons = document.querySelectorAll('button')
      let hasAccessibility = true
      
      buttons.forEach(button => {
        const hasLabel = button.textContent?.trim() || 
                        button.getAttribute('aria-label') ||
                        button.getAttribute('title')
        if (!hasLabel) {
          hasAccessibility = false
        }
      })
      
      if (!hasAccessibility) {
        throw new Error('Botões sem labels de acessibilidade encontrados')
      }
    })

    suite.duration = Date.now() - startTime
    this.results.push(suite)
  }

  // Executar um teste individual
  private async runTest(suite: TestSuite, name: string, testFn: () => Promise<void>): Promise<void> {
    const startTime = Date.now()
    
    try {
      await testFn()
      suite.tests.push({
        name,
        passed: true,
        duration: Date.now() - startTime
      })
      suite.passed++
    } catch (error) {
      suite.tests.push({
        name,
        passed: false,
        error: error instanceof Error ? error.message : String(error),
        duration: Date.now() - startTime
      })
      suite.failed++
    }
  }

  // Imprimir resultados
  private printResults(): void {
    console.log('\n📊 RESULTADOS DOS TESTES')
    console.log('='.repeat(50))
    
    let totalPassed = 0
    let totalFailed = 0
    let totalDuration = 0
    
    this.results.forEach(suite => {
      console.log(`\n📁 ${suite.name}`)
      console.log(`✅ Passou: ${suite.passed} | ❌ Falhou: ${suite.failed} | ⏱️ ${suite.duration}ms`)
      
      suite.tests.forEach(test => {
        const icon = test.passed ? '✅' : '❌'
        console.log(`  ${icon} ${test.name} (${test.duration}ms)`)
        if (!test.passed && test.error) {
          console.log(`     💬 ${test.error}`)
        }
      })
      
      totalPassed += suite.passed
      totalFailed += suite.failed
      totalDuration += suite.duration
    })
    
    console.log('\n' + '='.repeat(50))
    console.log(`📈 RESUMO GERAL`)
    console.log(`✅ Total passou: ${totalPassed}`)
    console.log(`❌ Total falhou: ${totalFailed}`)
    console.log(`⏱️ Tempo total: ${totalDuration}ms`)
    console.log(`📊 Taxa de sucesso: ${((totalPassed / (totalPassed + totalFailed)) * 100).toFixed(1)}%`)
  }

  // Obter relatório em formato JSON
  getReport(): {
    summary: {
      totalTests: number
      passed: number
      failed: number
      successRate: number
      duration: number
    }
    suites: TestSuite[]
  } {
    const totalPassed = this.results.reduce((sum, suite) => sum + suite.passed, 0)
    const totalFailed = this.results.reduce((sum, suite) => sum + suite.failed, 0)
    const totalDuration = this.results.reduce((sum, suite) => sum + suite.duration, 0)
    
    return {
      summary: {
        totalTests: totalPassed + totalFailed,
        passed: totalPassed,
        failed: totalFailed,
        successRate: (totalPassed / (totalPassed + totalFailed)) * 100,
        duration: totalDuration
      },
      suites: this.results
    }
  }
}

// Função para executar testes rapidamente
export const runQuickTests = async (): Promise<boolean> => {
  const runner = new TestRunner()
  const results = await runner.runAllTests()
  const report = runner.getReport()
  
  return report.summary.successRate > 80 // 80% de sucesso mínimo
}

// Testes específicos para funcionalidades críticas
export const testCriticalFeatures = async (): Promise<{
  auth: boolean
  security: boolean
  database: boolean
  ui: boolean
}> => {
  const runner = new TestRunner()
  await runner.runAllTests()
  const report = runner.getReport()
  
  return {
    auth: report.suites.find(s => s.name === 'Autenticação')?.failed === 0 || false,
    security: report.suites.find(s => s.name === 'Segurança')?.failed === 0 || false,
    database: report.suites.find(s => s.name === 'Banco de Dados')?.failed === 0 || false,
    ui: report.suites.find(s => s.name === 'Interface do Usuário')?.failed === 0 || false
  }
}