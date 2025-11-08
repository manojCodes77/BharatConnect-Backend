import bcrypt from "bcryptjs";

// take a string as an input and return a hashed version
const hashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
};

hashPassword("jaishreeram").then((hashed) => {
    console.log("Hashed password:", hashed);
}).catch((error) => {
    console.error("Error hashing password:", error);
});