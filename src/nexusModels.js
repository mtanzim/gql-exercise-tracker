const { objectType, mutationType, stringArg, intArg, floatArg } = require("@nexus/schema");

const User = objectType({
  name: "user",
  definition(t) {
    t.model.id();
    t.model.name();
    t.model.email();
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

// // auto-gen CRUD
// const AutoCrud = mutationType({
//   definition(t) {
//   },
// })


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
const Mutation = objectType({
  name: "Mutation",
  definition(t) {
    // auto-gen deletes
    t.crud.deleteOneuser({})
    t.crud.deleteOneexercise({})
    t.crud.deleteOneexercise_instance({})
    t.crud.deleteOneexercise_session({})    
    // auto-gen updates
    t.crud.updateOneuser({})
    t.crud.updateOneexercise({})
    t.crud.updateOneexercise_instance({})
    t.crud.updateOneexercise_session({})


    t.field("signupUser", {
      type: "user",
      args: {
        email: stringArg(),
        name: stringArg({ nullable: true }),
      },
      resolve: (_, { name, email }, ctx, _info) => {
        return ctx.prisma.user.create({
          data: {
            name,
            email,
          },
        });
      },
    });
    t.field("createExercise", {
      type: "exercise",
      args: {
        name: stringArg(),
        label: stringArg({ nullable: true }),
      },
      resolve: (_, { name, label }, ctx, _info) => {
        return ctx.prisma.exercise.create({
          data: {
            name,
            label,
          },
        });
      },
    });
    t.field("createExerciseSession", {
      type: "exercise_session",
      args: {
        userId: intArg({ required: true }),
        note: stringArg(),
      },
      resolve: (_, { userId, note }, ctx, _info) => {
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

const Query = objectType({
  name: "Query",
  definition(t) {
    t.list.field("users", {
      type: "user",
      resolve: (_, _args, ctx) => {
        return ctx.prisma.user.findMany();
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
      resolve: (_, _args, ctx) => {
        return ctx.prisma.exercise_session.findMany();
      },
    });    
    t.list.field("exerciseInstances", {
      type: "exercise_instance",
      resolve: (_, _args, ctx) => {
        return ctx.prisma.exercise_instance.findMany();
      },
    });
  },
});


module.exports = {
  User,
  Exercise,
  ExerciseSession,
  ExerciseInstance,
  Mutation,
  Query,
};
