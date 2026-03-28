// Interfaz que define la estructura de un ítem de datos para los gráficos de pastel (PieChart)
export interface ChartDataItem {
  name: string;   // Nombre de la categoría o etiqueta que se muestra en el gráfico
  value: number;  // Valor numérico que determina el tamaño del segmento
  color: string;  // Color hexadecimal asignado al segmento del gráfico
}
