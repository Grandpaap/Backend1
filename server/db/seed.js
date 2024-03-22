const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
async function seed() {
  console.log("Seeding the database.");
  try {
    await prisma.user.deleteMany({});
    await prisma.group.deleteMany({});
    await prisma.groupMembership.deleteMany({});
    await prisma.groupMessage.deleteMany({});
    await prisma.message.deleteMany({});
    await prisma.photo.deleteMany({});

    // Define user data
    const users = [
      {
        email: "user0@gmail.com",
        name: "Great Grandpa Joe",
        password: "12345",
      },
      { email: "user1@gmail.com", name: "Uncle Bob", password: "12345" },
      { email: "user2@gmail.com", name: "Uncle Jim", password: "12345" },
      { email: "user3@gmail.com", name: "Grandpa Larry", password: "12345" },
      { email: "user4@gmail.com", name: "Grandma Betty", password: "12345" },
      { email: "user5@gmail.com", name: "Aunt Ethel", password: "12345" },
    ];

    const hashedUsers = await Promise.all(
      users.map(async (user) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        return {
          ...user,
          password: hashedPassword,
        };
      })
    );

    // Define group data
    const groups = [{ name: "Smith Family" }];

    const photos = [
      {
        title: "Uncles dog",
        userId: 1,
        groupId: 1,
        photoURL:
          "https://th.bing.com/th/id/OIP.akBzkr5VpB3cP-MXpiCq0wHaE8?w=356&h=194&c=7&r=0&o=5&pid=1.7",
      },
      {
        title: "Grandpas doggo",
        userId: 1,
        groupId: 1,
        photoURL:
          "https://th.bing.com/th/id/OIP.cyNgyuW75lwpn1GtbVPgIQHaE8?w=291&h=194&c=7&r=0&o=5&pid=1.7",
      },
      {
        title: "New Puppy!",
        userId: 2,
        groupId: 1,
        photoURL:
          "https://th.bing.com/th/id/OIP.QKhVlcRy8f416B-ompd4-wHaFj?w=313&h=188&c=7&r=0&o=5&pid=1.7",
      },
      {
        title: "Anyone know the breed?",
        userId: 3,
        groupId: 1,
        photoURL:
          "https://th.bing.com/th/id/OIP.1T6ClZDWaEJVs995LlahpQHaE5?w=266&h=180&c=7&r=0&o=5&pid=1.7",
      },
      {
        title: "This guy got big",
        userId: 3,
        groupId: 1,
        photoURL:
          "https://th.bing.com/th/id/OIP.WOftfV88vRQoG7-IFrJw_QHaFj?w=251&h=188&c=7&r=0&o=5&pid=1.7",
      },
      {
        title: "Fluffy Boy",
        userId: 5,
        groupId: 1,
        photoURL:
          "https://th.bing.com/th/id/OIP.w34jwHfgAdQ0J-cdiLklsQHaF7?w=222&h=180&c=7&r=0&o=5&pid=1.7",
      },
    ];

    const groupMessages = [
      {
        senderId: 3,
        groupId: 1,
        content: "My dog just had puppies take a look!",
      },
      { senderId: 3, groupId: 1, content: "What time is the family reunion?" },
      { senderId: 1, groupId: 1, content: "Your not invited" },
      { senderId: 5, groupId: 1, content: "Hey now Great Grandpa, be nice!" },
      {
        senderId: 4,
        groupId: 1,
        content: "Im only going if there is coleslaw",
      },
      { senderId: 2, groupId: 1, content: "Ill make my famous recipe" },
    ];

    const messages = [
      {
        senderId: 2,
        recipientId: 1,
        content: "Hi Great Grandpa, Hope your retirement is going well!",
      },
      {
        senderId: 3,
        recipientId: 1,
        content: "My dog just had puppies take a look!",
      },
      {
        senderId: 3,
        recipientId: 1,
        content: "Cant wait to see you in October!!!",
      },
      {
        senderId: 3,
        recipientId: 1,
        content: "Did you ever find those car keys",
      },
      {
        senderId: 4,
        recipientId: 1,
        content: "Hey pop, its raining here today",
      },
      { senderId: 1, recipientId: 4, content: "I hate when it rains. grrr" },
      {
        senderId: 5,
        recipientId: 1,
        content: "When are we having dinner again?",
      },
      { senderId: 1, recipientId: 5, content: "Maybe around Memorial Day" },
      {
        senderId: 6,
        recipientId: 1,
        content: "Are you coming to the barbeque this weekend?",
      },
      { senderId: 1, recipientId: 6, content: "No" },
    ];

    // Create users
    const createdUsers = await prisma.user.createMany({
      data: hashedUsers,
    });
    const usersInDatabase = await prisma.user.findMany();
    // Create groups
    const createdGroups = await prisma.group.createMany({
      data: groups,
    });

    console.log("Created users:", usersInDatabase);
    console.log("Created groups:", createdGroups);
    console.log("Users:", users);
    // Define group membership data
    const groupMemberships = usersInDatabase.map((user) => ({
      userId: user.id,
      groupId: 1,
    }));

    // Create group memberships
    const createdGroupMemberships = await prisma.groupMembership.createMany({
      data: groupMemberships,
    });

    const createdPhotos = await prisma.photo.createMany({
      data: photos,
    });

    const createdGroupMessages = await prisma.groupMessage.createMany({
      data: groupMessages,
    });

    const createdMessages = await prisma.message.createMany({
      data: messages,
    });

    console.log("Database is seeded.");
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  seed();
}

module.exports = seed;
