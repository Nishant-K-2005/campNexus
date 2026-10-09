import prisma from "./config/dbConnection.js";

async function main() {
  try {
    const posts = await prisma.post.findMany({ 
      include: { attachments: true, user: true }, 
      take: 5 
    });
    console.log('Posts count:', posts.length);
    if (posts.length > 0) {
      console.log('First post:', JSON.stringify(posts[0], null, 2));
    }
    const replies = await prisma.reply.findMany({ take: 5 });
    console.log('Replies count:', replies.length);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
