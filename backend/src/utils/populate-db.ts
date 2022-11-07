import prisma from './prismaHandler';

run();

async function run() {
    const user = await prisma.user.create({
        data: {
            name: 'name',
            email: 'asdf',
            password: 'password'
        }
    });

    const poll = await prisma.poll.create({
        data: {
            name: 'name',
            adminLink: 'adminLink',
            pollLink: 'pollLink',
            resultLink: '',
            creatorId: user.id
        }
    });

    await prisma.question.create({
        data: {
            pollId: poll.id
        }
    });
}
