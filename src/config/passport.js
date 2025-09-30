const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const config = require("./config");
const { tokenTypes } = require("./tokens");
const { Admin } = require("../models");
const { Employee } = require("../models");

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload, done) => {
  try {
    if (payload.type !== tokenTypes.ACCESS) {
      throw new Error("Invalid token type");
    }
    let user = null;

    console.log("inside posport");
    console.log(payload.sub.role);
    console.log("inside posport " + payload.sub._id);
    if (payload.sub && payload.sub.role === "Admin") {
      user = await Admin.findById(payload.sub._id);
    }
    else if (payload.sub && payload.sub.role === "Employee") {
      user = await Employee.findById(payload.sub._id);
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

module.exports = {
  jwtStrategy,
};
