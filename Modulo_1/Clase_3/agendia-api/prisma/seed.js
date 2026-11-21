import prisma from '../src/lib/prisma.js';

const servicios = [
  { nombre: 'Baño completo', duracionMin: 60, precio: 45000 },
  { nombre: 'Corte de raza', duracionMin: 90, precio: 65000 },
  { nombre: 'Spa relajante', duracionMin: 120, precio: 85000 },
  { nombre: 'Corte de uñas', duracionMin: 20, precio: 15000 },
];

const cantidad = await prisma.servicio.count();

if (cantidad === 0) {
  await prisma.servicio.createMany({ data: servicios });
  console.log(`Catálogo creado: ${servicios.length} servicios`);
} else {
  console.log(`El catálogo ya tiene ${cantidad} servicios: no se cambió nada`);
}

await prisma.$disconnect();