const {
  objectType,
  stringArg,
  intArg,
  floatArg,
  queryType,
  subscriptionField,
} = require("@nexus/schema");
const {
  hashPassword,
  comparePassword,
  signToken,
  getUserId,
  protectExerciseSession,
  protectExerciseInstance,
  verifyAdmin,
  protectExercise,
  protectMessage,
} = require("./utils");

const User = objectType({
  name: "user",
  definition(t) {
    t.model.id();
    t.model.name();
    t.model.email();
    t.model.isAdmin();
  },
});
const AuthPayload = objectType({
  name: "auth",
  definition(t) {
    t.string("token");
    t.field("user", { type: "user" });
  },
});

const Exercise = objectType({
  name: "exercise",
  definition(t) {
    t.model.id();
    t.model.label();
    t.model.name();
  },
});

const ExerciseInstance = objectType({
  name: "exercise_instance",
  definition(t) {
    t.model.id();
    t.model.duration();
    t.model.repetitions();
    t.model.weight();
    t.model.exercise();
    t.model.exercise_session();
  },
});

const ExerciseSession = objectType({
  name: "exercise_session",
  definition(t) {
    t.model.id();
    t.model.note();
    t.model.timestamp();
    t.model.user();
    t.model.exercise_instance();
  },
});

const Message = objectType({
  name: "message",
  definition(t) {
    t.model.id();
    t.model.message();
    t.model.userId();
    t.model.timestamp();
  },
});

const NEW_MSG_SUB_KEY = "NEW_MESSAGE";
const MessageSubscription = subscriptionField("messages", {
  type: Message,
  subscribe: (root, args, ctx, info) => {
    return ctx.pubsub.asyncIterator(NEW_MSG_SUB_KEY);
  },
  resolve: (payload) => payload,
});

const Mutation = objectType({
  name: "Mutation",
  definition(t) {
    // auto-gen deletes
    t.crud.deleteOneexercise({ resolve: protectExercise });
    t.crud.deleteOneexercise_instance({ resolve: protectExerciseInstance });
    t.crud.deleteOneexercise_session({ resolve: protectExerciseSession });
    t.crud.deleteOnemessage({
      resolve: protectMessage,
    });
    // auto-gen updates
    t.crud.updateOneexercise({ resolve: protectExercise });
    t.crud.updateOneexercise_instance({ resolve: protectExerciseInstance });
    t.crud.updateOneexercise_session({
      resolve: protectExerciseSession,
    });
    t.crud.updateOnemessage({
      resolve: protectMessage,
    });

    t.field("signupUser", {
      type: "auth",
      args: {
        email: stringArg(),
        password: stringArg(),
        name: stringArg({ nullable: true }),
      },
      resolve: async (_, { name, email, password }, ctx, _info) => {
        const passwordHashed = await hashPassword(password);
        const user = await ctx.prisma.user.create({
          data: {
            name,
            email,
            password: passwordHashed,
          },
        });
        const token = signToken(user.id);
        return {
          user,
          token,
        };
      },
    });

    t.field("loginUser", {
      type: "auth",
      args: {
        email: stringArg(),
        password: stringArg(),
      },
      resolve: async (_, { email, password }, ctx, _info) => {
        const user = await ctx.prisma.user.findOne({
          where: {
            email,
          },
        });
        if (!user) {
          throw new Error("Invalid auth");
        }
        const isValid = await comparePassword(password, user.password);
        if (!isValid) {
          throw new Error("Invalid auth");
        }
        const token = signToken(user.id);
        return {
          user,
          token,
        };
      },
    });

    t.field("createExercise", {
      type: "exercise",
      args: {
        name: stringArg(),
        label: stringArg({ nullable: true }),
      },
      resolve: async (_, { name, label }, ctx, _info) => {
        await verifyAdmin(ctx);
        return ctx.prisma.exercise.create({
          data: {
            name,
            label,
          },
        });
      },
    });
    t.field("createMessage", {
      type: "message",
      args: {
        message: stringArg(),
      },
      resolve: async (_, { message }, ctx, _info) => {
        const userId = getUserId(ctx);
        const newMsg = await ctx.prisma.message.create({
          data: {
            user: {
              connect: {
                id: userId,
              },
            },
            message,
          },
        });
        ctx.pubsub.publish(NEW_MSG_SUB_KEY, newMsg);
        return newMsg;
      },
    });

    t.field("createExerciseSession", {
      type: "exercise_session",
      args: {
        note: stringArg(),
      },
      resolve: (_, { note }, ctx, _info) => {
        const userId = getUserId(ctx);
        return ctx.prisma.exercise_session.create({
          data: {
            user: {
              connect: {
                id: userId,
              },
            },
            note,
          },
        });
      },
    });

    t.field("createExerciseInstance", {
      type: "exercise_instance",
      args: {
        exerciseId: intArg({ required: true }),
        sessionId: intArg({ required: true }),
        weight: floatArg(),
        duration: floatArg(),
        repetitions: intArg(),
      },
      resolve: (
        _,
        { exerciseId, sessionId, weight, duration, repetitions },
        ctx,
        _info
      ) => {
        return ctx.prisma.exercise_instance.create({
          data: {
            exercise: {
              connect: {
                id: exerciseId,
              },
            },
            exercise_session: {
              connect: {
                id: sessionId,
              },
            },
            weight,
            duration,
            repetitions,
          },
        });
      },
    });
  },
});

const Query = queryType({
  definition(t) {
    t.list.field("users", {
      type: "user",
      resolve: (_, _args, ctx) => {
        return ctx.prisma.user.findMany();
      },
    });

    t.list.field("messages", {
      type: "message",
      resolve: (_, _args, ctx) => {
        return ctx.prisma.message.findMany();
      },
    });

    t.list.field("exercises", {
      type: "exercise",
      resolve: (_, _args, ctx) => {
        return ctx.prisma.exercise.findMany();
      },
    });

    t.list.field("exerciseSessions", {
      type: "exercise_session",
      args: {},
      resolve: (_, _args, ctx) => {
        const userId = getUserId(ctx);
        return ctx.prisma.exercise_session.findMany({
          where: { userId },
        });
      },
    });
    t.list.field("exerciseInstances", {
      type: "exercise_instance",
      args: {
        sessionId: intArg({ required: true }),
      },
      resolve: (_, { sessionId }, ctx) => {
        const userId = getUserId(ctx);

        return ctx.prisma.exercise_instance.findMany({
          where: {
            sessionId,
            exercise_session: {
              userId,
            },
          },
        });
      },
    });
  },
});

module.exports = {
  User,
  AuthPayload,
  Exercise,
  ExerciseSession,
  ExerciseInstance,
  Message,
  MessageSubscription,
  Mutation,
  Query,
};
