const { StatusCodes } = require("http-status-codes");

const {
    QUERY,
    commonMessages,
    commonQuery,
    generateToken,
    checkBcryptPassword,
    createBcryptPassword,
    sendNotification,
} = require("../../helper/helper");

const { OK, INTERNAL_SERVER_ERROR, BAD_REQUEST } = StatusCodes;
const { findOne, create, findOneAndUpdate, find, countDocuments } = QUERY;

// config
const { IMAGE_URL } = require("../../config");

// MODELS
const adminModel = require("../../models/admin.model");
const userModel = require("../../models/users.model");
const eventModel = require("../../models/event.model");
const organizationModel = require("../../models/organization.model");
const commentsModel = require("../../models/comment.model");
const organizationListModel = require("../../models/organizationList.model");
const reportModel = require("../../models/report.model");
const notificationModel = require("../../models/notification.model");

module.exports = {
    // AUTHENTICATION SECTION
    register: async (req, res) => {
        try {
            let { name, email, password } = req.body;
            const existUser = await commonQuery(adminModel, findOne, { email });
            if (existUser.status == 1) {
                res
                    .status(BAD_REQUEST)
                    .json({ status: 0, message: commonMessages.ALREADY_EXISTS("Email") });
            } else {
                const userData = { name, email };
                const newUser = await commonQuery(adminModel, create, userData);
                if (newUser.status == 1) {
                    const bcryptPassword = await createBcryptPassword(password);
                    const userData = await commonQuery(
                        adminModel,
                        findOneAndUpdate,
                        { email },
                        { password: bcryptPassword },
                        "-password -createdAt -updatedAt"
                    );
                    const { token } = await generateToken({
                        userId: newUser.data._id,
                        type: "admin",
                    });
                    res.status(OK).json({
                        status: 1,
                        message: commonMessages.SIGNUP_SUCCESS(`Admin`),
                        token,
                        data: userData.data,
                    });
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
            const { email, password } = req.body;
            const existUser = await commonQuery(
                adminModel,
                findOne,
                { email },
                {},
                " -createdAt -updatedAt"
            );
            if (existUser.status == 1) {
                const comparePasswords = await checkBcryptPassword(
                    password,
                    existUser.data.password
                );
                if (comparePasswords.status == 1) {
                    const { token } = await generateToken({
                        userId: existUser.data._id,
                        type: "admin",
                    });
                    const updateUser = await commonQuery(
                        adminModel,
                        findOneAndUpdate,
                        { email },
                        { token },
                        "-password -createdAt -updatedAt -__v",);
                    res.status(OK).json({
                        status: 1,
                        message: commonMessages.SIGNIN_SUCCESS(`Admin`),
                        token,
                        data: updateUser.data,
                    });
                } else {
                    res
                        .status(BAD_REQUEST)
                        .json({ status: 0, message: comparePasswords.message });
                }
            } else {
                res.status(BAD_REQUEST).json({
                    status: 0,
                    message: commonMessages.NOT_EXISTS("Email"),
                });
            }
        } catch (error) {
            console.log("/users/sign-in ====>>>> ", error);
            res
                .status(INTERNAL_SERVER_ERROR)
                .json({ status: 0, message: commonMessages.INTERNAL_SERVER_ERROR });
        }
    },

    getUser: async (req, res) => {
        try {
            const user = req.user;
            const { otp, page, size, search } = req.body;
            const findUser = await commonQuery(userModel, find, { $or: [{ firstName: RegExp(search, 'i') }, { lastName: RegExp(search, 'i') }, { email: RegExp(search, 'i') }] }, {}, "-password", null, size, page);
            if (!findUser) {
                return res
                    .status(BAD_REQUEST)
                    .json({ status: 0, message: "User not found" });
            }
            const totalCount = await commonQuery(userModel, countDocuments, { $or: [{ firstName: RegExp(search, 'i') }, { lastName: RegExp(search, 'i') }, { email: RegExp(search, 'i') }] })
            return res
                .status(OK)
                .json({ status: 1, message: "Users found successfully", data: findUser.data, page, total: totalCount.data });
        } catch (error) {
            return res
                .status(INTERNAL_SERVER_ERROR)
                .json({ status: 0, message: commonMessages.INTERNAL_SERVER_ERROR });
        }
    },
      getUserDetails: async (req, res) => {
        try {
            const user = req.user;
            const { id } = req.body;
            const findUser = await commonQuery(userModel, findOne, { _id: id });
            if (!findUser) {
                return res
                    .status(BAD_REQUEST)
                    .json({ status: 0, message: "User not found" });
            }
            return res
                .status(OK)
                .json({ status: 1, message: "User found successfully", data: findUser.data });
        } catch (error) {
            return res
                .status(INTERNAL_SERVER_ERROR)
                .json({ status: 0, message: commonMessages.INTERNAL_SERVER_ERROR });
        }
    },
    updateUser: async (req, res) => {
        try {
            const user = req.user;
            const { id, isActive } = req.body;
            const findUser = await commonQuery(userModel, findOneAndUpdate, { _id: id }, { isActive });
            if (!findUser) {
                return res
                    .status(BAD_REQUEST)
                    .json({ status: 0, message: "User not updated" });
            }
            return res
                .status(OK)
                .json({ status: 1, message: "Users updated successfully" });
        } catch (error) {
            return res
                .status(INTERNAL_SERVER_ERROR)
                .json({ status: 0, message: commonMessages.INTERNAL_SERVER_ERROR });
        }
    },

    getMemberEvent: async (req, res) => {
        try {
            const user = req.user;
            const { page, size, search } = req.body;
            const findUser = await commonQuery(eventModel, find, { title: RegExp(search, 'i') }, {}, "-password", null, size, page);
            if (!findUser) {
                return res
                    .status(BAD_REQUEST)
                    .json({ status: 1, message: "Events not found" });
            }
            const totalCount = await commonQuery(eventModel, countDocuments, { title: RegExp(search, 'i') })

            return res
                .status(OK)
                .json({ status: 1, message: "Events found successfully", data: findUser.data, page, total: totalCount.data });
        } catch (error) {
            return res
                .status(INTERNAL_SERVER_ERROR)
                .json({ status: 0, message: commonMessages.INTERNAL_SERVER_ERROR });
        }
    },
    getMemberEventDetails: async (req, res) => {
        try {
            const user = req.user;
            const { id } = req.body;
            const findUser = await commonQuery(eventModel, findOne, { _id: id });
            if (!findUser) {
                return res
                    .status(BAD_REQUEST)
                    .json({ status: 0, message: "User not found" });
            }
            return res
                .status(OK)
                .json({ status: 1, message: "User found successfully", data: findUser.data });
        } catch (error) {
            return res
                .status(INTERNAL_SERVER_ERROR)
                .json({ status: 0, message: commonMessages.INTERNAL_SERVER_ERROR });
        }
    },
    updateMemberEvent: async (req, res) => {
        try {
            const user = req.user;
            const { id, isActive } = req.body;
            const findUser = await commonQuery(eventModel, findOneAndUpdate, { _id: id }, { isActive });
            if (!findUser) {
                return res
                    .status(BAD_REQUEST)
                    .json({ status: 0, message: "User not updated" });
            }
            return res
                .status(OK)
                .json({ status: 1, message: "Users updated successfully" });
        } catch (error) {
            return res
                .status(INTERNAL_SERVER_ERROR)
                .json({ status: 0, message: commonMessages.INTERNAL_SERVER_ERROR });
        }
    },

    getOrganizationEvent: async (req, res) => {
        try {
            const user = req.user;
            const { page, size, search } = req.body;
            const findUser = await commonQuery(organizationModel, find, { title: RegExp(search, 'i') }, {}, "-password", null, size, page);
            if (!findUser) {
                return res
                    .status(BAD_REQUEST)
                    .json({ status: 0, message: "Event not found" });
            }
            const totalCount = await commonQuery(organizationModel, countDocuments, { title: RegExp(search, 'i') })

            return res
                .status(OK)
                .json({ status: 1, message: "Event found successfully", data: findUser.data, page, total: totalCount.data });
        } catch (error) {
            return res
                .status(INTERNAL_SERVER_ERROR)
                .json({ status: 0, message: commonMessages.INTERNAL_SERVER_ERROR });
        }
    },
    getOrganizationDetails: async (req, res) => {
        try {
            const user = req.user;
            const { id } = req.body;
            const findUser = await commonQuery(organizationModel, findOne, { _id: id });
            if (!findUser) {
                return res
                    .status(BAD_REQUEST)
                    .json({ status: 0, message: "User not found" });
            }
            return res
                .status(OK)
                .json({ status: 1, message: "User found successfully", data: findUser.data });
        } catch (error) {
            return res
                .status(INTERNAL_SERVER_ERROR)
                .json({ status: 0, message: commonMessages.INTERNAL_SERVER_ERROR });
        }
    },
    updateOrganizationEvent: async (req, res) => {
        try {
            const user = req.user;
            const { id, isActive } = req.body;
            const findUser = await commonQuery(organizationModel, findOneAndUpdate, { _id: id }, { isActive });
            if (!findUser) {
                return res
                    .status(BAD_REQUEST)
                    .json({ status: 0, message: "Event not updated" });
            }
            return res
                .status(OK)
                .json({ status: 1, message: "Event updated successfully" });
        } catch (error) {
            return res
                .status(INTERNAL_SERVER_ERROR)
                .json({ status: 0, message: commonMessages.INTERNAL_SERVER_ERROR });
        }
    },

    getComments: async (req, res) => {
        try {
            const user = req.user;
            const { page, size, search } = req.body;
            // const findUser = await commonQuery(commentsModel, find, {}, {}, "-password", null, size, page);
            const aggregate = [
                { $lookup: { from: "users", foreignField: "_id", localField: "users", as: "users" } },
                { $lookup: { from: "posts", foreignField: "_id", localField: "post", as: "post" } },
                { $unwind: { path: "$post", preserveNullAndEmptyArrays: true } },
                { $unwind: { path: "$users", preserveNullAndEmptyArrays: true } },
                { $match: { $or: [{ "users.firstName": RegExp(search, 'i') }, { "users.lastName": RegExp(search, 'i') }] } }
            ]
            if (page && size) {
                aggregate.push({ $skip: (+page - 1) * +size }, { $limit: +size })
            }
            const findUser = await commentsModel.aggregate(aggregate)
            const findUserCount = await commentsModel.aggregate([
                { $lookup: { from: "users", foreignField: "_id", localField: "users", as: "users" } },
                { $lookup: { from: "posts", foreignField: "_id", localField: "post", as: "post" } },
                { $unwind: { path: "$post", preserveNullAndEmptyArrays: true } },
                { $unwind: { path: "$users", preserveNullAndEmptyArrays: true } },
                { $match: { $or: [{ "users.firstName": RegExp(search, 'i') }, { "users.lastName": RegExp(search, 'i') }] } }
            ])
            if (!findUser) {
                return res
                    .status(BAD_REQUEST)
                    .json({ status: 0, message: "Comments not found" });
            }
            // const totalCount = await commonQuery(commentsModel, countDocuments, {})

            return res
                .status(OK)
                .json({ status: 1, message: "Comments found successfully", data: findUser, page, total: findUserCount.length });
        } catch (error) {
            console.log(error, "========== error ===========");

            return res
                .status(INTERNAL_SERVER_ERROR)
                .json({ status: 0, message: commonMessages.INTERNAL_SERVER_ERROR });
        }
    },
    getCommentDetails: async (req, res) => {
        try {
            const user = req.user;
            const { id } = req.body;
            const findUser = await commonQuery(commentsModel, findOne, { _id: id });
            if (!findUser) {
                return res
                    .status(BAD_REQUEST)
                    .json({ status: 0, message: "User not found" });
            }
            return res
                .status(OK)
                .json({ status: 1, message: "User found successfully", data: findUser.data });
        } catch (error) {
            return res
                .status(INTERNAL_SERVER_ERROR)
                .json({ status: 0, message: commonMessages.INTERNAL_SERVER_ERROR });
        }
    },
    updateComments: async (req, res) => {
        try {
            const user = req.user;
            const { id, isActive } = req.body;
            const findUser = await commonQuery(commentsModel, findOneAndUpdate, { _id: id }, { isActive });
            if (!findUser) {
                return res
                    .status(BAD_REQUEST)
                    .json({ status: 0, message: "Comment not updated" });
            }
            return res
                .status(OK)
                .json({ status: 1, message: "Comment updated successfully" });
        } catch (error) {
            return res
                .status(INTERNAL_SERVER_ERROR)
                .json({ status: 0, message: commonMessages.INTERNAL_SERVER_ERROR });
        }
    },

    getOrganization: async (req, res) => {
        try {
            const user = req.user;
            const { page, size, status, search } = req.body;
            const filter = { $or: [{ firstName: RegExp(search, "i") }, { lastName: RegExp(search, "i") }] }
            if (status) {
                filter.status = status
            }
            const findOrganization = await commonQuery(organizationListModel, find, filter, { createdAt: -1 }, "", { path: "createdBy", select: "firstName lastName email profileImg" }, size, page);
            // const findUser = await commentsModel.aggregate([
            //     {$lookup:{from:"users", foreignField:"_id",localField:"users",as:"users"}},
            //     {$lookup:{from:"posts", foreignField:"_id",localField:"post",as:"post"}},
            //     {$unwind:"$post"},
            //     {$unwind:"$users"},
            //     {$match:{$or:[{firstName:RegExp(search,'i')}]}}
            // ])
            if (!findOrganization) {
                return res
                    .status(BAD_REQUEST)
                    .json({ status: 0, message: "Organization not found" });
            }
            const totalCount = await commonQuery(organizationListModel, find, filter, { createdAt: -1 });

            return res
                .status(OK)
                .json({ status: 1, message: "Organization found successfully", data: findOrganization, page, total: totalCount.data.length });
        } catch (error) {
            return res
                .status(INTERNAL_SERVER_ERROR)
                .json({ status: 0, message: commonMessages.INTERNAL_SERVER_ERROR });
        }
    },
    // getCommentDetails: async (req, res) => {
    //     try {
    //         const user = req.user;
    //         const { id } = req.body;
    //         const findUser = await commonQuery(commentsModel, findOne, { _id: id });
    //         if (!findUser) {
    //             return res
    //                 .status(BAD_REQUEST)
    //                 .json({ status: 0, message: "User not found" });
    //         }
    //         return res
    //             .status(OK)
    //             .json({ status: 1, message: "User found successfully", data: findUser.data });
    //     } catch (error) {
    //         return res
    //             .status(INTERNAL_SERVER_ERROR)
    //             .json({ status: 0, message: commonMessages.INTERNAL_SERVER_ERROR });
    //     }
    // },
    updateOrganization: async (req, res) => {
        try {
            const user = req.user;
            const { id, status } = req.body;
            const findUser = await commonQuery(organizationListModel, findOneAndUpdate, { _id: id }, { status });
            if (!findUser) {
                return res
                    .status(BAD_REQUEST)
                    .json({ status: 0, message: "Organization not updated" });
            }
            const userData = await commonQuery(userModel, findOne, { _id: findUser.data.createdBy });

            if (status === 'accept') {
                const updatedData = await commonQuery(userModel, findOneAndUpdate, { _id: findUser.data.createdBy }, { isOrganization: true });
                const notification = await sendNotification("Accept Organization Request", `Your organization request is accepted`, "", [userData?.data?.fcmToken])
                await commonQuery(notificationModel, create, { description: `Your organization request accepted`, type: "organization-accept", user: findUser.data.createdBy, fromUser: user.id });

            } else {
                const notification = await sendNotification("Reject Organization Request", `Your organization request is rejected`, "", [userData?.data?.fcmToken])
                await commonQuery(notificationModel, create, { description: `Your organization request accepted`, type: "organization-reject", user: findUser.data.createdBy, fromUser: user.id });
            }
            return res
                .status(OK)
                .json({ status: 1, message: "Organization updated successfully" });
        } catch (error) {
            console.log(error, "====== 6738442ce00424db420d2a9b ========");

            return res
                .status(INTERNAL_SERVER_ERROR)
                .json({ status: 0, message: commonMessages.INTERNAL_SERVER_ERROR });
        }
    },

    getReports: async (req, res) => {
        try {
            const user = req.user;
            const { page, size, search } = req.body;
            // const findUser = await commonQuery(commentsModel, find, {}, {}, "-password", null, size, page);
            const aggregate = [
                { $lookup: { from: "users", foreignField: "_id", localField: "users", as: "users" } },
                { $lookup: { from: "users", foreignField: "_id", localField: "reportedUser", as: "reportedUser" } },
                { $unwind: { path: "$reportedUser", preserveNullAndEmptyArrays: true } },
                { $unwind: { path: "$users", preserveNullAndEmptyArrays: true } },
                { $match: { $or: [{ "users.firstName": RegExp(search, 'i') }, { "users.lastName": RegExp(search, 'i') }, { "reportedUser.firstName": RegExp(search, 'i') }, { "reportedUser.lastName": RegExp(search, 'i') }] } }
            ]
            if (page && size) {
                aggregate.push({ $skip: (+page - 1) * +size }, { $limit: +size })
            }
            const findUser = await reportModel.aggregate(aggregate)
            const findUserCount = await reportModel.aggregate([
                { $lookup: { from: "users", foreignField: "_id", localField: "users", as: "users" } },
                { $lookup: { from: "users", foreignField: "_id", localField: "reportedUser", as: "reportedUser" } },
                { $unwind: { path: "$reportedUser", preserveNullAndEmptyArrays: true } },
                { $unwind: { path: "$users", preserveNullAndEmptyArrays: true } },
                { $match: { $or: [{ "users.firstName": RegExp(search, 'i') }, { "users.lastName": RegExp(search, 'i') }, { "reportedUser.firstName": RegExp(search, 'i') }, { "reportedUser.lastName": RegExp(search, 'i') }] } }
            ])
            if (!findUser) {
                return res
                    .status(BAD_REQUEST)
                    .json({ status: 0, message: "Comments not found" });
            }
            // const totalCount = await commonQuery(commentsModel, countDocuments, {})

            return res
                .status(OK)
                .json({ status: 1, message: "Comments found successfully", data: findUser, page, total: findUserCount.length });
        } catch (error) {
            console.log(error, "========== error ===========");

            return res
                .status(INTERNAL_SERVER_ERROR)
                .json({ status: 0, message: commonMessages.INTERNAL_SERVER_ERROR });
        }
    },
    getCommentDetails: async (req, res) => {
        try {
            const user = req.user;
            const { id } = req.body;
            const findUser = await commonQuery(commentsModel, findOne, { _id: id });
            if (!findUser) {
                return res
                    .status(BAD_REQUEST)
                    .json({ status: 0, message: "User not found" });
            }
            return res
                .status(OK)
                .json({ status: 1, message: "User found successfully", data: findUser.data });
        } catch (error) {
            return res
                .status(INTERNAL_SERVER_ERROR)
                .json({ status: 0, message: commonMessages.INTERNAL_SERVER_ERROR });
        }
    },
    updateComments: async (req, res) => {
        try {
            const user = req.user;
            const { id, isActive } = req.body;
            const findUser = await commonQuery(commentsModel, findOneAndUpdate, { _id: id }, { isActive });
            if (!findUser) {
                return res
                    .status(BAD_REQUEST)
                    .json({ status: 0, message: "Comment not updated" });
            }
            return res
                .status(OK)
                .json({ status: 1, message: "Comment updated successfully" });
        } catch (error) {
            return res
                .status(INTERNAL_SERVER_ERROR)
                .json({ status: 0, message: commonMessages.INTERNAL_SERVER_ERROR });
        }
    },
};
