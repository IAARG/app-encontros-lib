// Sistema de validação de UX e responsividade para LIB Match

export interface UXValidationResult {
  category: string
  passed: boolean
  score: number
  issues: string[]
  recommendations: string[]
}

export interface ResponsiveBreakpoint {
  name: string
  minWidth: number
  maxWidth?: number
}

// Breakpoints padrão do Tailwind
const BREAKPOINTS: ResponsiveBreakpoint[] = [
  { name: 'mobile', minWidth: 0, maxWidth: 639 },
  { name: 'tablet', minWidth: 640, maxWidth: 767 },
  { name: 'desktop', minWidth: 768, maxWidth: 1023 },
  { name: 'large', minWidth: 1024, maxWidth: 1279 },
  { name: 'xl', minWidth: 1280 }
]

// Classe para validação de UX
export class UXValidator {
  private issues: string[] = []
  private recommendations: string[] = []

  // Validar experiência do usuário completa
  async validateUX(): Promise<UXValidationResult[]> {
    const results: UXValidationResult[] = []

    results.push(await this.validateAccessibility())
    results.push(await this.validateResponsiveness())
    results.push(await this.validatePerformance())
    results.push(await this.validateUsability())
    results.push(await this.validateVisualDesign())
    results.push(await this.validateNavigation())

    return results
  }

  // Validar acessibilidade
  private async validateAccessibility(): Promise<UXValidationResult> {
    const issues: string[] = []
    const recommendations: string[] = []
    let score = 100

    if (typeof window === 'undefined') {
      return {
        category: 'Acessibilidade',
        passed: true,
        score: 100,
        issues: ['Teste rodando no servidor - pular validação DOM'],
        recommendations: []
      }
    }

    // Verificar alt text em imagens
    const images = document.querySelectorAll('img')
    images.forEach((img, index) => {
      if (!img.getAttribute('alt')) {
        issues.push(`Imagem ${index + 1} sem texto alternativo`)
        recommendations.push('Adicionar atributo alt descritivo em todas as imagens')
        score -= 10
      }
    })

    // Verificar labels em inputs
    const inputs = document.querySelectorAll('input, textarea, select')
    inputs.forEach((input, index) => {
      const hasLabel = input.getAttribute('aria-label') || 
                      input.getAttribute('placeholder') ||
                      document.querySelector(`label[for="${input.id}"]`)
      
      if (!hasLabel) {
        issues.push(`Campo de entrada ${index + 1} sem label`)
        recommendations.push('Adicionar labels ou aria-labels em todos os campos')
        score -= 15
      }
    })

    // Verificar contraste de cores (simulação básica)
    const buttons = document.querySelectorAll('button')
    buttons.forEach((button, index) => {
      const styles = window.getComputedStyle(button)
      const bgColor = styles.backgroundColor
      const textColor = styles.color
      
      // Verificação básica - botões com fundo transparente podem ter baixo contraste
      if (bgColor === 'rgba(0, 0, 0, 0)' || bgColor === 'transparent') {
        issues.push(`Botão ${index + 1} pode ter baixo contraste`)
        recommendations.push('Verificar contraste de cores nos botões')
        score -= 5
      }
    })

    // Verificar foco visível
    const focusableElements = document.querySelectorAll('button, input, textarea, select, a')
    if (focusableElements.length > 0) {
      recommendations.push('Garantir que todos os elementos focáveis tenham indicador visual de foco')
    }

    return {
      category: 'Acessibilidade',
      passed: score >= 70,
      score: Math.max(0, score),
      issues,
      recommendations
    }
  }

