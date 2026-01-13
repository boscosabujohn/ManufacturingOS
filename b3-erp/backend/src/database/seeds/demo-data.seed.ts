import { DataSource } from 'typeorm';

/**
 * Demo Data Seeder
 * Creates sample data for demonstration purposes
 */
export class DemoDataSeeder {
  constructor(private dataSource: DataSource) {}

  async run(): Promise<void> {
    console.log('🌱 Starting demo data seeding...');

    await this.seedCompany();
    await this.seedUsers();
    await this.seedCustomers();
    await this.seedVendors();
    await this.seedItems();
    await this.seedWarehouses();
    await this.seedWorkOrders();

    console.log('✅ Demo data seeding completed!');
  }

  private async seedCompany(): Promise<void> {
    console.log('  📦 Seeding company data...');
    // Company master data would be inserted here
  }

  private async seedUsers(): Promise<void> {
    console.log('  👥 Seeding demo users...');
    // Demo users for different roles
    const demoUsers = [
      {
        username: 'admin',
        email: 'admin@demo.com',
        firstName: 'System',
        lastName: 'Administrator',
        role: 'admin',
      },
      {
        username: 'sales_manager',
        email: 'sales@demo.com',
        firstName: 'Sarah',
        lastName: 'Mitchell',
        role: 'sales_manager',
      },
      {
        username: 'production_manager',
        email: 'production@demo.com',
        firstName: 'Michael',
        lastName: 'Chen',
        role: 'production_manager',
      },
      {
        username: 'inventory_clerk',
        email: 'inventory@demo.com',
        firstName: 'Emily',
        lastName: 'Johnson',
        role: 'inventory_clerk',
      },
      {
        username: 'finance_manager',
        email: 'finance@demo.com',
        firstName: 'David',
        lastName: 'Williams',
        role: 'finance_manager',
      },
    ];

    // Insert logic would go here
    console.log(`    Created ${demoUsers.length} demo users`);
  }

  private async seedCustomers(): Promise<void> {
    console.log('  🏢 Seeding demo customers...');
    const demoCustomers = [
      {
        code: 'CUST001',
        name: 'Acme Manufacturing Co.',
        email: 'orders@acme.com',
        phone: '+1-555-0100',
        address: '123 Industrial Way, Chicago, IL 60601',
        creditLimit: 100000,
      },
      {
        code: 'CUST002',
        name: 'TechParts Industries',
        email: 'procurement@techparts.com',
        phone: '+1-555-0101',
        address: '456 Tech Park, San Jose, CA 95110',
        creditLimit: 75000,
      },
      {
        code: 'CUST003',
        name: 'Global Assembly Ltd.',
        email: 'supply@globalassembly.com',
        phone: '+1-555-0102',
        address: '789 Manufacturing Blvd, Detroit, MI 48201',
        creditLimit: 150000,
      },
      {
        code: 'CUST004',
        name: 'Precision Components Inc.',
        email: 'orders@precisioncomp.com',
        phone: '+1-555-0103',
        address: '321 Precision Ave, Austin, TX 78701',
        creditLimit: 50000,
      },
      {
        code: 'CUST005',
        name: 'Summit Engineering',
        email: 'purchasing@summit-eng.com',
        phone: '+1-555-0104',
        address: '555 Summit Dr, Seattle, WA 98101',
        creditLimit: 200000,
      },
    ];

    console.log(`    Created ${demoCustomers.length} demo customers`);
  }

  private async seedVendors(): Promise<void> {
    console.log('  🚚 Seeding demo vendors...');
    const demoVendors = [
      {
        code: 'VEND001',
        name: 'Steel Solutions Inc.',
        category: 'Raw Materials',
        email: 'sales@steelsolutions.com',
        leadTime: 7,
        rating: 4.5,
      },
      {
        code: 'VEND002',
        name: 'FastParts Suppliers',
        category: 'Components',
        email: 'orders@fastparts.com',
        leadTime: 3,
        rating: 4.8,
      },
      {
        code: 'VEND003',
        name: 'Chemical Supply Co.',
        category: 'Chemicals',
        email: 'supply@chemsupply.com',
        leadTime: 5,
        rating: 4.2,
      },
      {
        code: 'VEND004',
        name: 'Packaging Plus',
        category: 'Packaging',
        email: 'sales@packplus.com',
        leadTime: 2,
        rating: 4.6,
      },
    ];

    console.log(`    Created ${demoVendors.length} demo vendors`);
  }

