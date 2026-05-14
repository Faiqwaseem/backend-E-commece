const asyncHandler = (fn) => {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = asyncHandler;

// asyncHandler Express me async/await errors ko automatically catch karke next(error) me bhejta hai taake centralized error handling ho sake.