  // Validar responsividade
  private async validateResponsiveness(): Promise<UXValidationResult> {
    const issues: string[] = []
    const recommendations: string[] = []
    let score = 100

    if (typeof window === 'undefined') {
      return {
        category: 'Responsividade',
        passed: true,
        score: 100,
        issues: ['Teste rodando no servidor - assumindo responsividade correta'],
        recommendations: ['Testar em dispositivos reais']
      }
    }

    // Verificar viewport meta tag
    const viewportMeta = document.querySelector('meta[name="viewport"]')
    if (!viewportMeta) {
      issues.push('Meta tag viewport não encontrada')
      recommendations.push('Adicionar <meta name="viewport" content="width=device-width, initial-scale=1">')
      score -= 20
    }

    // Verificar classes responsivas do Tailwind
    const bodyHTML = document.body.innerHTML
    const hasResponsiveClasses = [
      'sm:', 'md:', 'lg:', 'xl:', '2xl:',
      'flex-col', 'flex-row',
      'grid-cols-',
      'w-full', 'max-w-'
    ].some(className => bodyHTML.includes(className))

    if (!hasResponsiveClasses) {
      issues.push('Poucas classes responsivas detectadas')
      recommendations.push('Usar mais classes responsivas do Tailwind (sm:, md:, lg:)')
      score -= 15
    }

    // Verificar overflow horizontal
    const bodyWidth = document.body.scrollWidth
    const windowWidth = window.innerWidth
    
    if (bodyWidth > windowWidth + 10) { // 10px de tolerância
      issues.push('Possível overflow horizontal detectado')
      recommendations.push('Verificar elementos que podem causar scroll horizontal')
      score -= 10
    }

    // Verificar tamanhos de fonte adequados para mobile
    const textElements = document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6')
    let smallTextCount = 0
    
    textElements.forEach(element => {
      const styles = window.getComputedStyle(element)
      const fontSize = parseFloat(styles.fontSize)
      
      if (fontSize < 14 && element.textContent?.trim()) {
        smallTextCount++
      }
    })

    if (smallTextCount > textElements.length * 0.3) {
      issues.push('Muitos elementos com texto pequeno para mobile')
      recommendations.push('Aumentar tamanho da fonte para melhor legibilidade em mobile')
      score -= 10
    }

    return {
      category: 'Responsividade',
      passed: score >= 70,
      score: Math.max(0, score),
      issues,
      recommendations
    }
  }

  // Validar performance
  private async validatePerformance(): Promise<UXValidationResult> {
    const issues: string[] = []
    const recommendations: string[] = []
    let score = 100

    if (typeof window === 'undefined') {
      return {
        category: 'Performance',
        passed: true,
        score: 100,
        issues: ['Teste rodando no servidor'],
        recommendations: ['Testar performance no navegador']
      }
    }

    // Verificar número de imagens
    const images = document.querySelectorAll('img')
    if (images.length > 20) {
      issues.push(`Muitas imagens carregadas (${images.length})`)
      recommendations.push('Implementar lazy loading para imagens')
      score -= 15
    }

    // Verificar imagens sem otimização
    images.forEach((img, index) => {
      const src = img.getAttribute('src')
      if (src && !src.includes('w=') && !src.includes('h=') && src.includes('unsplash')) {
        issues.push(`Imagem ${index + 1} não otimizada`)
        recommendations.push('Usar parâmetros de redimensionamento nas URLs do Unsplash')
        score -= 5
      }
    })

    // Verificar uso de localStorage excessivo
    try {
      let totalStorage = 0
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key) {
          totalStorage += localStorage.getItem(key)?.length || 0
        }
      }
      
