export function calcularDescuento(fechaCaducidad) {
  const hoy = new Date();
  const fechaVencimiento = new Date(fechaCaducidad); // convertir a Date por si viene como string
  const diffTime = fechaVencimiento - hoy;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // días hasta el vencimiento

  if (diffDays <= 7) {
    return 25;
  } else if (diffDays <= 14) {
    return 20;
  } else if (diffDays <= 30) {
    return 10;
  }
  return 0;
}