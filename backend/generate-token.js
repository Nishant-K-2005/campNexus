import jwt from "jsonwebtoken";
const JWT_SECRET = 'aab5adc141dc4d86083762c381cf1ca07897def1427a1bc8f3a5817d26b53238';
const userId = 'c0279d49-d8f5-4644-8d93-334cda961016';
const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '15d' });
console.log("SURBHI_TOKEN:", token);