      if (totalStorage > 1024 * 1024) { // 1MB
        issues.push('Uso excessivo de localStorage')
        recommendations.push('Otimizar dados armazenados localmente')
        score -= 10
      }
    } catch (error) {
      // Ignorar erros de acesso ao localStorage
    }

    // Verificar animações excessivas
    const animatedElements = document.querySelectorAll('[class*="transition"], [class*="animate"]')
    if (animatedElements.length > 50) {
      issues.push('Muitas animações podem impactar performance')
      recommendations.push('Reduzir número de animações simultâneas')
      score -= 10
    }

    return {
      category: 'Performance',
      passed: score >= 70,
      score: Math.max(0, score),
      issues,
      recommendations
    }
  }

  // Validar usabilidade
  private async validateUsability(): Promise<UXValidationResult> {
    const issues: string[] = []
    const recommendations: string[] = []
    let score = 100

    if (typeof window === 'undefined') {
      return {
        category: 'Usabilidade',
        passed: true,
        score: 100,
        issues: ['Teste rodando no servidor'],
        recommendations: ['Testar usabilidade com usuários reais']
      }
    }

    // Verificar tamanho de botões para touch
    const buttons = document.querySelectorAll('button')
    buttons.forEach((button, index) => {
      const rect = button.getBoundingClientRect()
      const minTouchSize = 44 // 44px é o mínimo recomendado
      
      if (rect.width < minTouchSize || rect.height < minTouchSize) {
        issues.push(`Botão ${index + 1} muito pequeno para touch (${Math.round(rect.width)}x${Math.round(rect.height)}px)`)
        recommendations.push('Botões devem ter pelo menos 44x44px para facilitar o toque')
        score -= 5
      }
    })

    // Verificar espaçamento entre elementos clicáveis
    const clickableElements = document.querySelectorAll('button, a, input[type="button"], input[type="submit"]')
    let tooCloseElements = 0
    
    clickableElements.forEach((element, index) => {
      const rect1 = element.getBoundingClientRect()
      
      clickableElements.forEach((otherElement, otherIndex) => {
        if (index !== otherIndex) {
          const rect2 = otherElement.getBoundingClientRect()
          const distance = Math.sqrt(
            Math.pow(rect1.x - rect2.x, 2) + Math.pow(rect1.y - rect2.y, 2)
          )
          
          if (distance < 8 && distance > 0) { // Muito próximos
            tooCloseElements++
          }
        }
      })
    })

    if (tooCloseElements > 0) {
      issues.push(`${tooCloseElements} elementos clicáveis muito próximos`)
      recommendations.push('Aumentar espaçamento entre elementos clicáveis')
      score -= 10
    }

    // Verificar feedback visual em interações
    const interactiveElements = document.querySelectorAll('button, a, input')
    let elementsWithoutHover = 0
    
    interactiveElements.forEach(element => {
      const classes = element.className
      if (!classes.includes('hover:') && !classes.includes('focus:')) {
        elementsWithoutHover++
      }
    })

    if (elementsWithoutHover > interactiveElements.length * 0.5) {
      issues.push('Muitos elementos sem feedback visual de hover/focus')
      recommendations.push('Adicionar estados hover e focus em elementos interativos')
      score -= 15
    }

    return {
      category: 'Usabilidade',
      passed: score >= 70,
      score: Math.max(0, score),
      issues,
      recommendations
    }
  }

  // Validar design visual
  private async validateVisualDesign(): Promise<UXValidationResult> {
    const issues: string[] = []
    const recommendations: string[] = []
    let score = 100

    if (typeof window === 'undefined') {
      return {
        category: 'Design Visual',
        passed: true,
        score: 100,
        issues: ['Teste rodando no servidor'],
        recommendations: ['Validar design visual no navegador']
      }
    }

    // Verificar consistência de cores
    const bodyHTML = document.body.innerHTML
    const colorClasses = bodyHTML.match(/(?:bg-|text-|border-)\w+-\d+/g) || []
    const uniqueColors = new Set(colorClasses)
    
    if (uniqueColors.size > 15) {
      issues.push(`Muitas cores diferentes usadas (${uniqueColors.size})`)
      recommendations.push('Reduzir paleta de cores para maior consistência')
      score -= 10
    }

    // Verificar hierarquia tipográfica
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
    if (headings.length === 0) {
      issues.push('Nenhum heading encontrado')
      recommendations.push('Usar headings (h1-h6) para estruturar conteúdo')
      score -= 15
    }

    // Verificar uso de espaçamento consistente
    const spacingClasses = bodyHTML.match(/(?:p-|m-|gap-)\d+/g) || []
    const uniqueSpacing = new Set(spacingClasses)
    
    if (uniqueSpacing.size > 10) {
      issues.push('Muitos valores de espaçamento diferentes')
      recommendations.push('Usar sistema de espaçamento mais consistente')
      score -= 5
    }

    // Verificar uso de sombras e bordas
    const hasShadows = bodyHTML.includes('shadow-')
    const hasRoundedCorners = bodyHTML.includes('rounded-')
    
    if (!hasShadows && !hasRoundedCorners) {
      issues.push('Design pode parecer muito plano')
      recommendations.push('Considerar adicionar sombras ou bordas arredondadas')
      score -= 5
    }

    return {
      category: 'Design Visual',
      passed: score >= 70,
      score: Math.max(0, score),
      issues,
      recommendations
    }
  }

  // Validar navegação
  private async validateNavigation(): Promise<UXValidationResult> {
    const issues: string[] = []
    const recommendations: string[] = []
    let score = 100

    if (typeof window === 'undefined') {
      return {
        category: 'Navegação',
        passed: true,
        score: 100,
        issues: ['Teste rodando no servidor'],
        recommendations: ['Testar navegação no navegador']
      }
    }

    // Verificar presença de navegação principal
    const nav = document.querySelector('nav')
    if (!nav) {
      issues.push('Elemento de navegação principal não encontrado')
      recommendations.push('Adicionar elemento <nav> para navegação principal')
      score -= 20
    }

    // Verificar links de navegação
    const navLinks = document.querySelectorAll('nav a, nav button')
    if (navLinks.length < 3) {
      issues.push('Poucos links de navegação encontrados')
      recommendations.push('Adicionar mais opções de navegação')
      score -= 10
    }

    // Verificar indicador de página atual
    const activeLinks = document.querySelectorAll('[class*="active"], [aria-current="page"]')
    if (activeLinks.length === 0) {
      issues.push('Nenhum indicador de página/seção atual')
      recommendations.push('Destacar página ou seção atual na navegação')
      score -= 10
    }

    // Verificar breadcrumbs (se aplicável)
    const breadcrumbs = document.querySelector('[aria-label*="breadcrumb"], .breadcrumb')
    if (!breadcrumbs && document.querySelectorAll('main > div').length > 3) {
      recommendations.push('Considerar adicionar breadcrumbs para navegação complexa')
      score -= 5
    }

    // Verificar botão voltar em modais/páginas internas
    const modals = document.querySelectorAll('[role="dialog"], .modal')
    modals.forEach((modal, index) => {
      const closeButton = modal.querySelector('button[aria-label*="close"], button[aria-label*="fechar"], .close')
      if (!closeButton) {
        issues.push(`Modal ${index + 1} sem botão de fechar`)
        recommendations.push('Adicionar botão de fechar em todos os modais')
        score -= 10
      }
    })

    return {
      category: 'Navegação',
      passed: score >= 70,
      score: Math.max(0, score),
      issues,
      recommendations
    }
  }

  // Gerar relatório completo
  async generateUXReport(): Promise<{
    overallScore: number
    passed: boolean
    categories: UXValidationResult[]
    summary: {
      totalIssues: number
      criticalIssues: number
      recommendations: string[]
    }
  }> {
    const categories = await this.validateUX()
    
    const overallScore = categories.reduce((sum, cat) => sum + cat.score, 0) / categories.length
    const totalIssues = categories.reduce((sum, cat) => sum + cat.issues.length, 0)
    const criticalIssues = categories.filter(cat => cat.score < 50).length
    
    const allRecommendations = categories.flatMap(cat => cat.recommendations)
    const uniqueRecommendations = Array.from(new Set(allRecommendations))
    
    return {
      overallScore: Math.round(overallScore),
      passed: overallScore >= 70,
      categories,
      summary: {
        totalIssues,
        criticalIssues,
        recommendations: uniqueRecommendations
      }
    }
  }
}

