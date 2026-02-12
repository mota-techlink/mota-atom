// 简单的 HTML 邮件模板，避免 React Email 库的渲染问题

export function getPaymentMethodAddedEmailHtml(customerName: string, last4: string = "••••"): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #020617; font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen-Sans,Ubuntu,Cantarell,'Helvetica Neue',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #020617;">
    <tr>
      <td align="center" style="padding: 20px;">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width: 560px;">
          <!-- Logo Section -->
          <tr>
            <td align="center" style="padding: 20px 0;">
              <img src="https://atom.motaiot.com/logos/mota-techlink-logo-v2.webp" width="160" alt="Mota Techlink" style="max-width: 100%; height: auto;">
            </td>
          </tr>
          
          <!-- Content Section -->
          <tr>
            <td style="padding: 24px; background-color: #0f172a; border-radius: 12px; border: 1px solid #1e293b;">
              <h1 style="font-size: 24px; font-weight: bold; color: #f8fafc; margin: 0 0 20px; text-align: center;">Payment Method Added</h1>
              
              <p style="font-size: 16px; line-height: 26px; color: #cbd5e1; margin: 0 0 16px;">Hi ${escapeHtml(customerName)},</p>
              
              <p style="font-size: 16px; line-height: 26px; color: #cbd5e1; margin: 0 0 16px;">You have successfully added a new payment method (ending in ${escapeHtml(last4)}) to your account. This card can now be used for faster checkouts.</p>
              
              <div style="text-align: center; margin: 32px 0;">
                <a href="https://atom.motaiot.com/dashboard/settings" style="background-color: #2563eb; border-radius: 6px; color: #fff; font-size: 16px; font-weight: bold; text-decoration: none; padding: 12px 24px; display: inline-block;">Manage Payment Methods</a>
              </div>
              
              <p style="font-size: 16px; line-height: 26px; color: #cbd5e1; margin: 0;">If you did not authorize this action, please contact our support team immediately.</p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="border-top: 1px solid #334155; padding-top: 20px; padding-bottom: 20px; text-align: center;">
              <p style="color: #64748b; font-size: 12px; margin: 0;">© 2026 MOTA TECHLINK. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export function getOrderConfirmationEmailHtml(
  customerName: string,
  orderNumber: string,
  productName: string,
  amount: string,
  date: string
): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #020617; font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen-Sans,Ubuntu,Cantarell,'Helvetica Neue',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #020617;">
    <tr>
      <td align="center" style="padding: 20px;">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width: 560px;">
          <!-- Logo Section -->
          <tr>
            <td align="center" style="padding: 20px 0;">
              <img src="https://atom.motaiot.com/logos/mota-techlink-logo-v2.webp" width="160" alt="Mota" style="max-width: 100%; height: auto;">
            </td>
          </tr>
          
          <!-- Content Section -->
          <tr>
            <td style="padding: 24px; background-color: #0f172a; border-radius: 12px; border: 1px solid #1e293b;">
              <div style="background-color: #16a34a; color: #fff; padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: bold; display: inline-block; margin-bottom: 16px;">PAYMENT SUCCESSFUL</div>
              
              <h1 style="font-size: 24px; font-weight: bold; color: #f8fafc; margin: 0 0 20px;">Thank you for your order!</h1>
              
              <p style="font-size: 16px; line-height: 26px; color: #cbd5e1; margin: 0 0 20px;">Hi ${escapeHtml(customerName)}, we are getting your order ready.</p>
              
              <!-- Order Details Card -->
              <div style="background-color: #1e293b; padding: 20px; border-radius: 8px; margin-top: 20px; margin-bottom: 32px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="color: #94a3b8; font-size: 14px; padding: 4px 0;">Order Number</td>
                    <td align="right" style="color: #f8fafc; font-size: 14px; font-weight: bold; padding: 4px 0;">${escapeHtml(orderNumber)}</td>
                  </tr>
                  <tr>
                    <td style="color: #94a3b8; font-size: 14px; padding: 4px 0;">Product</td>
                    <td align="right" style="color: #f8fafc; font-size: 14px; font-weight: bold; padding: 4px 0;">${escapeHtml(productName)}</td>
                  </tr>
                  <tr>
                    <td style="color: #94a3b8; font-size: 14px; padding: 4px 0;">Date</td>
                    <td align="right" style="color: #f8fafc; font-size: 14px; font-weight: bold; padding: 4px 0;">${escapeHtml(date)}</td>
                  </tr>
                  <tr>
                    <td colspan="2" style="border-top: 1px solid #334155; margin: 10px 0; padding: 10px 0;"></td>
                  </tr>
                  <tr>
                    <td style="color: #cbd5e1; font-size: 16px; font-weight: bold;">Total</td>
                    <td align="right" style="color: #3b82f6; font-size: 20px; font-weight: bold;">${escapeHtml(amount)}</td>
                  </tr>
                </table>
              </div>
              
              <div style="text-align: center;">
                <a href="https://atom.motaiot.com/dashboard/orders" style="background-color: #2563eb; border-radius: 6px; color: #fff; font-size: 16px; font-weight: bold; text-decoration: none; padding: 12px 24px; display: inline-block;">Track Order</a>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="border-top: 1px solid #334155; padding-top: 20px; padding-bottom: 20px; text-align: center;">
              <p style="color: #64748b; font-size: 12px; margin: 0;">© 2026 MOTA TECHLINK</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

// 简单的 HTML 转义函数
function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}
