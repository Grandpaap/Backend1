const express = require('express');
const apiRouter = express.Router();
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const { JWT_SECRET } = process.env;

// Set `req.user` if possible

apiRouter.use(async (req, res, next) => {
  const prefix = 'Bearer ';
  const auth = req.header('Authorization');

  if (!auth) {
    next();
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);

    try {
      const { id } = jwt.verify(token, JWT_SECRET);

      if (id) {
        const user = await prisma.user.findUnique({
          where: {
            id: parseInt(id),
          },
        });

        if (!user) {
          throw new Error("User not found");
        }

        req.user = user;
        next();
      } else {
        next({
          name: 'AuthorizationHeaderError',
          message: 'Authorization token malformed',
        });
      }
    } catch (error) {
      next(error);
    }
  } else {
    next({
      name: 'AuthorizationHeaderError',
      message: `Authorization token must start with ${prefix}`,
    });
  }
});

apiRouter.use((req, res, next) => {
  if (req.user) {
    console.log('User is set:', req.user);
  }

  next();
});



const groupRouter = require('./group');
apiRouter.use('/group', groupRouter);

const groupMembershipRouter = require('./groupMembership');
apiRouter.use('/groupMembership', groupMembershipRouter);

const groupMessageRouter = require('./groupMessage');
apiRouter.use('/groupMessage', groupMessageRouter);

const messageRouter = require('./message');
apiRouter.use('/message', messageRouter);

const photoRouter = require('./photo');
apiRouter.use('/photo', photoRouter);

const usersRouter = require('./users');
apiRouter.use('/users', usersRouter);

const videoCallRouter = require('./videoCall');
apiRouter.use('/videoCall', videoCallRouter);

apiRouter.use((error, req, res, next) => {
  res.send(error);
});

module.exports = apiRouter;