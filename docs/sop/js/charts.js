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
function initDemandaImpactChart() {
  const ctx = document.getElementById('demandaImpactChart');
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

// Inicializar todos os gráficos
document.addEventListener('DOMContentLoaded', () => {
  initDemandaImpactChart();
  initBarChart();
}); 