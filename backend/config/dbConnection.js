import pkg from '@prisma/client';
const { PrismaClient } = pkg;

let prisma;

if(process.env.NODE_ENV === "production"){
    prisma = new prismaClient()
}else{
    if(!global.prisma){
        global.prisma = new PrismaClient()
    }
    prisma = global.prisma
}

export default prisma;