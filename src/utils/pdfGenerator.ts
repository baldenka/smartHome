export const generateTechnicalReport = (devices: any[], period: { start: string; end: string }) => {
    const html = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .table { width: 100%; border-collapse: collapse; }
            .table th, .table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            .table th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>ОТЧЕТ о техническом состоянии устройств</h1>
            <p>Период: ${period.start} - ${period.end}</p>
          </div>
          <table class="table">
            <thead>
              <tr>
                <th>Устройство</th>
                <th>Статус</th>
                <th>Ресурс</th>
                <th>Дата ввода</th>
              </tr>
            </thead>
            <tbody>
              ${devices.map(device => `
                <tr>
                  <td>${device.name}</td>
                  <td>${device.status}</td>
                  <td>${device.residualResource}%</td>
                  <td>${device.startDate}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;
    
    return html;
  };