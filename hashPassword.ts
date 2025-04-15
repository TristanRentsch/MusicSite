import bcrypt from "bcrypt";

const hashPassword = async (password: string) => {
  const hashed = await bcrypt.hash(password, 10);
  console.log("Hashed password:", hashed);
};

const arg = process.argv[2];
hashPassword("arg");
