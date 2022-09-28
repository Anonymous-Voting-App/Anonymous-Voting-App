import prisma from '../utils/prismaHandler';

run();

async function run() {
    var user = await prisma.user.create({
        data: {
            name: 'name',

            email: 'asdf',

            password: 'password'
        }
    });

    var poll = await prisma.poll.create({
        data: {
            name: 'name',

            adminLink: 'adminLink',

            pollLink: 'pollLink',

            resultLink: '',

            creatorId: user.id
        }
    });

    var type = await prisma.type.create({
        data: {
            type: 'test'
        }
    });

    await prisma.question.create({
        data: {
            pollId: poll.id,

            typeId: type.id
        }
    });
}
