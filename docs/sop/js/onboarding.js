document.addEventListener('DOMContentLoaded', function() {
  // Verifica se é a primeira visita
  if (!localStorage.getItem('onboardingCompleted')) {
    showOnboarding();
  }

  // Adiciona evento ao botão de reset
  const resetButton = document.getElementById('resetTour');
  if (resetButton) {
    resetButton.addEventListener('click', function() {
      // Remove o item do localStorage
      localStorage.removeItem('onboardingCompleted');
      // Mostra o modal novamente
      showOnboarding();
    });
  }
});

function showOnboarding() {
  const modal = document.createElement('div');
  modal.className = 'onboarding-modal';
  modal.innerHTML = `
    <div class="onboarding-content">
      <button class="onboarding-skip" onclick="skipOnboarding()">Pular</button>
      
      <!-- Slide 1: Boas-vindas -->
      <div class="onboarding-slide active" data-slide="1">
        <h2 class="onboarding-title">Bem-vindo ao S&OP Inteligente!</h2>
        <p class="onboarding-text">
          Olá equipe Trek&Field! Estamos muito felizes em apresentar nossa nova ferramenta de S&OP Inteligente, 
          desenvolvida especialmente para otimizar suas operações e decisões estratégicas.
        </p>
        <div class="onboarding-feature">
          <svg width="32" height="32" viewBox="0 0 64 64" fill="none">
            <rect x="12" y="20" width="40" height="28" rx="14" fill="#2563eb"/>
            <circle cx="32" cy="16" r="7" fill="#60a5fa"/>
            <circle cx="22" cy="36" r="4" fill="#fff"/>
            <circle cx="42" cy="36" r="4" fill="#fff"/>
            <rect x="28" y="46" width="8" height="3" rx="1.5" fill="#60a5fa"/>
          </svg>
          <div class="onboarding-feature-text">
            Nossa ferramenta utiliza IA avançada para ajudar você a tomar decisões mais precisas e eficientes.
          </div>
        </div>
      </div>

      <!-- Slide 2: Identificação de Vieses -->
      <div class="onboarding-slide" data-slide="2">
        <h2 class="onboarding-title">Identificação de Vieses</h2>
        <p class="onboarding-text">
          Aprenda a identificar e entender os vieses dos gerentes em suas previsões, 
          permitindo decisões mais objetivas e precisas.
        </p>
        <div class="onboarding-feature">
          <svg width="32" height="32" viewBox="0 0 64 64" fill="none">
            <path d="M32 8L44 24H20L32 8Z" fill="#2563eb"/>
            <path d="M32 56L20 40H44L32 56Z" fill="#60a5fa"/>
          </svg>
          <div class="onboarding-feature-text">
            Análise de padrões de decisão usando lógica fuzzy para identificar tendências e vieses.
          </div>
        </div>
      </div>

      <!-- Slide 3: Previsão de Demanda -->
      <div class="onboarding-slide" data-slide="3">
        <h2 class="onboarding-title">Previsão de Demanda</h2>
        <p class="onboarding-text">
          Utilize modelos estatísticos avançados e machine learning para prever a demanda 
          com maior precisão.
        </p>
        <div class="onboarding-feature">
          <svg width="32" height="32" viewBox="0 0 64 64" fill="none">
            <path d="M8 48L24 32L40 40L56 24" stroke="#2563eb" stroke-width="4"/>
            <circle cx="24" cy="32" r="4" fill="#60a5fa"/>
            <circle cx="40" cy="40" r="4" fill="#60a5fa"/>
            <circle cx="56" cy="24" r="4" fill="#60a5fa"/>
          </svg>
          <div class="onboarding-feature-text">
            Compare diferentes modelos de previsão e escolha o mais adequado para cada situação.
          </div>
        </div>
      </div>

      <!-- Slide 4: Otimização -->
      <div class="onboarding-slide" data-slide="4">
        <h2 class="onboarding-title">Otimização de Ressuprimento</h2>
        <p class="onboarding-text">
          Otimize seu processo de ressuprimento com simulações de cenários e recomendações 
          inteligentes.
        </p>
        <div class="onboarding-feature">
          <svg width="32" height="32" viewBox="0 0 64 64" fill="none">
            <rect x="8" y="24" width="16" height="32" rx="2" fill="#2563eb"/>
            <rect x="28" y="16" width="16" height="40" rx="2" fill="#60a5fa"/>
            <rect x="48" y="32" width="8" height="24" rx="2" fill="#a5d6a7"/>
          </svg>
          <div class="onboarding-feature-text">
            Reduza custos e melhore a eficiência operacional com nossas recomendações baseadas em IA.
          </div>
        </div>
      </div>

      <!-- Slide 5: AI Insights -->
      <div class="onboarding-slide" data-slide="5">
        <h2 class="onboarding-title">AI Insights</h2>
        <p class="onboarding-text">
          Aproveite os insights da IA para tomar decisões mais informadas e estratégicas.
        </p>
        <div class="onboarding-feature">
          <svg width="32" height="32" viewBox="0 0 64 64" fill="none">
            <rect x="12" y="20" width="40" height="28" rx="14" fill="#2563eb"/>
            <circle cx="32" cy="16" r="7" fill="#60a5fa"/>
            <circle cx="22" cy="36" r="4" fill="#fff"/>
            <circle cx="42" cy="36" r="4" fill="#fff"/>
            <rect x="28" y="46" width="8" height="3" rx="1.5" fill="#60a5fa"/>
          </svg>
          <div class="onboarding-feature-text">
            Clique no ícone de IA em cada seção para obter insights personalizados e recomendações.
          </div>
        </div>
      </div>

      <!-- Navegação -->
      <div class="onboarding-navigation">
        <button class="onboarding-btn onboarding-btn-secondary" onclick="previousSlide()" id="prevBtn" style="display: none;">Anterior</button>
        <div class="onboarding-dots">
          <span class="onboarding-dot active" data-slide="1"></span>
          <span class="onboarding-dot" data-slide="2"></span>
          <span class="onboarding-dot" data-slide="3"></span>
          <span class="onboarding-dot" data-slide="4"></span>
          <span class="onboarding-dot" data-slide="5"></span>
        </div>
        <button class="onboarding-btn onboarding-btn-primary" onclick="nextSlide()" id="nextBtn">Próximo</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  modal.style.display = 'flex';
}

let currentSlide = 1;
const totalSlides = 5;

function updateSlide(slideNumber) {
  // Atualiza slides
  document.querySelectorAll('.onboarding-slide').forEach(slide => {
    slide.classList.remove('active');
  });
  document.querySelector(`.onboarding-slide[data-slide="${slideNumber}"]`).classList.add('active');

  // Atualiza dots
  document.querySelectorAll('.onboarding-dot').forEach(dot => {
    dot.classList.remove('active');
  });
  document.querySelector(`.onboarding-dot[data-slide="${slideNumber}"]`).classList.add('active');

  // Atualiza botões
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  prevBtn.style.display = slideNumber === 1 ? 'none' : 'block';
  nextBtn.textContent = slideNumber === totalSlides ? 'Começar' : 'Próximo';
}

function nextSlide() {
  if (currentSlide === totalSlides) {
    completeOnboarding();
  } else {
    currentSlide++;
    updateSlide(currentSlide);
  }
}

function previousSlide() {
  if (currentSlide > 1) {
    currentSlide--;
    updateSlide(currentSlide);
  }
}

function skipOnboarding() {
  completeOnboarding();
}

function completeOnboarding() {
  localStorage.setItem('onboardingCompleted', 'true');
  document.querySelector('.onboarding-modal').remove();
} 