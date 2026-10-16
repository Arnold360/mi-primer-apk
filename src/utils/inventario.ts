export interface Producto {
  id: string;
  nombre: string;
  precio: number;
  categoria: 'Abarrotes' | 'Librería' | 'Golosinas' | 'Limpieza';
}

export const INVENTARIO_INICIAL: Producto[] = [
  { id: '1', nombre: 'Arroz Extra 1kg', precio: 4.50, categoria: 'Abarrotes' },
  { id: '2', nombre: 'Aceite Vegetal 1L', precio: 7.20, categoria: 'Abarrotes' },
  { id: '3', nombre: 'Cuaderno Loro 100hj', precio: 5.50, categoria: 'Librería' },
  { id: '4', nombre: 'Lapicero Faber-Castell Azul', precio: 1.20, categoria: 'Librería' },
  { id: '5', nombre: 'Gaseosa Coca-Cola 500ml', precio: 2.50, categoria: 'Golosinas' },
  { id: '6', nombre: 'Galletas Inka Korn', precio: 0.80, categoria: 'Golosinas' },
  { id: '7', nombre: 'Detergente Opal 1kg', precio: 8.50, categoria: 'Limpieza' },
  { id: '8', nombre: 'Jabón Líquido Aval 400ml', precio: 6.00, categoria: 'Limpieza' },
];
