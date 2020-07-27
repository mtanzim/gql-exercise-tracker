const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const APP_SECRET = "secret";

const saltRounds = 10;
const hashPassword = (password) =>
  new Promise((resolve, reject) =>
    bcrypt.hash(password, saltRounds, function(err, hash) {
      if (err) {
        reject(err);
      }
      return resolve(hash);
    })
  );

const comparePassword = (password, hash) =>
  new Promise((resolve, reject) =>
    bcrypt.compare(password, hash, function(err, res) {
      if (err) {
        reject(err);
      }
      return resolve(res);
    })
  );

const signToken = (userId) => jwt.sign({ userId }, APP_SECRET);

const getUserId = (ctx) => {
  const Authorization = ctx.request.get("authorization");
  if (Authorization) {
    const token = Authorization.replace("Bearer ", "");
    const { userId } = jwt.verify(token, APP_SECRET);
    return userId;
  }

  throw new Error("Not authenticated");
};

const protectExerciseSession = async (
  root,
  args,
  ctx,
  info,
  originalResolver
) => {
  const sessionId = args.where.id;
  const userId = getUserId(ctx);
  const session = await ctx.prisma.exercise_session.findOne({
    where: { id: sessionId },
  });
  if (userId !== session.userId) {
    throw new Error("Unauthorized");
  }
  const res = await originalResolver(root, args, ctx, info);
  return res;
};

const protectExerciseInstance = async (
  root,
  args,
  ctx,
  info,
  originalResolver
) => {
  const excInstanceId = args.where.id;
  const userId = getUserId(ctx);
  const excInstance = await ctx.prisma.exercise_instance.findOne({
    where: { id: excInstanceId },
    include: { exercise_session: true },
  });
  if (userId !== excInstance.exercise_session.userId) {
    throw new Error("Unauthorized");
  }
  const res = await originalResolver(root, args, ctx, info);
  return res;
};

const verifyAdmin = async (ctx) => {
  const userId = getUserId(ctx);
  const user = await ctx.prisma.user.findOne({
    where: { id: userId },
  });
  if (!user || !user.isAdmin) {
    throw new Error("Unauthorized, not an admin");
  }
};

const protectExercise = async (root, args, ctx, info, originalResolver) => {
  await verifyAdmin(ctx);
  const res = await originalResolver(root, args, ctx, info);
  return res;
};

module.exports = {
  hashPassword,
  comparePassword,
  signToken,
  getUserId,
  protectExerciseSession,
  protectExerciseInstance,
  protectExercise,
  verifyAdmin,
};
