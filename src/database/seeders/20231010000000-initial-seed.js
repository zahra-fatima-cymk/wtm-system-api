'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    const driverPassword = await bcrypt.hash('Driver@123', 10);
    const userPassword = await bcrypt.hash('User@123', 10);

    const users = await queryInterface.bulkInsert(
      'users',
      [
        {
          type: 'admin',
          email: 'admin@wtm.com',
          phone: '+966500000001',
          first_name: 'System',
          last_name: 'Admin',
          password_hash: hashedPassword,
          status: 'active',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          type: 'driver',
          email: 'driver1@wtm.com',
          phone: '+966500000002',
          first_name: 'Ahmed',
          last_name: 'Driver',
          password_hash: driverPassword,
          status: 'active',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          type: 'user',
          email: 'user1@wtm.com',
          phone: '+966500000003',
          first_name: 'Mohammed',
          last_name: 'Customer',
          password_hash: userPassword,
          status: 'active',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      { returning: true },
    );

    const allUsers = await queryInterface.sequelize.query(`SELECT id, type FROM users;`);
    const adminUser = allUsers[0].find((u) => u.type === 'admin');
    const driverUser = allUsers[0].find((u) => u.type === 'driver');

    await queryInterface.bulkInsert('drivers', [
      {
        user_id: driverUser.id,
        license_number: 'DL123456789',
        license_expiry: '2025-12-31',
        vehicle_type: 'Truck',
        vehicle_plate: 'ABC 1234',
        availability_status: 'available',
        verification_status: 'verified',
        created_at: new Date(),
        updated_at: new Date(),
        created_by: adminUser.id,
      },
    ]);

    await queryInterface.bulkInsert('services', [
      {
        name: 'Standard Delivery',
        description: 'Water tank delivery and installation at customer location',
        service_type: 'delivery',
        price: 150.0,
        estimated_duration: 45,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
        created_by: adminUser.id,
      },
      {
        name: 'Tank Cleaning',
        description: 'Professional water tank cleaning and sanitization service',
        service_type: 'cleaning',
        price: 250.0,
        estimated_duration: 60,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
        created_by: adminUser.id,
      },
      {
        name: 'Regular Maintenance',
        description: 'Regular inspection, checking, and preventive maintenance',
        service_type: 'maintenance',
        price: 100.0,
        estimated_duration: 30,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
        created_by: adminUser.id,
      },
      {
        name: 'Emergency Repair',
        description: 'Emergency water tank services (24/7 availability)',
        service_type: 'emergency',
        price: 500.0,
        estimated_duration: 40,
        is_active: true,
        is_emergency: true,
        created_at: new Date(),
        updated_at: new Date(),
        created_by: adminUser.id,
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('services', null, {});
    await queryInterface.bulkDelete('drivers', null, {});
    await queryInterface.bulkDelete('users', null, {});
  },
};