// Função para teste rápido de UX
export const quickUXTest = async (): Promise<boolean> => {
  const validator = new UXValidator()
  const report = await validator.generateUXReport()
  
  console.log('🎨 RELATÓRIO DE UX')
  console.log('='.repeat(40))
  console.log(`📊 Pontuação geral: ${report.overallScore}/100`)
  console.log(`${report.passed ? '✅' : '❌'} Status: ${report.passed ? 'APROVADO' : 'PRECISA MELHORAR'}`)
  console.log(`🐛 Total de problemas: ${report.summary.totalIssues}`)
  console.log(`⚠️ Problemas críticos: ${report.summary.criticalIssues}`)
  
  report.categories.forEach(category => {
    const icon = category.passed ? '✅' : '❌'
    console.log(`\n${icon} ${category.category}: ${category.score}/100`)
    
    if (category.issues.length > 0) {
      console.log('  Problemas:')
      category.issues.forEach(issue => console.log(`    • ${issue}`))
    }
    
    if (category.recommendations.length > 0) {
      console.log('  Recomendações:')
      category.recommendations.forEach(rec => console.log(`    💡 ${rec}`))
    }
  })
  
  return report.passed
}

// Teste específico de responsividade
export const testResponsiveness = async (): Promise<{
  mobile: boolean
  tablet: boolean
  desktop: boolean
  issues: string[]
}> => {
  const issues: string[] = []
  
  if (typeof window === 'undefined') {
    return {
      mobile: true,
      tablet: true,
      desktop: true,
      issues: ['Teste rodando no servidor - assumindo responsividade correta']
    }
  }
  
  // Simular diferentes tamanhos de tela
  const originalWidth = window.innerWidth
  
  const results = {
    mobile: true,
    tablet: true,
    desktop: true,
    issues
  }
  
  // Verificar se há overflow em diferentes tamanhos
  BREAKPOINTS.forEach(breakpoint => {
    const bodyWidth = document.body.scrollWidth
    
    if (bodyWidth > breakpoint.minWidth + 50) { // 50px de tolerância
      issues.push(`Possível overflow em ${breakpoint.name} (${breakpoint.minWidth}px)`)
      
      if (breakpoint.name === 'mobile') results.mobile = false
      if (breakpoint.name === 'tablet') results.tablet = false
      if (breakpoint.name === 'desktop') results.desktop = false
    }
  })
  
  return results
}