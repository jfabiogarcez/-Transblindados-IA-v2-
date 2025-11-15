import { drizzle } from "drizzle-orm/mysql2";
import { products } from "./drizzle/schema.js";

const db = drizzle(process.env.DATABASE_URL);

const sampleProducts = [
  {
    name: "Vestido Longo Elegante",
    description: "Vestido longo em tecido fluido, perfeito para ocasiões especiais. Corte moderno e sofisticado.",
    price: 29900, // R$ 299.00
    imageUrl: "/images/product-sample.jpg",
    category: "Vestidos",
    stock: 15,
    isActive: 1,
  },
  {
    name: "Blazer Alfaiataria Premium",
    description: "Blazer em alfaiataria impecável, ideal para o ambiente corporativo ou eventos formais.",
    price: 39900, // R$ 399.00
    imageUrl: "/images/product-sample.jpg",
    category: "Blazers",
    stock: 10,
    isActive: 1,
  },
  {
    name: "Calça Pantalona Clássica",
    description: "Calça pantalona de caimento perfeito, versátil e confortável para o dia a dia.",
    price: 19900, // R$ 199.00
    imageUrl: "/images/product-sample.jpg",
    category: "Calças",
    stock: 20,
    isActive: 1,
  },
  {
    name: "Blusa de Seda Delicada",
    description: "Blusa em seda pura com acabamento refinado. Elegância e conforto em uma única peça.",
    price: 24900, // R$ 249.00
    imageUrl: "/images/product-sample.jpg",
    category: "Blusas",
    stock: 12,
    isActive: 1,
  },
  {
    name: "Saia Midi Plissada",
    description: "Saia midi com plissado delicado, perfeita para criar looks sofisticados.",
    price: 17900, // R$ 179.00
    imageUrl: "/images/product-sample.jpg",
    category: "Saias",
    stock: 18,
    isActive: 1,
  },
  {
    name: "Conjunto Social Completo",
    description: "Conjunto composto por blazer e calça em tecido premium. Elegância garantida.",
    price: 54900, // R$ 549.00
    imageUrl: "/images/product-sample.jpg",
    category: "Conjuntos",
    stock: 8,
    isActive: 1,
  },
  {
    name: "Vestido Tubinho Executivo",
    description: "Vestido tubinho com corte impecável, ideal para o ambiente corporativo.",
    price: 27900, // R$ 279.00
    imageUrl: "/images/product-sample.jpg",
    category: "Vestidos",
    stock: 14,
    isActive: 1,
  },
  {
    name: "Casaco Trench Coat",
    description: "Trench coat clássico em tecido impermeável. Estilo atemporal e funcional.",
    price: 49900, // R$ 499.00
    imageUrl: "/images/product-sample.jpg",
    category: "Casacos",
    stock: 6,
    isActive: 1,
  },
];

async function seed() {
  console.log("🌱 Populando banco de dados com produtos...");
  
  try {
    for (const product of sampleProducts) {
      await db.insert(products).values(product);
      console.log(`✓ Produto adicionado: ${product.name}`);
    }
    
    console.log("\n✅ Banco de dados populado com sucesso!");
    console.log(`📦 ${sampleProducts.length} produtos adicionados`);
  } catch (error) {
    console.error("❌ Erro ao popular banco de dados:", error);
    process.exit(1);
  }
  
  process.exit(0);
}

seed();
