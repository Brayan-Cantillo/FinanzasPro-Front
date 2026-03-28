import * as XLSX from 'xlsx'; // Librería para crear y manipular archivos Excel

/**
 * Exporta un arreglo de datos a un archivo Excel (.xlsx).
 * Recibe un arreglo de objetos (cada objeto es una fila) y el nombre del archivo.
 * Crea una hoja llamada "Datos" y descarga el archivo automáticamente.
 *
 * @param data - Arreglo de objetos donde cada clave es una columna
 * @param fileName - Nombre del archivo sin extensión
 */
export function exportToExcel(data: Record<string, unknown>[], fileName: string) {
  const worksheet = XLSX.utils.json_to_sheet(data);          // Convierte el JSON a una hoja de cálculo
  const workbook = XLSX.utils.book_new();                     // Crea un nuevo libro de Excel
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos'); // Añade la hoja al libro con nombre "Datos"
  XLSX.writeFile(workbook, `${fileName}.xlsx`);               // Descarga el archivo con la extensión .xlsx
}
