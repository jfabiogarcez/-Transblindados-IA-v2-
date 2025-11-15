interface OrderItem {
  productName: string;
  quantity: number;
  priceAtPurchase: number;
}

interface InvoiceData {
  orderId: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: string;
  items: OrderItem[];
  totalAmount: number;
  orderDate: Date;
}

export function generateInvoiceHTML(data: InvoiceData): string {
  const itemsHTML = data.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${item.productName}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">R$ ${(item.priceAtPurchase / 100).toFixed(2)}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600;">R$ ${((item.priceAtPurchase * item.quantity) / 100).toFixed(2)}</td>
    </tr>
  `
    )
    .join("");

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nota Fiscal - Pedido #${data.orderId}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #5b21b6 0%, #7c3aed 100%); padding: 40px 30px; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; font-family: 'Playfair Display', Georgia, serif;">Allure</h1>
              <p style="margin: 8px 0 0 0; color: #e9d5ff; font-size: 14px;">Elegância e sofisticação em cada peça</p>
            </td>
          </tr>

          <!-- Invoice Title -->
          <tr>
            <td style="padding: 30px 30px 20px 30px;">
              <h2 style="margin: 0; color: #111827; font-size: 24px; font-weight: 600;">Nota Fiscal / Recibo</h2>
              <p style="margin: 8px 0 0 0; color: #6b7280; font-size: 14px;">Pedido #${data.orderId} • ${new Date(data.orderDate).toLocaleDateString('pt-BR')}</p>
            </td>
          </tr>

          <!-- Customer Info -->
          <tr>
            <td style="padding: 0 30px 20px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 15px; background-color: #f9fafb; border-radius: 6px;">
                    <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 12px; text-transform: uppercase; font-weight: 600;">Cliente</p>
                    <p style="margin: 0 0 4px 0; color: #111827; font-size: 16px; font-weight: 600;">${data.customerName}</p>
                    <p style="margin: 0 0 2px 0; color: #4b5563; font-size: 14px;">${data.customerEmail}</p>
                    ${data.customerPhone ? `<p style="margin: 0; color: #4b5563; font-size: 14px;">${data.customerPhone}</p>` : ''}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Shipping Address -->
          <tr>
            <td style="padding: 0 30px 20px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 15px; background-color: #f9fafb; border-radius: 6px;">
                    <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 12px; text-transform: uppercase; font-weight: 600;">Endereço de Entrega</p>
                    <p style="margin: 0; color: #4b5563; font-size: 14px; line-height: 1.6;">${data.shippingAddress.replace(/\n/g, '<br>')}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Items Table -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e5e7eb; border-radius: 6px; overflow: hidden;">
                <thead>
                  <tr style="background-color: #f9fafb;">
                    <th style="padding: 12px; text-align: left; color: #6b7280; font-size: 12px; text-transform: uppercase; font-weight: 600;">Produto</th>
                    <th style="padding: 12px; text-align: center; color: #6b7280; font-size: 12px; text-transform: uppercase; font-weight: 600;">Qtd</th>
                    <th style="padding: 12px; text-align: right; color: #6b7280; font-size: 12px; text-transform: uppercase; font-weight: 600;">Preço Unit.</th>
                    <th style="padding: 12px; text-align: right; color: #6b7280; font-size: 12px; text-transform: uppercase; font-weight: 600;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHTML}
                </tbody>
              </table>
            </td>
          </tr>

          <!-- Total -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 20px; background: linear-gradient(135deg, #5b21b6 0%, #7c3aed 100%); border-radius: 6px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="color: #e9d5ff; font-size: 14px; font-weight: 500;">Total do Pedido</td>
                        <td align="right" style="color: #ffffff; font-size: 28px; font-weight: 700;">R$ ${(data.totalAmount / 100).toFixed(2)}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px; border-top: 1px solid #e5e7eb; background-color: #f9fafb; border-radius: 0 0 8px 8px;">
              <p style="margin: 0 0 8px 0; color: #111827; font-size: 14px; font-weight: 600;">Obrigado pela sua compra!</p>
              <p style="margin: 0; color: #6b7280; font-size: 13px; line-height: 1.6;">
                Este é um recibo eletrônico do seu pedido na Allure. Em caso de dúvidas, entre em contato conosco através do email contato@allure.com.br ou telefone (11) 99999-9999.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

export function generateInvoiceText(data: InvoiceData): string {
  const items = data.items
    .map(
      (item) =>
        `${item.productName} - Qtd: ${item.quantity} × R$ ${(item.priceAtPurchase / 100).toFixed(2)} = R$ ${((item.priceAtPurchase * item.quantity) / 100).toFixed(2)}`
    )
    .join('\n');

  return `
ALLURE - NOTA FISCAL / RECIBO
Pedido #${data.orderId}
Data: ${new Date(data.orderDate).toLocaleDateString('pt-BR')}

CLIENTE:
${data.customerName}
${data.customerEmail}
${data.customerPhone || ''}

ENDEREÇO DE ENTREGA:
${data.shippingAddress}

PRODUTOS:
${items}

TOTAL: R$ ${(data.totalAmount / 100).toFixed(2)}

Obrigado pela sua compra!
Em caso de dúvidas, entre em contato: contato@allure.com.br
  `.trim();
}
