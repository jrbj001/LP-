// Gerenciamento do modal de insights de IA
class AIInsightsManager {
  constructor() {
    this.modal = document.querySelector('.ai-insights-modal');
    this.minimizeBtn = document.querySelector('.ai-close-btn');
    this.robotIcon = document.querySelector('.ai-robot-icon');
    this.content = document.querySelector('.ai-insights-content');
    this.header = document.querySelector('.ai-insights-header');
    
    this.init();
  }

  init() {
    if (!this.modal) return;

    // Minimizar/maximizar modal
    this.minimizeBtn?.addEventListener('click', () => {
      this.modal.classList.toggle('minimized');
    });

    // Restaurar modal minimizado ao clicar no ícone
    this.robotIcon?.addEventListener('click', () => {
      if (this.modal.classList.contains('minimized')) {
        this.modal.classList.remove('minimized');
      }
    });

    // Fechar modal ao clicar fora
    document.addEventListener('click', (e) => {
      if (!this.modal?.contains(e.target) && !e.target.closest('.ai-help-icon')) {
        this.modal?.classList.add('minimized');
      }
    });
  }

  // Atualizar conteúdo do insight
  updateInsight(content) {
    if (this.content) {
      this.content.textContent = content;
    }
  }
}

// Gerenciamento do tutor de IA
class AITutorManager {
  constructor() {
    this.overlay = document.querySelector('.ai-tutor-overlay');
    this.modal = document.querySelector('.ai-tutor-modal');
    this.closeBtn = document.querySelector('.ai-tutor-close');
    this.nextBtn = document.querySelector('.ai-tutor-next');
    this.prevBtn = document.querySelector('.ai-tutor-prev');
    
    this.currentStep = 0;
    this.steps = [
      {
        content: 'Bem-vindo ao S&OP Inteligente! Vou te ajudar a entender como usar esta ferramenta.',
        showPrev: false
      },
      {
        content: 'Aqui você pode ver os principais indicadores de desempenho do seu negócio.',
        showPrev: true
      },
      {
        content: 'Use os filtros no topo para ajustar os dados conforme sua necessidade.',
        showPrev: true
      }
    ];

    this.init();
  }

  init() {
    if (!this.modal) return;

    // Fechar tutor
    this.closeBtn?.addEventListener('click', () => {
      this.hide();
    });

    // Próximo passo
    this.nextBtn?.addEventListener('click', () => {
      if (this.currentStep < this.steps.length - 1) {
        this.currentStep++;
        this.updateContent();
      } else {
        this.hide();
      }
    });

    // Passo anterior
    this.prevBtn?.addEventListener('click', () => {
      if (this.currentStep > 0) {
        this.currentStep--;
        this.updateContent();
      }
    });

    // Fechar ao clicar fora
    this.overlay?.addEventListener('click', (e) => {
      if (e.target === this.overlay) {
        this.hide();
      }
    });
  }

  show() {
    this.overlay?.classList.remove('hidden');
    this.modal?.classList.remove('hidden');
    this.updateContent();
  }

  hide() {
    this.overlay?.classList.add('hidden');
    this.modal?.classList.add('hidden');
  }

  updateContent() {
    const step = this.steps[this.currentStep];
    if (!step) return;

    const content = this.modal?.querySelector('.ai-tutor-content');
    if (content) {
      content.textContent = step.content;
    }

    if (this.prevBtn) {
      this.prevBtn.style.display = step.showPrev ? 'block' : 'none';
    }

    if (this.nextBtn) {
      this.nextBtn.textContent = this.currentStep === this.steps.length - 1 ? 'Concluir' : 'Próximo';
    }
  }
}

// Inicializar gerenciadores
document.addEventListener('DOMContentLoaded', () => {
  window.aiInsights = new AIInsightsManager();
  window.aiTutor = new AITutorManager();
}); 