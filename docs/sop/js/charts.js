// Configuração dos gráficos
const chartConfig = {
  type: 'line',
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#f0f0f0'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  }
};

// Gráfico de impacto da demanda
function initDemandaChart() {
  const ctx = document.getElementById('demandaChart');
  if (!ctx) return;

  new Chart(ctx, {
    ...chartConfig,
    data: {
      labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
      datasets: [{
        label: 'Demanda Real',
        data: [65, 59, 80, 81, 56, 55],
        borderColor: '#5A6A7A',
        tension: 0.4,
        fill: false
      }, {
        label: 'Previsão',
        data: [70, 62, 75, 85, 60, 58],
        borderColor: '#A3A9B8',
        tension: 0.4,
        fill: false,
        borderDash: [5, 5]
      }]
    }
  });
}

// Gráfico de barras
function initBarChart() {
  const ctx = document.getElementById('barChart');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
      datasets: [{
        label: 'Vendas',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: '#5A6A7A'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: '#f0f0f0'
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    }
  });
}

// Gráfico de barras de vieses dos gerentes
function initViesesBarChart() {
  const ctx = document.getElementById('viesesBarChart');
  if (!ctx) return;
  // Dados mockados para exemplo
  const data = {
    labels: ['CERTEIRA', 'BOA DE ROTINA', 'DESCALIBRADA', 'SONHADORA'],
    datasets: [{
      label: 'Quantidade',
      data: [2, 1, 1, 1],
      backgroundColor: ['#2563eb', '#60a5fa', '#a3a9b8', '#f7b267']
    }]
  };
  new Chart(ctx, {
    type: 'bar',
    data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true } }
    }
  });
}

function openRadarViesesModal(gerente) {
  // Dados simulados para cada gerente
  const perfis = {
    'Ana':    { label: 'Pessimista', data: [0.6, 0.8, 0.7, 0.9, 0.7], info: 'Tende a superestimar riscos e reduzir projeções.' },
    'João':   { label: 'Otimista Estratégico', data: [0.8, 0.7, 0.9, 0.6, 0.8], info: 'Foca em oportunidades e metas agressivas.' },
    'Maria':  { label: 'Pessimista', data: [0.7, 0.7, 0.8, 0.8, 0.6], info: 'Conservadora nas previsões, evita surpresas.' },
    'Pedro':  { label: 'Otimista', data: [0.9, 0.6, 0.8, 0.7, 0.9], info: 'Acredita em crescimento acima da média.' }
  };
  const perfil = perfis[gerente] || { label: 'Desconhecido', data: [0.7,0.7,0.7,0.7,0.7], info: '' };
  const modal = document.getElementById('modalRadarVieses');
  const infoDiv = document.getElementById('radarViesesInfo');
  modal.style.display = 'flex';
  infoDiv.textContent = gerente + ' - ' + perfil.label + ': ' + perfil.info;
  // Renderizar gráfico radar
  const ctx = document.getElementById('radarViesesChart').getContext('2d');
  if (window.radarViesesChartInstance) window.radarViesesChartInstance.destroy();
  window.radarViesesChartInstance = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['Média da Equipe', 'Variação por Cluster', 'Previsão do Cluster', 'Erro Absoluto Médio', 'Previsão Acima/Abaixo'],
      datasets: [{
        label: 'Perfil Fuzzy',
        data: perfil.data,
        backgroundColor: 'rgba(37,99,235,0.18)',
        borderColor: '#2563eb',
        pointBackgroundColor: '#2563eb'
      }]
    },
    options: { plugins: { legend: { display: false } }, scales: { r: { min: 0, max: 1, ticks: { stepSize: 0.2 } } } }
  });
}

// Inicializar todos os gráficos
document.addEventListener('DOMContentLoaded', () => {
  initDemandaChart();
  initBarChart();
  initViesesBarChart();
  // Evento para fechar o modal radar
  document.getElementById('fecharModalRadarVieses').onclick = function() {
    document.getElementById('modalRadarVieses').style.display = 'none';
    if (window.radarViesesChartInstance) window.radarViesesChartInstance.destroy();
  };
  document.getElementById('modalRadarVieses').onclick = function(e) {
    if (e.target === this) {
      this.style.display = 'none';
      if (window.radarViesesChartInstance) window.radarViesesChartInstance.destroy();
    }
  };
  // Corrigir eventos dos links 'Ver Detalhes'
  document.querySelectorAll('.tab-visao-geral .details-link').forEach(link => {
    link.onclick = function(e) {
      e.preventDefault();
      // Se está na tabela de vieses (primeira tabela da visão geral)
      const isVieses = this.closest('table') && this.closest('table').querySelector('th')?.textContent.includes('Gerentes');
      // Se está na demanda-card
      const isDemanda = this.closest('.demanda-card');
      if (isVieses) {
        const gerente = this.parentElement.parentElement.children[0].textContent.trim();
        openRadarViesesModal(gerente);
      } else if (isDemanda) {
        // Modal de detalhes de demanda (gráfico de linha)
        const modal = document.getElementById('detalhesModal');
        const conteudo = `<h2>Detalhes da Previsão de Demanda</h2><p>Veja a tendência da demanda prevista e do estoque para o período selecionado.</p><canvas id='modalChart' height='220' style='margin-top:1.5rem;'></canvas>`;
        document.getElementById('detalhesModalConteudo').innerHTML = conteudo;
        modal.style.display = 'flex';
        setTimeout(function() {
          const ctx = document.getElementById('modalChart').getContext('2d');
          if (window.modalChartInstance) window.modalChartInstance.destroy();
          window.modalChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
              labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
              datasets: [
                { label: 'Demanda Prevista', data: [800, 950, 1000, 900, 1100, 1200], borderColor: '#2563eb', backgroundColor: 'rgba(37,99,235,0.08)', tension: 0.4, fill: true },
                { label: 'Estoque', data: [700, 850, 900, 800, 950, 1000], borderColor: '#94a3b8', backgroundColor: 'rgba(148,163,184,0.08)', borderDash: [6,6], tension: 0.4, fill: false }
              ]
            },
            options: { plugins: { legend: { display: true, position: 'bottom' } }, scales: { x: { grid: { display: false } }, y: { beginAtZero: true } } }
          });
        }, 100);
      }
    };
  });
  // Evento para abrir o modal ao clicar em Ver Detalhes na tabela de vieses da Visão Geral (garantir sempre)
  document.querySelectorAll('.tab-visao-geral .card table .details-link').forEach(link => {
    link.onclick = function(e) {
      e.preventDefault();
      const gerente = this.parentElement.parentElement.children[0].textContent.trim();
      openRadarViesesModal(gerente);
    };
  });
}); 