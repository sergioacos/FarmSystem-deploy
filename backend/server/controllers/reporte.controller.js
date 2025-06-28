const PDFDocument = require("pdfkit");
const Venta = require("../models/Venta");
const moment = require("moment");

exports.generarReporteVentasPDF = async (req, res) => {
  try {
    const ventas = await Venta.find().populate("productos.producto_id");

    const doc = new PDFDocument({ margin: 40, size: "A4" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=reporte_ventas.pdf`);

    doc.pipe(res);

    // Título y fecha de generación
    doc.fontSize(18).text("Reporte de Ventas - FarmSystem", { align: "center" });
    doc.fontSize(10).text(`Generado el: ${moment().format("DD/MM/YYYY HH:mm")}`, {
      align: "center",
    });
    doc.moveDown(2);

    // Listado de ventas
    ventas.forEach((venta, index) => {
      doc
        .fontSize(14)
        .fillColor("black")
        .text(`Venta #${index + 1}`, { underline: true });

      doc
        .fontSize(12)
        .text(`Fecha: ${moment(venta.fecha_venta).format("DD/MM/YYYY HH:mm")}`)
        .text(`Tipo de pago: ${venta.tipo_pago}`)
        .text(`Total: $${venta.total.toFixed(2)}`)
        .text("Productos:");

      venta.productos.forEach((p) => {
        doc.text(
          `   - ${p.producto_id?.nombre || "Producto eliminado"} x${p.cantidad} @ $${p.precio_unitario}`
        );
      });

      // Línea divisoria
      doc.moveDown();
      doc.strokeColor("#cccccc").lineWidth(1)
        .moveTo(doc.page.margins.left, doc.y)
        .lineTo(doc.page.width - doc.page.margins.right, doc.y)
        .stroke();
      doc.moveDown();
    });

    doc.end();
  } catch (err) {
    console.error("Error al generar reporte PDF:", err);
    res.status(500).json({ message: "Error al generar el PDF" });
  }
};
