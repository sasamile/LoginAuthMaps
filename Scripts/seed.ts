import { PrismaClient } from "@prisma/client"; // Cambiado a import
import bcrypt from "bcryptjs";

const database = new PrismaClient();

const superuser = {
  email: "admin@admin.com",
  password: "admin1234",
  name: "Super User",
  apellido: "User Superadmin",
};

async function user() {
  try {
    const passwordHas = await bcrypt.hash(superuser.password, 10);

    await database.user.create({
      data: {
        email: superuser.email,
        password: passwordHas,
        apellido: superuser.apellido,
        name: superuser.name, // Cambiado a superuser.name
        role: "SUPERUSER",
      },
    });
    console.log("User created");
  } catch (error) {
    console.log("Error seeding the database:", error);
  } finally {
    await database.$disconnect();
  }
}

user();
