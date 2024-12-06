const {
  commonMessages,
  verifyToken,
  commonQuery,
  QUERY,
} = require("../helper/helper");
const { findOne } = QUERY;
const { StatusCodes } = require("http-status-codes");
const { BAD_REQUEST, UNAUTHORIZED } = StatusCodes;

// Models
const userModel = require("../models/users.model");
const adminModel = require("../models/admin.model");

const authentication = {
  auth: async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      console.log(token,"hvhyjvhjv");
      
      if (token) {
        const { data } = await verifyToken(token);
        if (data) {
          if (data.type.toLowerCase() === "user") {
            const findUsers = await commonQuery(userModel, findOne, {
              _id: data.userId,
            });
            if (findUsers.status === 1 && findUsers.data.token !== "") {
              req.user = findUsers.data;
              req.user.id = data.userId;
              next();
            } else {
              res
                .status(UNAUTHORIZED)
                .json({ status: 0, message: commonMessages.NOT_AUTHORIZED });
            }
          } else if (data.type.toLowerCase() === "admin") {
            const findAdmin = await commonQuery(adminModel, findOne, {
              _id: data.userId,
            });
            if (findAdmin.status === 1) {
              req.user = findAdmin.data;
              req.user.id = data.userId;
              next();
            } else {
              res
                .status(UNAUTHORIZED)
                .json({ status: 0, message: commonMessages.NOT_AUTHORIZED });
            }
          } else {
            res
              .status(UNAUTHORIZED)
              .json({ status: 0, message: commonMessages.NOT_AUTHORIZED });
          }
        } else {
          res
            .status(UNAUTHORIZED)
            .json({ status: 0, message: commonMessages.NOT_AUTHORIZED });
        }
      } else {
        res
          .status(UNAUTHORIZED)
          .json({ status: 0, message: commonMessages.NOT_AUTHORIZED });
      }
    } catch (error) {
      console.log(error, "====>>>> auth-error");
      res
        .status(UNAUTHORIZED)
        .json({ status: 0, message: commonMessages.NOT_AUTHORIZED });
    }
  },
  guestTokenAuth: async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (token) {
        if (data.type.toLowerCase() === "guestUser") {
          const findUsers = await commonQuery(userModel, findOne, {
            _id: data.userId,
          });
          if (findUsers.status === 1) {
            req.user = findUsers.data;
            req.user.id = data.userId;
            next();
          } else {
            res
              .status(UNAUTHORIZED)
              .json({ status: 0, message: commonMessages.NOT_AUTHORIZED });
          }
        } else {
          res
            .status(UNAUTHORIZED)
            .json({ status: 0, message: commonMessages.NOT_AUTHORIZED });
        }
      } else {
        res
          .status(UNAUTHORIZED)
          .json({ status: 0, message: commonMessages.NOT_AUTHORIZED });
      }
    } catch (error) {
      res
        .status(UNAUTHORIZED)
        .json({ status: 0, message: commonMessages.NOT_AUTHORIZED });
    }
  },
  commonAuth: async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      console.log(token, "=============== token =============");
      if (token) {
        const { data } = await verifyToken(token);

        console.log(data, "=============== data =============");

        if (data.type.toLowerCase() === "guestuser" || data.type.toLowerCase() === "user") {
          const findUsers = await commonQuery(userModel, findOne, {
            _id: data.userId,
          });
          console.log(findUsers, "============== findUsers ==========");

          if (findUsers.status === 1) {
            req.user = findUsers.data;
            req.user.id = data.userId;
            next();
          } else {
            res
              .status(UNAUTHORIZED)
              .json({ status: 0, message: commonMessages.NOT_AUTHORIZED });
          }
        } else {
          res
            .status(UNAUTHORIZED)
            .json({ status: 0, message: commonMessages.NOT_AUTHORIZED });
        }
      } else {
        res
          .status(UNAUTHORIZED)
          .json({ status: 0, message: commonMessages.NOT_AUTHORIZED });
      }
    } catch (error) {
      res
        .status(UNAUTHORIZED)
        .json({ status: 0, message: commonMessages.NOT_AUTHORIZED });
    }
  },
  guestTokenAuth: async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (token) {
        if (data.type.toLowerCase() === "guestUser") {
          const findUsers = await commonQuery(userModel, findOne, {
            _id: data.userId,
          });
          if (findUsers.status === 1) {
            req.user = findUsers.data;
            req.user.id = data.userId;
            next();
          } else {
            res
              .status(UNAUTHORIZED)
              .json({ status: 0, message: commonMessages.NOT_AUTHORIZED });
          }
        } else {
          res
            .status(UNAUTHORIZED)
            .json({ status: 0, message: commonMessages.NOT_AUTHORIZED });
        }
      } else {
        res
          .status(UNAUTHORIZED)
          .json({ status: 0, message: commonMessages.NOT_AUTHORIZED });
      }
    } catch (error) {
      res
        .status(UNAUTHORIZED)
        .json({ status: 0, message: commonMessages.NOT_AUTHORIZED });
    }
  },
};

module.exports = authentication;