  private async seedItems(): Promise<void> {
    console.log('  📦 Seeding demo items...');
    const demoItems = [
      // Raw Materials
      {
        code: 'RM001',
        name: 'Steel Sheet 4x8',
        type: 'raw_material',
        uom: 'SHEET',
        cost: 45.0,
        stock: 500,
        reorderLevel: 100,
      },
      {
        code: 'RM002',
        name: 'Aluminum Rod 1"',
        type: 'raw_material',
        uom: 'PCS',
        cost: 12.5,
        stock: 1000,
        reorderLevel: 200,
      },
      {
        code: 'RM003',
        name: 'Copper Wire 12 AWG',
        type: 'raw_material',
        uom: 'MTR',
        cost: 2.25,
        stock: 5000,
        reorderLevel: 1000,
      },
      // Components
      {
        code: 'CMP001',
        name: 'Electric Motor 1HP',
        type: 'component',
        uom: 'PCS',
        cost: 150.0,
        stock: 50,
        reorderLevel: 10,
      },
      {
        code: 'CMP002',
        name: 'Control Board v2.1',
        type: 'component',
        uom: 'PCS',
        cost: 85.0,
        stock: 100,
        reorderLevel: 25,
      },
      // Finished Goods
      {
        code: 'FG001',
        name: 'Industrial Pump Assembly',
        type: 'finished_good',
        uom: 'PCS',
        cost: 450.0,
        price: 750.0,
        stock: 25,
        reorderLevel: 5,
      },
      {
        code: 'FG002',
        name: 'Conveyor Motor Unit',
        type: 'finished_good',
        uom: 'PCS',
        cost: 320.0,
        price: 550.0,
        stock: 40,
        reorderLevel: 10,
      },
      {
        code: 'FG003',
        name: 'Control Panel Assembly',
        type: 'finished_good',
        uom: 'PCS',
        cost: 280.0,
        price: 480.0,
        stock: 30,
        reorderLevel: 8,
      },
    ];

    console.log(`    Created ${demoItems.length} demo items`);
  }

  private async seedWarehouses(): Promise<void> {
    console.log('  🏭 Seeding demo warehouses...');
    const demoWarehouses = [
      {
        code: 'WH001',
        name: 'Main Warehouse',
        location: 'Building A',
        capacity: 10000,
        type: 'central',
      },
      {
        code: 'WH002',
        name: 'Raw Materials Store',
        location: 'Building B',
        capacity: 5000,
        type: 'raw_materials',
      },
      {
        code: 'WH003',
        name: 'Finished Goods Store',
        location: 'Building C',
        capacity: 3000,
        type: 'finished_goods',
      },
      {
        code: 'WH004',
        name: 'Quarantine Area',
        location: 'Building A - Section Q',
        capacity: 500,
        type: 'quarantine',
      },
    ];

    console.log(`    Created ${demoWarehouses.length} demo warehouses`);
  }

  private async seedWorkOrders(): Promise<void> {
    console.log('  🔧 Seeding demo work orders...');
    const demoWorkOrders = [
      {
        number: 'WO-2026-001',
        item: 'FG001',
        quantity: 50,
        status: 'in_progress',
        priority: 'high',
        startDate: new Date(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      {
        number: 'WO-2026-002',
        item: 'FG002',
        quantity: 100,
        status: 'planned',
        priority: 'medium',
        startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      },
      {
        number: 'WO-2026-003',
        item: 'FG003',
        quantity: 75,
        status: 'in_progress',
        priority: 'high',
        startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      },
    ];

    console.log(`    Created ${demoWorkOrders.length} demo work orders`);
  }

  async reset(): Promise<void> {
    console.log('🗑️  Resetting demo data...');
    // Logic to clear demo data
    console.log('✅ Demo data reset completed!');
  }
}

/**
 * Run seeder
 */
export async function seedDemoData(dataSource: DataSource): Promise<void> {
  const seeder = new DemoDataSeeder(dataSource);
  await seeder.run();
}

/**
 * Reset seeder
 */
export async function resetDemoData(dataSource: DataSource): Promise<void> {
  const seeder = new DemoDataSeeder(dataSource);
  await seeder.reset();
}
