const { StatusCodes } = require("http-status-codes");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const {
  QUERY,
  commonMessages,
  commonQuery,
  generateToken,
  checkBcryptPassword,
  createBcryptPassword,
} = require("../../helper/helper");

const { OK, INTERNAL_SERVER_ERROR, BAD_REQUEST } = StatusCodes;
const { findOne, create, findOneAndUpdate, find, upsert, countDocuments } = QUERY;

// config
const { IMAGE_URL } = require("../../config");

// MODELS
const userModel = require("../../models/users.model");
const carDetailsModel = require("../../models/carditails.model");
const followerModel = require("../../models/followers.model");
const followingModel = require("../../models/following.model");
const postModel = require("../../models/post.model");
const organizationListModel = require("../../models/organizationList.model");


module.exports = {
  // AUTHENTICATION SECTION
  register: async (req, res) => {
    try {
      let { firsName, lastName, email, phoneNumber, code, password, fcmToken } = req.body;
      // if (phoneNumber.length !== 10) {
      //   return res
      //     .status(BAD_REQUEST)
      //     .json({ status: 0, message: 'Phone number must be 10 digit' });
      // }
      const existUser = await commonQuery(userModel, findOne, { mobile: phoneNumber, isOtpVerified: true });
      console.log(existUser, "============== existUser.data.isOtpVerified ==============");

      if (existUser.status == 1) {
        res
          .status(BAD_REQUEST)
          .json({ status: 0, message: commonMessages.ALREADY_EXISTS("Phone number") });
      } else {
        const bcryptPassword = await createBcryptPassword(password);
        const userData = { firstName: firsName, lastName, email, mobile: phoneNumber, code, otp: 111111, password: bcryptPassword, location: {}, fcmToken };
        const newUser = await commonQuery(userModel, upsert, { mobile: phoneNumber }, userData);
        if (newUser.status == 1) {
          const { token } = await generateToken({
            userId: newUser.data._id,
            // type: "guestUser",
            type: "user",
          });
          res.status(OK).json({
            status: 1,
            message: 'User signed up successfully',
            token,
            userData
          })
        } else {
          res.status(BAD_REQUEST).json({ status: 0, message: newUser.message });
        }
      }
    } catch (error) {
      console.log("/users/sign-up ====>>>> ", error);
      res
        .status(INTERNAL_SERVER_ERROR)
        .json({ status: 0, message: commonMessages.INTERNAL_SERVER_ERROR });
    }
  },
  signIn: async (req, res) => {
    try {
      const { code, phoneNumber, password, fcmToken } = req.body;
      const existUser = await commonQuery(
        userModel,
        findOne,
        { mobile: phoneNumber },
        {},
        " -createdAt -updatedAt -token"
      );
      if (existUser.status == 1) {
        const { token } = await generateToken({
          userId: existUser.data._id,
          type: existUser.data.isOtpVerified ? "user" : "guestUser",
        });
        if (!existUser.data.isOtpVerified) {
          return res.status(BAD_REQUEST).json({
            status: 0,
            message: 'OTP verification failed',
            token
          });
        }
        const comparePasswords = await checkBcryptPassword(
          password,
          existUser.data.password
        );
        if (comparePasswords.status == 1) {
          // const { token } = await generateToken({
          //   userId: existUser.data._id,
          //   type: "user"
          // });
          const updateUser = await commonQuery(
            userModel,
            findOneAndUpdate,
            { mobile: phoneNumber },
            { token, fcmToken },
            "-password -createdAt -updatedAt -__v -token -otp",
          );

          const totalFollowers = await followerModel.countDocuments({ users: existUser.data._id })
          const totalFollowings = await followingModel.countDocuments({ users: existUser.data._id })
          const totalPost = await postModel.countDocuments({ users: existUser.data._id })
          console.log(updateUser.data, "============ updateUser ==============");
          const organizationList = await organizationListModel.findOne({ createdBy: existUser.data._id })
          const newData = updateUser.data
          res.status(OK).json({
            status: 1,
            message: 'User signed in successfully.',
            token,
            data: {
              _id: updateUser.data._id,
              mobile: updateUser.data.mobile,
              blockedUser: updateUser.data.blockedUser,
              code: updateUser.data.code,
              email: updateUser.data.email,
              location: updateUser.data.location,
              isActive: updateUser.data.isActive,
              isCarDetailsComplete: updateUser.data.isCarDetailsComplete,
              organizationStatus: organizationList?.status || "",
              isOtpVerified: updateUser.data.isOtpVerified,
              lastName: updateUser.data.lastName,
              firstName: updateUser.data.firstName,
              latitude: updateUser.data.latitude,
              longitude: updateUser.data.longitude,
              profileImg: updateUser.data.profileImg,
              fcmToken: updateUser.data.fcmToken,
              totalFollowers: totalFollowers,
              totalFollowings: totalFollowings,
              totalPost: totalPost,
              address: updateUser.data.address,
              isProfileComplete: existUser.data.isProfileComplete,
            },

          });


        } else {
          res
            .status(BAD_REQUEST)
            .json({ status: 0, message: comparePasswords.message });
        }
      } else {
        res.status(BAD_REQUEST).json({
          status: 0,
          message: commonMessages.NOT_EXISTS("Phone number"),
        });
      }
    } catch (error) {
      console.log("/users/sign-in ====>>>> ", error);
      res
        .status(INTERNAL_SERVER_ERROR)
        .json({ status: 0, message: commonMessages.INTERNAL_SERVER_ERROR });
    }
  },
  googleSignIn: async (req, res) => {
    try {
      const { token } = req.body;
      const decodeValue = await jwt.decode(token, { complete: true })
      if (typeof decodeValue.payload === 'object') {
        console.log(decodeValue.payload, "=========== decodeValue.payload ===========");

      }
      // const existUser = await commonQuery(
      //   userModel,
      //   findOne,
      //   { mobile: phoneNumber },
      //   {},
      //   " -createdAt -updatedAt -token"
      // );
      // if (existUser.status == 1) {
      //   const { token } = await generateToken({
      //     userId: existUser.data._id,
      //     type: existUser.data.isOtpVerified ? "user" : "guestUser",
      //   });
      //   if (!existUser.data.isOtpVerified) {
      //     return res.status(BAD_REQUEST).json({
      //       status: 0,
      //       message: 'otp is not verified',
      //       token
      //     });
      //   }
      //   const comparePasswords = await checkBcryptPassword(
      //     password,
      //     existUser.data.password
      //   );
      //   if (comparePasswords.status == 1) {
      //     // const { token } = await generateToken({
      //     //   userId: existUser.data._id,
      //     //   type: "user"
      //     // });
      //     const updateUser = await commonQuery(
      //       userModel,
      //       findOneAndUpdate,
      //       { mobile: phoneNumber },
      //       { token },
      //       "-password -createdAt -updatedAt -__v -token -otp",
      //     );

      //     const totalFollowers = await followerModel.countDocuments({ users: existUser.data._id })
      //     const totalFollowings = await followingModel.countDocuments({ users: existUser.data._id })
      //     const totalPost = await postModel.countDocuments({ users: existUser.data._id })
      //     console.log(updateUser.data, "============ updateUser ==============");
      //     const newData = updateUser.data
      //     res.status(OK).json({
      //       status: 1,
      //       message: commonMessages.SIGNIN_SUCCESS(`User`),
      //       token,
      //       data: {
      //         _id: updateUser.data._id,
      //         mobile: updateUser.data.mobile,
      //         blockedUser: updateUser.data.blockedUser,
      //         code: updateUser.data.code,
      //         email: updateUser.data.email,
      //         location: updateUser.data.location,
      //         isActive: updateUser.data.isActive,
      //         isCarDetailsComplete: updateUser.data.isCarDetailsComplete,
      //         isOrganization: updateUser.data.isOrganization,
      //         isOtpVerified: updateUser.data.isOtpVerified,
      //         lastName: updateUser.data.lastName,
      //         firstName: updateUser.data.firstName,
      //         latitude: updateUser.data.latitude,
      //         longitude: updateUser.data.longitude,
      //         profileImg: updateUser.data.profileImg,
      //         totalFollowers: totalFollowers,
      //         totalFollowings: totalFollowings,
      //         totalPost: totalPost,
      //         isProfileComplete: existUser.data.isProfileComplete,
      //       },

      //     });
      //   } else {
      //     res
      //       .status(BAD_REQUEST)
      //       .json({ status: 0, message: comparePasswords.message });
      //   }
      // } else {
      //   res.status(BAD_REQUEST).json({
      //     status: 0,
      //     message: commonMessages.NOT_EXISTS("Phone number"),
      //   });
      // }
    } catch (error) {
      console.log("/users/sign-in ====>>>> ", error);
      res
        .status(INTERNAL_SERVER_ERROR)
        .json({ status: 0, message: commonMessages.INTERNAL_SERVER_ERROR });
    }
  },

  otpVerify: async (req, res) => {
    try {
      const user = req.user;
      const { otp } = req.body;
      const findUser = await commonQuery(userModel, findOne, { _id: user.id });
      console.log(findUser, "======== findUser ======");
      if (findUser.data.otp !== otp) {
        return res
          .status(BAD_REQUEST)
          .json({ status: 0, message: "OTP verification failed" });
      }
      await commonQuery(
        userModel,
        findOneAndUpdate,
        { _id: user.id },
        { isOtpVerified: true }
      );
      return res
        .status(OK)
        .json({ status: 1, message: "OTP verified successfully" });
    } catch (error) {
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json({ status: 0, message: commonMessages.INTERNAL_SERVER_ERROR });
    }
  },
  forgotPassword: async (req, res) => {
    try {
      const { phoneNumber } = req.body;
      const findUser = await commonQuery(userModel, findOne, { mobile: phoneNumber });
      console.log(findUser, "======== findUser ======");
      if (!findUser.data) {
        return res
          .status(BAD_REQUEST)
          .json({ status: 0, message: "User does nor exist" });
      }

      await commonQuery(
        userModel,
        findOneAndUpdate,
        { _id: findUser.data._id },
        { otp: 222222 }
      );

      const { token } = await generateToken({
        userId: findUser.data._id,
        type: "guestUser",
      });
      return res
        .status(OK)
        .json({ status: 1, message: "OTP sent successfully", token });
    } catch (error) {
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json({ status: 0, message: commonMessages.INTERNAL_SERVER_ERROR });
    }
  },
  updatePassword: async (req, res) => {
    try {
      const user = req.user;
      const { password } = req.body;
      const findUser = await commonQuery(userModel, findOne, { _id: user.id });
      console.log(findUser, "======== findUser ======");
      if (!findUser.data) {
        return res
          .status(BAD_REQUEST)
          .json({ status: 0, message: "User does nor exist" });
      }

      const bcryptPassword = await createBcryptPassword(password);

      await commonQuery(
        userModel,
        findOneAndUpdate,
        { _id: findUser.data._id },
        { password: bcryptPassword }
      );

      const { token } = await generateToken({
        userId: findUser.data._id,
        type: "user",
      });
      return res
        .status(OK)
        .json({ status: 1, message: "Password updated successfully" });
    } catch (error) {
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json({ status: 0, message: commonMessages.INTERNAL_SERVER_ERROR });
    }
  },

  completeProfile: async (req, res) => {
    try {
      const file = req.files;
      const user = req.user;
      console.log(user, "====== useruser ======");
      const input = {
        dob: req.body.dob,
        gender: req.body.gender,
        latitude: +req.body.latitude,
        longitude: +req.body.longitude,
        location: {
          type: "Point",
          coordinates: [+req.body.longitude, +req.body.latitude],
        },
        address: req.body.address,
        isProfileComplete: true,
      };

      if (file.profileImage) {
        input.profileImg = `${IMAGE_URL}/profile/${file.profileImage[0].filename}`;
      }
      console.log(input, "========= input ==========");
      const updateUser = await commonQuery(
        userModel,
        findOneAndUpdate,
        { _id: user.id },
        input
      );
      if (!updateUser) {
        return res
          .status(BAD_REQUEST)
          .json({ status: 0, message: "User does not update" });
      }

      console.log(updateUser, "jdssssssssssssb");

      return res
        .status(OK)
        .json({ status: 1, message: "User updated successfully" });
    } catch (error) {
      console.log(error, "===== error ========");
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json({ status: 0, message: commonMessages.INTERNAL_SERVER_ERROR });
    }
  },

  editProfile: async (req, res) => {
    try {
      const file = req.files;
      const user = req.user;
      console.log(user, "====== useruser ======");
      const input = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        mobile: req.body.mobile,
        dob: req.body.dob,
        gender: req.body.gender,
        latitude: +req.body.latitude,
        longitude: +req.body.longitude,
        location: {
          type: "Point",
          coordinates: [+req.body.longitude, +req.body.latitude],
        },
        address: req.body.address,
        isProfileComplete: true,
      };

      if (file.profileImage) {
        input.profileImg = `${IMAGE_URL}/profile/${file.profileImage[0].filename}`;
      }

      if (file.profileBackgroundimg) {
        input.profileBackgroundimg = `${IMAGE_URL}/profile/${file.profileBackgroundimg[0].filename}`;
      }

      console.log(input, "========= input ==========");
      const updateUser = await commonQuery(
        userModel,
        findOneAndUpdate,
        { _id: user.id },
        input
      );
      if (!updateUser) {
        return res
          .status(BAD_REQUEST)
          .json({ status: 0, message: "User does not update" });
      }
      return res
        .status(OK)
        .json({ status: 1, message: "User updated successfully" });
    } catch (error) {
      console.log(error, "===== error ========");
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json({ status: 0, message: commonMessages.INTERNAL_SERVER_ERROR });
    }
  },

  completeCarDetails: async (req, res) => {
    try {
      const user = req.user;
      const file = req.files;

      const input = {
        year: req.body.year,
        make: req.body.make,
        model: req.body.model,
        description: req.body.description,
        user: user.id,
      };

      if (file.carImage) {
        input.carImg = `${IMAGE_URL}/car/${file.carImage[0].filename}`;
      }
      const createCarDetails = await commonQuery(
        carDetailsModel,
        create,
        input
      );

      if (!createCarDetails) {
        return res
          .status(BAD_REQUEST)
          .json({ status: 0, message: "Car details does not create" });
      }
      await commonQuery(
        userModel,
        findOneAndUpdate,
        { _id: user.id },
        { isCarDetailsComplete: true }
      );
      return res
        .status(OK)
        .json({ status: 1, message: "Car details created successfully" });
    } catch (error) {
      console.log(error, "======== error ======");
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json({ status: 0, message: commonMessages.INTERNAL_SERVER_ERROR });
    }
  },


  getProfileDetails: async (req, res) => {
    try {
      const user = req.user;
      const { id } = req.query;

      const getProfileDetails = await commonQuery(
        userModel,
        findOne,
        { _id: id },
        {},
        "-password -token"
      );
      if (!getProfileDetails) {
        return res
          .status(BAD_REQUEST)
          .json({ status: 0, message: "User details does not create" });
      }
      const totalFollowers = await followerModel.countDocuments({ users: getProfileDetails.data._id })
      const totalFollowings = await followingModel.countDocuments({ users: getProfileDetails.data._id })
      const totalPost = await postModel.countDocuments({ users: getProfileDetails.data._id })
      return res.status(OK).json({
        status: 1,
        message: "User details created successfully",
        data: {
          ...getProfileDetails.data, totalFollowers: totalFollowers,
          totalFollowings: totalFollowings,
          totalPost: totalPost,
          isMyProfile: user.id.toString() == id ? true : false
        },
      });
    } catch (error) {
      console.log(error, "======== error ======");
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json({ status: 0, message: commonMessages.INTERNAL_SERVER_ERROR });
    }
  },
  getMyBlockUserDetails: async (req, res) => {
    try {
      const user = req.user;
      const { id, page, size } = req.query;

      // const getProfileDetails = await commonQuery(
      //   blockedUser,
      //   findOne,
      //   { _id: id },
      //   {},
      //   "-password -token",{path:"blockedUser",}
      // );
      const getProfileDetails = await userModel.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(id) } },
        { $lookup: { from: "users", localField: "blockedUser", foreignField: "_id", as: "blockedUser", pipeline: [{ $skip: (+page - 1) * size }, { $limit: +size }, { $project: { profileImg: 1, firstName: 1, lastName: 1, email: 1 } }] } },
      ])
      const getUserDetails = await userModel.findOne({ _id: id })
      if (!getProfileDetails) {
        return res
          .status(BAD_REQUEST)
          .json({ status: 0, message: "Block user not found" });
      }
      return res.status(OK).json({
        status: 1,
        message: "Block user found successfully",
        data: getProfileDetails[0]?.blockedUser,
        total: getUserDetails?.blockedUser?.length,
        page
      });
    } catch (error) {
      console.log(error, "======== error ======");
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json({ status: 0, message: commonMessages.INTERNAL_SERVER_ERROR });
    }
  },


  getCarDetails: async (req, res) => {
    try {
      const id = req.query;
      const { page = 1, size = 10 } = req.query;

      const pageNum = parseInt(page, 10);
      const sizeNum = parseInt(size, 10);

      console.log(id);


      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          status: 0,
          message: "Invalid User ID format",
        });
      }

      //     // const getProfileDetails = await commonQuery(
      //     //   carDetailsModel,
      //     //   find,
      //     //   { user: user.id },
      //     //   {},
      //     //   "-password -token"
      //     // );
      const getCarDetails = await carDetailsModel.aggregate([
        { $match: { user: new mongoose.Types.ObjectId(id) } },
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "userDetails",

          },
        },
        {
          $addFields: {
            userDetails: { $arrayElemAt: ["$userDetails", 0] }, // Extract the first element from the "userDetails" array
          },
        },
        { $skip: (pageNum - 1) * sizeNum },
        { $limit: sizeNum },

      ]);

      if (!getCarDetails || getCarDetails.length === 0) {
        return res
          .status(400)
          .json({ status: 0, message: "Car details not found for the user" });
      }

      return res.status(200).json({
        status: 1,
        message: "Car details found successfully",
        data: getCarDetails,
      });
    } catch (error) {
      console.log(error, "======== error ======");
      return res
        .status(500)
        .json({ status: 0, message: "Internal server error" });
    }
  },

  updateCarDetails: async (req, res) => {
    try {
      const user = req.user;
      const file = req.files;

      const { id } = req.query
      const input = {
        year: req.body.year,
        make: req.body.make,
        model: req.body.model,
        description: req.body.description,
      };

      if (file.carImage) {
        input.carImg = `${IMAGE_URL}/car/${file.carImage[0].filename}`;
      }
      const updateCarDetails = await commonQuery(
        carDetailsModel,
        findOneAndUpdate,
        { _id: id },
        input
      );

      if (!updateCarDetails) {
        return res
          .status(BAD_REQUEST)
          .json({ status: 0, message: "Car details does not updated" });
      }
      return res
        .status(OK)
        .json({ status: 1, message: "Car details updated successfully" });
    } catch (error) {
      console.log(error, "======== error ======");
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json({ status: 0, message: commonMessages.INTERNAL_SERVER_ERROR });
    }
  },
  logout: async (req, res) => {
    try {
      const user = req.user;
      const updateUser = await commonQuery(userModel, findOneAndUpdate, { _id: user.id }, { token: "", fcmToken: "" })
      return res
        .status(OK)
        .json({ status: 1, message: "User logout successfully" });
    } catch (error) {
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json({ status: 0, message: commonMessages.INTERNAL_SERVER_ERROR });
    }
  }
};
