import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { PDFDocument, rgb, StandardFonts } from 'npm:pdf-lib'

serve(async (req) => {
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    const resendKey = Deno.env.get('RESEND_API_KEY') ?? ''

    // FILTRO DE PRODUCCIÓN: Envía a todas las empresas que tengan correo registrado
    const { data: empresas, error } = await supabase
      .from('empresa')
      .select('nombre, correo, id_fiscal')
      .not('correo', 'is', null)

    if (error) throw error;
    if (!empresas || empresas.length === 0) {
        return new Response(JSON.stringify({ message: "No hay empresas con correo para enviar facturas." }), { status: 200 })
    }

    // Obtener fecha actual en formato dd/mm/yyyy
    const hoy = new Date();
    const fechaEmision = `${hoy.getDate()}/${hoy.getMonth() + 1}/${hoy.getFullYear()}`;

    for (const emp of empresas) {
      
      // --- CREACIÓN DEL PDF PROFESIONAL ---
      const pdfDoc = await PDFDocument.create()
      // Importar tipografías
      const fontNormal = await pdfDoc.embedFont(StandardFonts.Helvetica)
      const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
      
      // Tamaño A4 estándar
      const page = pdfDoc.addPage([595.28, 841.89]) 
      const { width, height } = page.getSize()
      
      // Paleta de colores
      const colorPrincipal = rgb(0.10, 0.13, 0.20) // Azul oscuro / Gris oscuro
      const colorAcento = rgb(0.23, 0.51, 0.96) // Azul claro
      const colorTexto = rgb(0.3, 0.3, 0.3)
      const colorGrisClaro = rgb(0.93, 0.93, 0.93)
      
      // 1. Cabecera
      page.drawRectangle({ x: 0, y: height - 120, width: width, height: 120, color: colorPrincipal })
      page.drawText('FACTURA', { x: 50, y: height - 55, size: 28, font: fontBold, color: rgb(1, 1, 1) })
      page.drawText('SoftCreate POS', { x: width - 200, y: height - 45, size: 16, font: fontBold, color: rgb(1, 1, 1) })
      page.drawText('NIT: 901000000-0', { x: width - 200, y: height - 62, size: 10, font: fontNormal, color: colorGrisClaro })
      page.drawText('facturacion@softcreatepos.com', { x: width - 200, y: height - 76, size: 10, font: fontNormal, color: colorGrisClaro })
      page.drawText('Pasto, Colombia', { x: width - 200, y: height - 90, size: 10, font: fontNormal, color: colorGrisClaro })

      // 2. Información del Cliente
      page.drawText('FACTURAR A:', { x: 50, y: height - 160, size: 10, font: fontBold, color: colorAcento })
      page.drawText(emp.nombre, { x: 50, y: height - 180, size: 14, font: fontBold, color: colorPrincipal })
      page.drawText(`ID Fiscal / NIT: ${emp.id_fiscal || 'Consumidor Final'}`, { x: 50, y: height - 200, size: 10, font: fontNormal, color: colorTexto })
      
      // 3. Detalles de la Factura
      page.drawText('DETALLES:', { x: 380, y: height - 160, size: 10, font: fontBold, color: colorAcento })
      page.drawText(`Fecha de emisión:`, { x: 380, y: height - 180, size: 10, font: fontNormal, color: colorTexto })
      page.drawText(fechaEmision, { x: 480, y: height - 180, size: 10, font: fontBold, color: colorPrincipal })
      page.drawText(`Fecha límite de pago:`, { x: 380, y: height - 195, size: 10, font: fontNormal, color: colorTexto })
      page.drawText(`Día 1 del mes`, { x: 495, y: height - 195, size: 10, font: fontBold, color: colorPrincipal })

      // 4. Tabla de Conceptos (Encabezado)
      const tableY = height - 260;
      page.drawRectangle({ x: 50, y: tableY, width: width - 100, height: 25, color: colorGrisClaro })
      page.drawText('DESCRIPCIÓN', { x: 60, y: tableY + 8, size: 10, font: fontBold, color: colorPrincipal })
      page.drawText('CANT.', { x: 350, y: tableY + 8, size: 10, font: fontBold, color: colorPrincipal })
      page.drawText('TOTAL', { x: 450, y: tableY + 8, size: 10, font: fontBold, color: colorPrincipal })

      // 5. Tabla de Conceptos (Fila)
      page.drawText('Mensualidad Sistema de Ventas POS', { x: 60, y: tableY - 20, size: 10, font: fontNormal, color: colorTexto })
      page.drawText('1', { x: 360, y: tableY - 20, size: 10, font: fontNormal, color: colorTexto })
      page.drawText('$ 150.000', { x: 450, y: tableY - 20, size: 10, font: fontNormal, color: colorTexto })
      page.drawLine({ start: { x: 50, y: tableY - 35 }, end: { x: width - 50, y: tableY - 35 }, thickness: 1, color: colorGrisClaro })

      // 6. Totales
      page.drawText('TOTAL A PAGAR:', { x: 330, y: tableY - 70, size: 12, font: fontBold, color: colorPrincipal })
      page.drawText('$ 150.000 COP', { x: 440, y: tableY - 70, size: 14, font: fontBold, color: colorAcento })

      // 7. Caja de Instrucciones de Pago
      page.drawRectangle({ x: 50, y: tableY - 170, width: width - 100, height: 70, color: rgb(0.96, 0.98, 1) })
      page.drawText('INSTRUCCIONES DE PAGO', { x: 65, y: tableY - 125, size: 10, font: fontBold, color: colorPrincipal })
      page.drawText('• Nequi: 3116025328', { x: 65, y: tableY - 145, size: 10, font: fontNormal, color: colorTexto })
      page.drawText('• Efectivo: Pago presencial (entrega personal)', { x: 65, y: tableY - 160, size: 10, font: fontNormal, color: colorTexto })

      // 8. Pie de página
      page.drawText('¡Gracias por confiar en SoftCreate POS para impulsar tu negocio!', { x: 50, y: 50, size: 10, font: fontBold, color: rgb(0.6, 0.6, 0.6) })
      
      const pdfBytes = await pdfDoc.save()
      
      let binary = '';
      const bytes = new Uint8Array(pdfBytes);
      for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
      }
      const base64Pdf = btoa(binary);

      // --- DISEÑO DEL CORREO PROFESIONAL (HTML) ---
      const htmlBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
      </head>
      <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f7f9; margin: 0; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
          
          <!-- Cabecera -->
          <div style="background-color: #1a2233; padding: 30px; text-align: center;">
            <img src="https://i.ibb.co/QFwKYnFb/Soft-Create-POSHalloween.png" width="180" alt="SoftCreate POS" style="border-radius: 8px; margin-bottom: 15px;" />
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 500;">Factura de Servicios</h1>
          </div>

          <!-- Cuerpo -->
          <div style="padding: 40px 30px;">
            <p style="color: #333333; font-size: 16px; margin-top: 0;">Hola, <strong>${emp.nombre}</strong>,</p>
            <p style="color: #555555; font-size: 15px; line-height: 1.6;">
              Esperamos que estés teniendo un excelente mes. Adjunto a este correo encontrarás la factura en formato PDF correspondiente a la suscripción de tu sistema de ventas.
            </p>

            <!-- Caja de Resumen -->
            <div style="background-color: #f8fafc; border-left: 4px solid #3b82f6; padding: 20px; border-radius: 4px; margin: 30px 0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding-bottom: 10px; color: #64748b; font-size: 14px;">Total a pagar</td>
                  <td style="padding-bottom: 10px; text-align: right; color: #0f172a; font-size: 18px; font-weight: bold;">$150.000 COP</td>
                </tr>
                <tr>
                  <td style="color: #64748b; font-size: 14px;">Vencimiento</td>
                  <td style="text-align: right; color: #ef4444; font-size: 14px; font-weight: bold;">Día 1 del mes</td>
                </tr>
              </table>
            </div>

            <!-- Instrucciones -->
            <h3 style="color: #1a2233; font-size: 16px; margin-bottom: 15px;">Métodos de pago aceptados:</h3>
            <ul style="color: #555555; font-size: 15px; line-height: 1.6; padding-left: 20px; margin-bottom: 30px;">
              <li style="margin-bottom: 8px;"><strong>Nequi:</strong> 3116025328</li>
              <li><strong>Efectivo:</strong> Pago presencial (entrega personal)</li>
            </ul>

            <p style="color: #555555; font-size: 15px; line-height: 1.6; margin-bottom: 0;">
              Para cualquier duda o soporte técnico, puedes responder directamente a este mensaje.
            </p>
          </div>

          <!-- Pie de página -->
          <div style="background-color: #f1f5f9; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; font-size: 13px; margin: 0;">
              <strong>SoftCreate POS</strong><br>
              Tecnología para hacer crecer tu negocio.<br>
              Pasto, Colombia.
            </p>
          </div>
        </div>
      </body>
      </html>
      `;

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'Facturación SoftCreate <facturacion@softcreatepos.com>',
          to: emp.correo,
          subject: 'Tu factura mensual de SoftCreate POS',
          html: htmlBody,
          attachments: [{
            filename: `Factura_${emp.nombre.replace(/\s+/g, '_')}.pdf`,
            content: base64Pdf
          }]
        })
      })

      if (!res.ok) {
          console.error(`Error enviando correo a ${emp.correo}:`, await res.text());
      }
    }

    return new Response(JSON.stringify({ message: "Facturación enviada con éxito a todas las empresas." }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    })

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    })
  }
})