import { generateInvoiceHTML, generateInvoiceText } from "./emailTemplate";

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

export async function sendInvoiceEmail(data: InvoiceData): Promise<boolean> {
  try {
    const htmlContent = generateInvoiceHTML(data);
    const textContent = generateInvoiceText(data);

    // Using Gmail MCP server to send email
    const { execSync } = require('child_process');
    
    const emailData = {
      to: data.customerEmail,
      subject: `Allure - Nota Fiscal do Pedido #${data.orderId}`,
      body: textContent,
      html: htmlContent,
    };

    // Call Gmail MCP to send email
    const result = execSync(
      `manus-mcp-cli tool call send_email --server gmail --input '${JSON.stringify(emailData).replace(/'/g, "'\\''")}'`,
      { encoding: 'utf-8', timeout: 30000 }
    );

    console.log('[Email] Invoice sent successfully:', result);
    return true;
  } catch (error) {
    console.error('[Email] Failed to send invoice:', error);
    return false;
  }
}
