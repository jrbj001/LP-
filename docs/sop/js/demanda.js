// Gerenciamento da seção de demanda
class DemandaManager {
  constructor() {
    this.chart = null;
    this.indicators = {
      accuracy: document.querySelector('.demanda-indicador[data-type="accuracy"]'),
      bias: document.querySelector('.demanda-indicador[data-type="bias"]'),
      mape: document.querySelector('.demanda-indicador[data-type="mape"]')
    };
    
    this.init();
  }

  init() {
    this.initChart();
    this.updateIndicators();
    this.initEventListeners();
  }

  initChart() {
    const ctx = document.getElementById('demandaImpactChart');
    if (!ctx) return;

    this.chart = new Chart(ctx, {
      type: 'line',
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

  updateIndicators() {
    // Atualizar indicadores com dados simulados
    if (this.indicators.accuracy) {
      this.indicators.accuracy.querySelector('strong').textContent = '92%';
    }
    if (this.indicators.bias) {
      this.indicators.bias.querySelector('strong').textContent = '-2.3%';
    }
    if (this.indicators.mape) {
      this.indicators.mape.querySelector('strong').textContent = '8.5%';
    }
  }

  initEventListeners() {
    // Evento para atualizar dados ao mudar filtros
    const filters = document.querySelectorAll('.filters select');
    filters.forEach(filter => {
      filter.addEventListener('change', () => {
        this.updateData();
      });
    });

    // Evento para mostrar detalhes
    const detailsLink = document.querySelector('.demanda-title-row .details-link');
    if (detailsLink) {
      detailsLink.addEventListener('click', () => {
        this.showDetails();
      });
    }
  }

  updateData() {
    // Simular atualização de dados
    const newData = {
      real: [Math.random() * 100, Math.random() * 100, Math.random() * 100, 
             Math.random() * 100, Math.random() * 100, Math.random() * 100],
      forecast: [Math.random() * 100, Math.random() * 100, Math.random() * 100,
                Math.random() * 100, Math.random() * 100, Math.random() * 100]
    };

    if (this.chart) {
      this.chart.data.datasets[0].data = newData.real;
      this.chart.data.datasets[1].data = newData.forecast;
      this.chart.update();
    }

    this.updateIndicators();
  }

  showDetails() {
    // Implementar lógica para mostrar detalhes
    console.log('Mostrando detalhes da demanda');
  }
}

// Inicializar gerenciador de demanda
document.addEventListener('DOMContentLoaded', () => {
  window.demandaManager = new DemandaManager();
}); 