const { StatusCodes } = require("http-status-codes");
const mongoose = require('mongoose')
const { QUERY, commonMessages, commonQuery, sendNotification } = require("../helper/helper");

const { OK, INTERNAL_SERVER_ERROR, BAD_REQUEST } = StatusCodes;
const { findOne, create, findOneAndUpdate, find, countDocuments, findOneAndDelete } = QUERY;

// config
const { IMAGE_URL } = require("../config");

// MODELS
const userModel = require("../models/users.model");
const carDetailsModel = require("../models/carditails.model");
const reportModel = require("../models/report.model");
const postModel = require("../models/post.model");
const eventModel = require("../models/event.model");
const organizationModel = require("../models/organization.model");
const organizationListModel = require("../models/organizationList.model");
const followerModel = require("../models/followers.model");
const followingModel = require("../models/following.model");
const likeModel = require("../models/like.model");
const commentModel = require("../models/comment.model");
const requestModel = require("../models/request.model");
const notificationModel = require("../models/notification.model");

module.exports = {
  // homeScreen: async (req, res) => {
  //   try {
  //     const user = req.user;
  //     const { page, size, type, search } = req.body;
  //     let findFollowerPost, eventPost, OrganizationEventPost;
  //     const getUserFollowing = await commonQuery(followingModel, find, { users: user.id });

  //     if (type?.toLowerCase() === "event") {


  //       const findFollowers = await commonQuery(followerModel, find, { users: user.id }, {}, "followers");
  //       const findFollowings = await commonQuery(followingModel, find, { users: user.id }, {}, "following");

  //       const followerIdArray = findFollowers?.data?.map((data) => {
  //         return data?.followers;
  //       });
  //       const followingIdArray = findFollowings?.data?.map((data) => {
  //         return data?.following;
  //       });

  //       // eventPost = await commonQuery(eventModel, find, { isActive: true, createdBy: { $nin: user.blockedUser } }, { createdAt: -1 }, "", { path: "createdBy", select: "profileImg firstName lastName email _id address" }, size, page);
  //       eventPost = await commonQuery(eventModel, find, { isActive: true, $and: [{ createdBy: { $in: [...followerIdArray] } }, { createdBy: { $nin: user.blockedUser } }] }, { createdAt: -1 }, "", { path: "createdBy", select: "profileImg firstName lastName email _id address" }, size, page);
  //       OrganizationEventPost = await commonQuery(organizationModel, find, { isActive: true, createdBy: { $nin: user.blockedUser } }, { createdAt: -1 }, "", { path: "createdBy", select: "profileImg firstName lastName email _id address" }, size, page);
  //       eventPost.data = await Promise.all(eventPost.data?.map(async (_data) => {
  //         const countData = await commonQuery(commentModel, countDocuments, { post: _data?._id })
  //         const likeCountData = await commonQuery(likeModel, findOne, { post: _data?._id })
  //         return {
  //           ..._data,
  //           commentCount: countData.data || 0,
  //           likeCount: likeCountData?.data?.users?.length || 0,
  //           isLike: likeCountData?.data?.users?.toString()?.includes(user._id.toString()) ? true : false,
  //           isFollow: getUserFollowing?.data?.length ? getUserFollowing?.data?.filter(data => data.following)?.toString()?.includes(user._id.toString()) ? true : false : false,
  //           isMyEvent: _data.createdBy._id.toString() == user.id ? true : false,
  //           isOrganizationEvent: false
  //         }
  //       }))
  //       OrganizationEventPost.data = await Promise.all(OrganizationEventPost.data?.map(async (_data) => {
  //         const countData = await commonQuery(commentModel, countDocuments, { post: _data?._id })
  //         const likeCountData = await commonQuery(likeModel, findOne, { post: _data?._id })

  //         return {
  //           ..._data,
  //           commentCount: countData.data || 0,
  //           likeCount: likeCountData?.data?.users?.length || 0,
  //           isLike: likeCountData?.data?.users?.toString()?.includes(user._id.toString()) ? true : false,
  //           isMyEvent: _data.createdBy._id.toString() == user.id ? true : false,
  //           isOrganizationEvent: true
  //         }
  //       }))
  //     }

  //     if (type?.toLowerCase() === "following") {
  //       const findFollowers = await commonQuery(followerModel, find, { users: user.id }, {}, "followers");
  //       const findFollowings = await commonQuery(followingModel, find, { users: user.id }, {}, "following");
  //       const followerIdArray = findFollowers?.data?.map((data) => {
  //         return data?.followers;
  //       });
  //       const followingIdArray = findFollowings?.data?.map((data) => {
  //         return data?.following;
  //       });

  //       findFollowerPost = await commonQuery(postModel, find, { $and: [{ user: { $in: [...followerIdArray, ...followingIdArray] } }, { user: { $nin: user.blockedUser } }], isActive: true }, { createdAt: -1 }, "", { path: "user", select: "email firstName lastName profileImg" }, size, page);

  //       findFollowerPost.data = await Promise.all(findFollowerPost.data?.map(async (_data) => {
  //         const countData = await commonQuery(commentModel, countDocuments, { post: _data?._id })
  //         const likeCountData = await commonQuery(likeModel, findOne, { post: _data?._id })

  //         const dataObject = {
  //           ..._data,
  //           createdBy: _data.user,
  //           commentCount: countData.data || 0,
  //           likeCount: likeCountData?.data?.users?.length || 0,
  //           isLike: likeCountData?.data?.users?.toString()?.includes(user._id.toString()) ? true : false,
  //           isMyPost: _data?.user?.toString() == user?.id ? true : false
  //         }
  //         delete dataObject?.user
  //         return dataObject
  //       }))


  //     }
  //     // console.log(findFollowerPost, "========== findFollowerPost ================");
  //     return res.status(OK).json({
  //       status: 1,
  //       message: "Home screen data retrieved successfully",
  //       data: {
  //         following: findFollowerPost?.data || [],
  //         event:
  //           (eventPost?.data || OrganizationEventPost?.data) ? [...eventPost?.data, ...OrganizationEventPost?.data]?.sort(
  //             (a, b) => b?.createdAt - a?.createdAt
  //           ) : [],
  //       },
  //     });
  //   } catch (error) {
  //     console.log(error, "======== error ========");

  //     return res
  //       .status(INTERNAL_SERVER_ERROR)
  //       .json({ status: 0, message: commonMessages.INTERNAL_SERVER_ERROR });
  //   }
  // },


  homeScreen: async (req, res) => {
    try {
      const user = req.user;
      const { page, size, type, search } = req.body;

      let allPosts = [];
      let allEventPosts = [];

      // Fetch followers and following
      const findFollowers = await commonQuery(followerModel, find, { users: user.id }, {}, "followers");
      const findFollowings = await commonQuery(followingModel, find, { users: user.id }, {}, "following");

      const followerIdArray = findFollowers?.data?.map((data) => data?.followers);
      const followingIdArray = findFollowings?.data?.map((data) => data?.following);

      const blockedUsers = user.blockedUser || [];

      if (type?.toLowerCase() === "event") {
        // Fetch events created by following users
        const followingEventFilter = {
          isActive: true,
          createdBy: { $in: [...followerIdArray, ...followingIdArray], $nin: blockedUsers },
          ...(search
            ? { $or: [{ title: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }] }
            : {}),
        };

        // Fetch events created by non-following users
        const notFollowingEventFilter = {
          isActive: true,
          createdBy: { $nin: [...followerIdArray, ...followingIdArray, ...blockedUsers] },
          ...(search
            ? { $or: [{ title: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }] }
            : {}),
        };

        // Query events
        const followingEvents = await commonQuery(
          eventModel,
          find,
          followingEventFilter,
          { createdAt: -1 },
          "",
          { path: "createdBy", select: "profileImg firstName lastName email _id address" },
          size,
          page
        );

        const notFollowingEvents = await commonQuery(
          eventModel,
          find,
          notFollowingEventFilter,
          { createdAt: -1 },
          "",
          { path: "createdBy", select: "profileImg firstName lastName email _id address" },
          size,
          page
        );

        // Enrich events with additional data
        const enrichEvents = async (events, isFollowing) =>
          Promise.all(
            events.map(async (_data) => {
              const commentCount = await commonQuery(commentModel, countDocuments, { post: _data?._id });
              const likeCountData = await commonQuery(likeModel, findOne, { post: _data?._id });
              return {
                ..._data,
                commentCount: commentCount?.data || 0,
                likeCount: likeCountData?.data?.users?.length || 0,
                isLike: likeCountData?.data?.users?.toString()?.includes(user._id.toString()) ? true : false,
                isFollow: isFollowing,
                isMyEvent: _data.createdBy._id.toString() === user.id,
              };
            })
          );

        // Process events and combine them
        const enrichedFollowingEvents = await enrichEvents(followingEvents.data, true);
        const enrichedNotFollowingEvents = await enrichEvents(notFollowingEvents.data, false);

        allEventPosts = [...enrichedFollowingEvents, ...enrichedNotFollowingEvents].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      }

      if (type?.toLowerCase() === "following") {
        // Following posts
        const followingPostFilter = {
          $and: [
            { user: { $in: [...followerIdArray, ...followingIdArray] } },
            { user: { $nin: blockedUsers } },
          ],
          isActive: true,
        };

        const followingPosts = await commonQuery(
          postModel,
          find,
          followingPostFilter,
          { createdAt: -1 },
          "",
          { path: "user", select: "email firstName lastName profileImg" },
          size,
          page
        );

        // Enrich following posts
        const enrichedFollowingPosts = await Promise.all(
          followingPosts.data?.map(async (_data) => {
            const commentCount = await commonQuery(commentModel, countDocuments, { post: _data?._id });
            const likeCountData = await commonQuery(likeModel, findOne, { post: _data?._id });
            return {
              ..._data,
              createdBy: _data.user,
              commentCount: commentCount?.data || 0,
              likeCount: likeCountData?.data?.users?.length || 0,
              isLike: likeCountData?.data?.users?.toString()?.includes(user._id.toString()) ? true : false,
              isMyPost: _data?.user?.toString() === user?.id,
            };
          })
        );

        // Non-following posts
        const notFollowingPostFilter = {
          $and: [
            { user: { $nin: [...followerIdArray, ...followingIdArray, ...blockedUsers] } },
            { isActive: true },
          ],
          ...(search
            ? { $or: [{ title: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }] }
            : {}),
        };

        const notFollowingPosts = await commonQuery(
          postModel,
          find,
          notFollowingPostFilter,
          { createdAt: -1 },
          "",
          { path: "user", select: "email firstName lastName profileImg" },
          size,
          page
        );

        // Enrich non-following posts
        const enrichedNotFollowingPosts = await Promise.all(
          notFollowingPosts.data?.map(async (_data) => {
            const commentCount = await commonQuery(commentModel, countDocuments, { post: _data?._id });
            const likeCountData = await commonQuery(likeModel, findOne, { post: _data?._id });
            return {
              ..._data,
              createdBy: _data.user,
              commentCount: commentCount?.data || 0,
              likeCount: likeCountData?.data?.users?.length || 0,
              isLike: likeCountData?.data?.users?.toString()?.includes(user._id.toString()) ? true : false,
              isMyPost: _data?.user?.toString() === user?.id,
            };
          })
        );

        // Combine all posts (following and non-following) into one array
        allPosts = [...enrichedFollowingPosts, ...enrichedNotFollowingPosts].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      }

      // Return combined results for both posts and events
      return res.status(OK).json({
        status: 1,
        message: "Home screen data retrieved successfully",
        data: {
          Posts: allPosts || [],
          EventPosts: allEventPosts || [],
        },
      });
    } catch (error) {
      console.error("Error in homeScreen:", error);
      return res.status(INTERNAL_SERVER_ERROR).json({ status: 0, message: "Internal server error" });
    }
  },


  getUserDetails: async (req, res) => {
    try {
      const user = req.user;
      const { id } = req.query;
      const getUserDetails = await commonQuery(userModel, findOne, { _id: id }, {}, "-password -token", null);
      const getUserFollow = await commonQuery(followerModel, find, { users: user.id });
      const getUserFollowing = await commonQuery(followingModel, find, { users: user.id });
      const getUserRequest = await commonQuery(requestModel, findOne, { $or: [{ fromUser: user.id, toUser: id, status: "pending" }, { fromUser: id, toUser: user.id, status: "pending" }] });

      const totalFollowers = await followerModel.countDocuments({ users: id })
      const totalFollowings = await followingModel.countDocuments({ users: id })
      const totalPost = await postModel.countDocuments({ user: id })
      const totalEvent = await eventModel.countDocuments({ createdBy: id })
      const totalOrganizationEvent = await organizationModel.countDocuments({ createdBy: id })
      console.log(totalPost, "====== totalPost======");

      if (!getUserDetails) {
        return res
          .status(BAD_REQUEST)
          .json({ status: 0, message: "User details not found" });
      }
      console.log(getUserRequest, "======== getUserRequest?.data ===========");

      return res.status(OK).json({
        status: 1,
        message: "User details retrieved successfully",
        data: {
          ...getUserDetails.data,
          isFollower: getUserFollow?.data?.map(data => data.followers?.toString())?.includes(id) ? true : false,
          isFollowing: getUserFollowing?.data?.map(data => data.following?.toString())?.includes(id) ? true : false,
          requested: getUserRequest?.data ? true : false,
          isRequestedByMe: getUserRequest?.data?.fromUser?.toString() === user?.id ? true : false,
          requestedId: getUserRequest?.data?._id || "",
          followers: totalFollowers,
          followings: totalFollowings,
          totalPost: +totalPost + +totalEvent + +totalOrganizationEvent,
          isMyProfile: user.id.toString() == id ? true : false
        },
      });
    } catch (error) {
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json({ status: 0, message: commonMessages.INTERNAL_SERVER_ERROR });
    }
  },
  getMemberList: async (req, res) => {
    try {
      const user = req.user;
      const { page, size } = req.query;
      console.log(user.id, "=========== user.id ===========");
      console.log(user.blockedUser, "=========== user.blockedUser ===========");

      const getMemberList = await commonQuery(
        userModel,
        find,
        { _id: { $nin: [user.id, ...user.blockedUser] }, isActive: true },
        {},
        "-password -token",
        null,
        size,
        page
      );
      if (!getMemberList) {
        return res
          .status(BAD_REQUEST)
          .json({ status: 0, message: "Member not found" });
      }
      return res.status(OK).json({
        status: 1,
        message: "Member found successfully",
        data: getMemberList.data,
      });
    } catch (error) {
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json({ status: 0, message: commonMessages.INTERNAL_SERVER_ERROR });
    }
  },
  getAllMemberList: async (req, res) => {
    try {
      const user = req.user;
      const { search } = req.query;
      const getMemberList = await commonQuery(userModel, find, { _id: { $nin: [user.id, ...user.blockedUser] }, isActive: true, $or: [{ firstName: RegExp(search, "i") }, { lastName: RegExp(search, "i") }] }, {}, "firstName lastName profileImg address");
      if (!getMemberList) {
        return res
          .status(BAD_REQUEST)
          .json({ status: 0, message: "No users found" });
      }
      return res.status(OK).json({
        status: 1,
        message: "All users found successfully",
        data: getMemberList.data,
      });
    } catch (error) {
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json({ status: 0, message: commonMessages.INTERNAL_SERVER_ERROR });
    }
  },

  eventDetails: async (req, res) => {
    try {
      const user = req.user;
      const id = req.query.id;
      const eventPost = await commonQuery(eventModel, findOne, { _id: id }, {});
      if (!eventPost) {
        return res
          .status(BAD_REQUEST)
          .json({ status: 0, message: "Event details not found" });
      }

      return res.status(OK).json({
        status: 1,
        message: "Event details retrieved successfully",
        data: { ...eventPost.data, isMyEvent: eventPost?.data?.createdBy.toString() == user.id ? true : false },
      });
    } catch (error) {
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json({ status: 0, message: commonMessages.INTERNAL_SERVER_ERROR });
    }
  },

  organizationEventDetails: async (req, res) => {
    try {
      const user = req.user;
      const id = req.query.id;
      // const findOrganization = await commonQuery(organizationListModel, findOne, { createdBy: user.id, status: "accept" })
      // if (!findOrganization.data) {
      //   return res
      //     .status(BAD_REQUEST)
      //     .json({ status: 0, message: "You have not created an organization event" });
      // }
      const eventPost = await commonQuery(
        organizationModel,
        findOne,
        { _id: id },
        {}
      );
      if (!eventPost) {
        return res
          .status(BAD_REQUEST)
          .json({ status: 0, message: "Event details not found" });
      }

      return res.status(OK).json({
        status: 1,
        message: "Organization event details retrieved successfully",
        data: { ...eventPost.data, isMyEvent: eventPost?.data?.createdBy.toString() == user.id ? true : false },
      });
    } catch (error) {
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json({ status: 0, message: commonMessages.INTERNAL_SERVER_ERROR });
    }
  },

  postDetails: async (req, res) => {
    try {
      const user = req.user;
      const id = req.query.id;
      const eventPost = await commonQuery(postModel, findOne, { _id: id }, {}, "", { path: "user", select: "firstName lastName email profileImg address" });
      if (!eventPost) {
        return res
          .status(BAD_REQUEST)
          .json({ status: 0, message: "Post details not found" });
      }

      return res.status(OK).json({
        status: 1,
        message: "Post details retrieved successfully",
        data: { ...eventPost.data, isMyPost: eventPost?.data?.user.toString() == user.id ? true : false },
      });
    } catch (error) {
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json({ status: 0, message: commonMessages.INTERNAL_SERVER_ERROR });
    }
  },

  createPost: async (req, res) => {
    try {
      const user = req.user;
      const file = req.files;
      if (!req.body.description) {
        return res
          .status(BAD_REQUEST)
          .json({ status: 0, message: "Post creation failed" });
      }
      const input = {
        description: req.body.description,
        title: req.body.title,
        user: user.id,
      };

      if (file.postImage) {
        input.postImg = `${IMAGE_URL}/post/${file.postImage[0].filename}`;
      }
      const createEventPost = await commonQuery(postModel, create, input);
      if (!createEventPost) {
        return res
          .status(BAD_REQUEST)
          .json({ status: 0, message: "Post creation failed" });
      }
      const findToUser = await commonQuery(followerModel, find, { users: user.id }, {}, "followers")
      const followerArray = findToUser.data.map((_data) => _data.followers)
      const findAllFollower = await commonQuery(userModel, find, { _id: { $in: followerArray } }, {}, "_id fcmToken")
      const followerFcmArray = findAllFollower.data.map((_data) => _data.fcmToken).filter((_filterData) => _filterData !== "")

      const notification = await sendNotification("New Post", `${user.firstName} ${user.lastName} has shared a new post on their account`, "", followerFcmArray)
      await commonQuery(notificationModel, create, { description: `${user.firstName} ${user.lastName} has shared a new post on their account`, type: "create-post", user: findToUser.data._id });
      return res
        .status(OK)
        .json({ status: 1, message: "Post created successfully" });
    } catch (error) {
      console.log(error, "======= error ====");
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json({ status: 0, message: commonMessages.INTERNAL_SERVER_ERROR });
    }
  },

  editPost: async (req, res) => {
    try {
      const user = req.user;
      const file = req.files;
      const { id } = req.query; // Get the post ID from the query params

      if (!id) {
        return res
          .status(BAD_REQUEST)
          .json({ status: 0, message: "Post update failed: Missing post ID" });
      }

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res
          .status(BAD_REQUEST)
          .json({ status: 0, message: "Invalid ID format" });
      }

      // Find the post to update
      const post = await commonQuery(postModel, findOne, { _id: id, user: user.id });

      if (!post) {
        return res
          .status(BAD_REQUEST)
          .json({ status: 0, message: "Post not found or user is not authorized to edit this post" });
      }

      // Build the update object dynamically
      const updatedInput = {};

      // Add fields to update only if they exist in the request body
      if (req.body.description) updatedInput.description = req.body.description;
      if (req.body.title) updatedInput.title = req.body.title;

      // If a new post image is uploaded, update the image URL
      if (file && file.postImage) {
        updatedInput.postImg = `${IMAGE_URL}/post/${file.postImage[0].filename}`;
      }

      // Ensure at least one field is updated
      if (Object.keys(updatedInput).length === 0) {
        return res
          .status(BAD_REQUEST)
          .json({ status: 0, message: "No fields to update" });
      }

      // Perform the update
      const updatedPost = await commonQuery(
        postModel,
        findOneAndUpdate,
        { _id: id },
        { $set: updatedInput }
      );


      console.log(updatedPost);

      if (!updatedPost) {
        return res
          .status(BAD_REQUEST)
          .json({ status: 0, message: "Post update failed" });
      }

      return res
        .status(OK)
        .json({ status: 1, message: "Post updated successfully", data: updatedPost });
    } catch (error) {
      console.error(error, "======= error ====");
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json({ status: 0, message: commonMessages.INTERNAL_SERVER_ERROR });
    }
  },

  deletePost: async (req, res) => {
    try {
      const user = req.user;
      const { id } = req.query;  // Get the post ID from the query params


      if (!id) {
        return res
          .status(BAD_REQUEST)
          .json({ status: 0, message: "Post deletion failed: Post ID is required" });
      }

      // Find the post to delete
      const post = await commonQuery(postModel, findOne, { _id: id, user: user.id });

      if (!post) {
        return res
          .status(BAD_REQUEST)
          .json({ status: 0, message: "Post not found or user is not authorized to delete this post" });
      }

      // Perform the delete operation
      const deletedPost = await commonQuery(postModel, findOneAndDelete, { _id: id });

      if (!deletedPost) {
        return res
          .status(BAD_REQUEST)
          .json({ status: 0, message: "Post deletion failed" });
      }

      return res
        .status(OK)
        .json({ status: 1, message: "Post deleted successfully" });

    } catch (error) {
      console.log(error, "======= error ====");
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json({ status: 0, message: commonMessages.INTERNAL_SERVER_ERROR });
    }
  },

  createEvent: async (req, res) => {
    try {
      const user = req.user;
      const file = req.files;
      if (!req.body.longitude || !req.body.latitude || !req.body.title) {
        return res
          .status(BAD_REQUEST)
          .json({ status: 0, message: "Event creation failed" });
      }
      const input = {
        title: req.body.title,
        description: req.body.description?.split(","),
        address: req.body.address,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        location: {
          type: "Point",
          coordinates: [+req.body.longitude, +req.body.latitude],
        },
        zipCode: req.body.zipCode,
        city: req.body.city,
        state: req.body.state,
        country: req.body.country,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        members: req?.body?.members?.split(","),
        createdBy: user.id,
      };

      if (file.eventImage) {
        input.eventImg = `${IMAGE_URL}/event/${file.eventImage[0].filename}`;
      }
      const createEventPost = await commonQuery(eventModel, create, input);
      if (!createEventPost) {
        return res
          .status(BAD_REQUEST)
          .json({ status: 0, message: "Event creation failed" });
      }

      const findToUser = await commonQuery(followerModel, find, { users: user.id }, {}, "followers")
      const followerArray = findToUser.data.map((_data) => _data.followers)
      const findAllFollower = await commonQuery(userModel, find, { _id: { $in: followerArray } }, {}, "_id fcmToken")
      const followerFcmArray = findAllFollower.data.map((_data) => _data.fcmToken).filter((_filterData) => _filterData !== "")

      const notification = await sendNotification("New Event", `${user.firstName} ${user.lastName} has shared a new event on their account`, "", followerFcmArray)
      findToUser.data.map(async (_data) => {

        await commonQuery(notificationModel, create, { description: `${user.firstName} ${user.lastName} has shared a new event on their account`, type: "create-event", user: _data._id, fromUser: user.id });
      })
      return res
        .status(OK)
        .json({ status: 1, message: "Event created successfully" });
    } catch (error) {
      console.log(error, "======= error ====");
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json({ status: 0, message: commonMessages.INTERNAL_SERVER_ERROR });
    }
  },

  editEvent: async (req, res) => {
    try {
      const file = req.files;
      const user = req.user;
      const { id } = req.query;

      if (!id) {
        return res
          .status(BAD_REQUEST)
          .json({ status: 0, message: "Event ID is required for update" });
      }

      // Validate if ID is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res
          .status(BAD_REQUEST)
          .json({ status: 0, message: "Invalid Event ID format" });
      }

      // Build the update object dynamically
      const updateData = {};

      if (req.body.title) updateData.title = req.body.title;
      if (req.body.description) updateData.description = req.body.description.split(",");
      if (req.body.address) updateData.address = req.body.address;

      // Validate and include latitude/longitude if provided
      if (req.body.latitude && req.body.longitude) {
        const latitude = parseFloat(req.body.latitude);
        const longitude = parseFloat(req.body.longitude);

        if (isNaN(latitude) || isNaN(longitude)) {
          return res
            .status(BAD_REQUEST)
            .json({ status: 0, message: "Invalid latitude or longitude values" });
        }

        if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
          return res
            .status(BAD_REQUEST)
            .json({ status: 0, message: "Latitude must be between -90 and 90, and longitude must be between -180 and 180" });
        }

        updateData.latitude = latitude;
        updateData.longitude = longitude;
        updateData.location = {
          type: "Point",
          coordinates: [longitude, latitude], // [lng, lat]
        };
      }

      if (req.body.zipCode) updateData.zipCode = req.body.zipCode;
      if (req.body.city) updateData.city = req.body.city;
      if (req.body.state) updateData.state = req.body.state;
      if (req.body.country) updateData.country = req.body.country;
      if (req.body.startDate) updateData.startDate = req.body.startDate;
      if (req.body.endDate) updateData.endDate = req.body.endDate;
      if (req.body.members) updateData.members = req.body.members.split(",");

      updateData.updatedBy = user.id;

      // Include event image if uploaded
      if (file && file.eventImage) {
        updateData.eventImg = `${IMAGE_URL}/event/${file.eventImage[0].filename}`;
      }

      // Perform the update
      const updatedEvent = await commonQuery(eventModel, findOneAndUpdate, { _id: id }, { $set: updateData });

      if (!updatedEvent) {
        return res
          .status(BAD_REQUEST)
          .json({ status: 0, message: "Event not updated" });
      }

      return res
        .status(OK)
        .json({ status: 1, message: "Event updated successfully", data: updatedEvent });
    } catch (error) {
      console.error("Error in editEvent:", error);
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json({ status: 0, message: commonMessages.INTERNAL_SERVER_ERROR });
    }
  },

  deleteEvent: async (req, res) => {
    try {
      const { id } = req.query;

      const deleteItem = await commonQuery(eventModel, findOneAndDelete, { _id: id });

      if (!deleteItem) {
        return res
          .status(BAD_REQUEST)
          .json({ status: 0, message: "Event not found or deletion failed" });
      }

      return res
        .status(OK)
        .json({ status: 1, message: "Event deleted successfully" });

    } catch (error) {
      console.log(error, "========= error =========");
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json({ status: 0, message: commonMessages.INTERNAL_SERVER_ERROR });
    }
  },


  //   createEvent: async (req, res) => {
  //     try {
  //       const user = req.user;
  //       const file = req.files;

  //       const input = {
  //         eventImg: req.body.eventImg,
  //         title: req.body.title,
  //         description: req.body.description,
  //         address: req.body.address,
  //         latitude: req.body.latitude,
  //         longitude: req.body.longitude,
  //         location: {
  //           type: "Point",
  //           coordinates: [+req.body.longitude, +req.body.latitude],
  //         },
  //         zipCode: req.body.zipCode,
  //         city: req.body.city,
  //         state: req.body.state,
  //         country: req.body.country,
  //         startDate: req.body.startDate,
  //         endDate: req.body.endDate,
  //         members: req.body.members,
  //         createdBy: user.id,
  //       };

  //       if (file.eventImage) {
  //         input.eventImg = `${IMAGE_URL}/event/${file.eventImage[0].filename}`;
  //       }
  //       const createEventPost = await commonQuery(eventModel, create, input);
  //       if (!createEventPost) {
  //         return res
  //           .status(BAD_REQUEST)
  //           .json({ status: 0, message: "Event not created" });
  //       }

  //       return res
  //         .status(OK)
  //         .json({ status: 1, message: "Event created successfully" });
  //     } catch (error) {
  //       return res
  //         .status(INTERNAL_SERVER_ERROR)
  //         .json({ status: 0, message: commonMessages.INTERNAL_SERVER_ERROR });
  //     }
  //   },

  registerOrganization: async (req, res) => {
    try {
      const user = req.user;
      const file = req.files;
      if (!req.body.firstName || !req.body.lastName) {
        return res
          .status(BAD_REQUEST)
          .json({ status: 0, message: "Organization is not registered" });
      }
      const findOrganization = await commonQuery(organizationListModel, findOne, { createdBy: user.id });
      if (findOrganization.data && findOrganization.data.status === 'accept') {
        return res
          .status(BAD_REQUEST)
          .json({ status: 0, message: "Your organization is already verified" });
      }
      if (findOrganization.data && findOrganization.data.status === 'pending') {
        return res
          .status(BAD_REQUEST)
          .json({ status: 0, message: "You have already sent a request for verification" });
      }

      const input = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        createdBy: user.id,
      };

      if (file.documentImage) {
        input.organizationDocument = `${IMAGE_URL}/doc/${file.documentImage[0].filename}`;
      }
      const createOrganization = await commonQuery(organizationListModel, create, input);
      if (!createOrganization.data) {
        return res
          .status(BAD_REQUEST)
          .json({ status: 0, message: "Organization is not registered" });
      }

      return res
        .status(OK)
        .json({ status: 1, message: "Organization registered successfully" });
    } catch (error) {
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json({ status: 0, message: commonMessages.INTERNAL_SERVER_ERROR });
    }
  },

  getOrganization: async (req, res) => {
    try {
      const user = req.user;

      const findOrganization = await commonQuery(organizationListModel, findOne, { createdBy: user.id }, { createdAt: -1 });
      if (!findOrganization.data) {
        return res
          .status(BAD_REQUEST)
          .json({ status: 0, message: "Organization not found" });
      }

      return res
        .status(OK)
        .json({ status: 1, message: "Organization retrieved successfully", data: findOrganization.data });
    } catch (error) {
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json({ status: 0, message: commonMessages.INTERNAL_SERVER_ERROR });
    }
  },

  getEvent: async (req, res) => {
    try {
      const user = req.user;
      const { id, page, size } = req.query
      const getUserFollowing = await commonQuery(followingModel, find, { users: user.id });

      const findEvent = await commonQuery(eventModel, find, { createdBy: id }, { createdAt: -1 }, "", { path: "createdBy", select: "profileImg firstName lastName email _id address" }, size, page);
      const findOrganizationEvent = await commonQuery(organizationModel, find, { createdBy: id }, { createdAt: -1 }, "", { path: "createdBy", select: "profileImg firstName lastName email _id address" }, size, page);
      let newArray = [...findEvent.data, ...findOrganizationEvent.data]
      const countEvent = await commonQuery(eventModel, countDocuments, { createdBy: id });
      const countOrganizationEvent = await commonQuery(organizationModel, countDocuments, { createdBy: id });
      // console.log(findEvent.data, "======= findEvent.data ==========");
      // console.log(findOrganizationEvent.data, "======= findOrganizationEvent.data ==========");
      // console.log(newArray, "======= newArray ==========");

      // if (!newArray?.length) {
      //   return res
      //     .status(BAD_REQUEST)
      //     .json({ status: 0, message: "Event not found" });
      // }

      newArray = await Promise.all(newArray?.map(async (_data) => {
        const countData = await commonQuery(commentModel, countDocuments, { post: _data?._id })
        const likeCountData = await commonQuery(likeModel, findOne, { post: _data?._id })
        return {
          ..._data,
          commentCount: countData.data || 0,
          likeCount: likeCountData?.data?.users?.length || 0,
          isLike: likeCountData?.data?.users?.toString()?.includes(user._id.toString()) ? true : false,
          isFollow: getUserFollowing?.data?.length ? getUserFollowing?.data?.filter(data => data.following)?.toString()?.includes(user._id.toString()) ? true : false : false,
          isMyEvent: _data.createdBy._id.toString() == user.id ? true : false,
          isOrganizationEvent: false
        }
      }))


      return res
        .status(OK)
        .json({ status: 1, message: "Event retrieved successfully", data: newArray, page: +page, total: +countEvent.data || 0 + +countOrganizationEvent.data || 0 });
    } catch (error) {
      console.log(error, "========= error ==========");

      return res
        .status(INTERNAL_SERVER_ERROR)
        .json({ status: 0, message: commonMessages.INTERNAL_SERVER_ERROR });
    }
  },

  getOrganizationEvent: async (req, res) => {
    try {
      const user = req.user;
      const { id, page, size } = req.query
      const getUserFollowing = await commonQuery(followingModel, find, { users: user.id });

      const findEvent = await commonQuery(organizationModel, find, { createdBy: id }, { createdAt: -1 }, "", null, size, page);
      if (!findEvent.data) {
        return res
          .status(BAD_REQUEST)
          .json({ status: 0, message: "Organization event not found" });
      }
      findEvent.data = await Promise.all(findEvent.data?.map(async (_data) => {
        const countData = await commonQuery(commentModel, countDocuments, { post: _data?._id })
        const likeCountData = await commonQuery(likeModel, findOne, { post: _data?._id })

        return {
          ..._data,
          commentCount: countData.data || 0,
          likeCount: likeCountData?.data?.users?.length || 0,
          isLike: likeCountData?.data?.users?.toString()?.includes(user._id.toString()) ? true : false,
          isMyEvent: _data.createdBy._id.toString() == user.id ? true : false,
          isOrganizationEvent: true
        }
      }))
      return res
        .status(OK)
        .json({ status: 1, message: "Organization event retrieved successfully", data: findEvent.data });
    } catch (error) {
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json({ status: 0, message: commonMessages.INTERNAL_SERVER_ERROR });
    }
  },

  createOrganizationEvent: async (req, res) => {
    try {
      const user = req.user;
      const file = req.files;
      if (!req.body.longitude || !req.body.latitude || !req.body.title) {
        return res
          .status(BAD_REQUEST)
          .json({ status: 0, message: "Organization event not created" });
      }
      if (!user.isOrganization) {
        return res
          .status(BAD_REQUEST)
          .json({ status: 0, message: "Your organization in not verified" });
      }
      const input = {
        title: req.body.title,
        description: req.body.description,
        address: req.body.address,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        location: {
          type: "Point",
          coordinates: [+req.body.longitude, +req.body.latitude],
        },
        zipCode: req.body.zipCode,
        city: req.body.city,
        state: req.body.state,
        country: req.body.country,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        createdBy: user.id,
      };

      if (file.eventImage) {
        input.eventImg = `${IMAGE_URL}/event/${file.eventImage[0].filename}`;
      }
      const createEventPost = await commonQuery(
        organizationModel,
        create,
        input
      );
      if (!createEventPost.data) {
        return res
          .status(BAD_REQUEST)
          .json({ status: 0, message: "Organization event not created" });
      }

      return res
        .status(OK)
        .json({ status: 1, message: "Organization event created successfully" });
    } catch (error) {
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json({ status: 0, message: commonMessages.INTERNAL_SERVER_ERROR });
    }
  },

  // mapPageEventList: async (req, res) => {
  //   try {
  //     const user = req.user;
  //     const getUserFollowing = await commonQuery(followingModel, find, { users: user.id });

  //     let organizationEventList = await organizationModel.aggregate([
  //       {
  //         $geoNear: {
  //           near: {
  //             type: "Point",
  //             coordinates: user.location.coordinates,
  //           },
  //           distanceField: "distance",
  //           spherical: true,
  //           minDistance: 0,
  //         },
  //       },
  //       { $addFields: { distanceInKilomiters: { $divide: ["$distance", 1000] } } },
  //       { $match: { createdBy: { $nin: user.blockedUser }, isActive: true } },
  //       { $lookup: { from: "users", localField: "createdBy", foreignField: "_id", as: "createdBy", pipeline: [{ $project: { profileImg: 1, firstName: 1, lastName: 1, email: 1 } }] } },
  //       { $unwind: { path: "$createdBy", preserveNullAndEmptyArrays: true } },
  //       { $match: { createdBy: { $ne: null } } }
  //     ]);
  //     let eventList = await eventModel.aggregate([
  //       {
  //         $geoNear: {
  //           near: {
  //             type: "Point",
  //             coordinates: user.location.coordinates,
  //           },
  //           distanceField: "distance",
  //           spherical: true,
  //           minDistance: 0,
  //         },
  //       },
  //       { $addFields: { distanceInKilomiters: { $divide: ["$distance", 1000] } } },
  //       { $match: { members: { $in: [new mongoose.Types.ObjectId(user.id)] }, createdBy: { $nin: user.blockedUser }, isActive: true } },
  //       { $lookup: { from: "users", localField: "createdBy", foreignField: "_id", as: "createdBy", pipeline: [{ $project: { profileImg: 1, firstName: 1, lastName: 1, email: 1, address: 1 } }] } },
  //       { $unwind: { path: "$createdBy", preserveNullAndEmptyArrays: true } },
  //       { $match: { createdBy: { $ne: null } } }
  //     ]);
  //     // console.log(eventList, "============ eventList =========");
  //     // console.log(user.id, "============ user.id =========");


  //     eventList = await Promise.all(eventList?.map(async (_data) => {
  //       const countData = await commonQuery(commentModel, countDocuments, { post: _data?._id })
  //       const likeCountData = await commonQuery(likeModel, findOne, { post: _data?._id })
  //       return {
  //         ..._data,
  //         commentCount: countData.data || 0,
  //         likeCount: likeCountData?.data?.users?.length || 0,
  //         isLike: likeCountData?.data?.users?.toString()?.includes(user._id.toString()) ? true : false,
  //         isFollow: getUserFollowing?.data?.filter(data => data.following)?.toString()?.includes(user._id.toString()) ? true : false,
  //       }
  //     }))
  //     organizationEventList = await Promise.all(organizationEventList?.map(async (_data) => {
  //       const countData = await commonQuery(commentModel, countDocuments, { post: _data?._id })
  //       const likeCountData = await commonQuery(likeModel, findOne, { post: _data?._id })

  //       return {
  //         ..._data,
  //         commentCount: countData.data || 0,
  //         likeCount: likeCountData?.data?.users?.length || 0,
  //         isLike: likeCountData?.data?.users?.toString()?.includes(user._id.toString()) ? true : false,
  //       }
  //     }))


  //     return res.status(OK).json({
  //       status: 1,
  //       message: "Event retrieved successfully",
  //       data: [...organizationEventList, ...eventList],
  //     });
  //   } catch (error) {
  //     console.log(error, "========= error ========= 111111111");
  //     return res
  //       .status(INTERNAL_SERVER_ERROR)
  //       .json({ status: 0, message: commonMessages.INTERNAL_SERVER_ERROR });
  //   }
  // },



  mapPageEventList: async (req, res) => {
    try {
      // Extract filters and search parameter from query parameters
      const { userId, isActive, search } = req.query;

      // Log filters for debugging
      console.log("userId:", userId);
      console.log("isActive:", isActive);
      console.log("search:", search);

      // Validate userId if provided
      if (userId && !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ status: 0, message: "Invalid userId format" });
      }

      // Additional filters array
      const additionalFilters = [];
      if (userId) {
        additionalFilters.push({ createdBy: new mongoose.Types.ObjectId(userId) });
      }
      if (isActive) {
        additionalFilters.push({ isActive: isActive === "true" });
      }
      if (search) {
        // Add case-insensitive search for name or description
        additionalFilters.push({
          $or: [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
          ],
        });
      }

      // Fetch organization events
      let organizationEventList = await organizationModel.aggregate([
        {
          $match: {
            ...(additionalFilters.length ? { $and: additionalFilters } : {}),
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "createdBy",
            foreignField: "_id",
            as: "createdBy",
            pipeline: [{ $project: { profileImg: 1, firstName: 1, lastName: 1, email: 1 } }],
          },
        },
        { $unwind: { path: "$createdBy", preserveNullAndEmptyArrays: true } },
        { $match: { createdBy: { $ne: null } } },
      ]);

      console.log("organizationEventList:", organizationEventList);

      // Fetch individual events
      let eventList = await eventModel.aggregate([
        {
          $geoNear: {
            near: { type: "Point", coordinates: [0, 0] }, // Placeholder coordinates if not needed
            distanceField: "distance",
            spherical: true,
            minDistance: 0,
          },
        },
        { $addFields: { distanceInKilomiters: { $divide: ["$distance", 1000] } } },
        {
          $match: {
            ...(additionalFilters.length ? { $and: additionalFilters } : {}),
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "createdBy",
            foreignField: "_id",
            as: "createdBy",
            pipeline: [{ $project: { profileImg: 1, firstName: 1, lastName: 1, email: 1, address: 1 } }],
          },
        },
        { $unwind: { path: "$createdBy", preserveNullAndEmptyArrays: true } },
        { $match: { createdBy: { $ne: null } } },
      ]);

      console.log("eventList:", eventList);

      // Enrich eventList with additional data
      eventList = await Promise.all(
        eventList.map(async (event) => {
          const commentCount = await commentModel.countDocuments({ post: event._id });
          const likeData = await likeModel.findOne({ post: event._id });
          const likeCount = likeData?.users?.length || 0;

          return {
            ...event,
            commentCount,
            likeCount,
          };
        })
      );

      // Enrich organizationEventList with additional data
      organizationEventList = await Promise.all(
        organizationEventList.map(async (event) => {
          const commentCount = await commentModel.countDocuments({ post: event._id });
          const likeData = await likeModel.findOne({ post: event._id });
          const likeCount = likeData?.users?.length || 0;

          return {
            ...event,
            commentCount,
            likeCount,
          };
        })
      );

      // Combine and return the results
      return res.status(200).json({
        status: 1,
        message: "Events retrieved successfully",
        data: [...organizationEventList, ...eventList],
      });
    } catch (error) {
      console.error("Error in mapPageEventList:", error);
      return res.status(500).json({ status: 0, message: "Internal server error" });
    }
  },




  blockUser: async (req, res) => {
    try {
      const user = req.user;
      const { userId } = req.body;
      let blockUser;
      if (user.blockedUser.toString().includes(userId)) {
        blockUser = await commonQuery(
          userModel,
          findOneAndUpdate,
          { _id: user.id },
          { $pull: { blockedUser: userId } }
        );
      } else {
        blockUser = await commonQuery(
          userModel,
          findOneAndUpdate,
          { _id: user.id },
          { $push: { blockedUser: userId } }
        );
      }

      if (!blockUser.data) {
        return res
          .status(BAD_REQUEST)
          .json({ status: 0, message: "User not block" });
      }

      return res
        .status(OK)
        .json({ status: 1, message: "User updated successfully" });
    } catch (error) {
      console.log(error, "========= error =========");
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json({ status: 0, message: commonMessages.INTERNAL_SERVER_ERROR });
    }
  },

  reportUser: async (req, res) => {
    try {
      const user = req.user;
      const input = {
        reportedUser: req.body.reportedUser,
        users: user.id,
        reason: req.body.reason,
      };
      const reportUser = await commonQuery(reportModel, create, input);
      console.log(reportUser, "====== reportUser==========");
      if (reportUser.status !== 1) {
        return res
          .status(BAD_REQUEST)
          .json({ status: 0, message: "User not reported" });
      }

      return res
        .status(OK)
        .json({ status: 1, message: "User reported successfully" });
    } catch (error) {
      console.log(error, "========= error =========");
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json({ status: 0, message: commonMessages.INTERNAL_SERVER_ERROR });
    }
  },

  addLikes: async (req, res) => {
    try {
      const user = req.user;
      if (!req.body.post) {
        return res
          .status(BAD_REQUEST)
          .json({ status: 0, message: "Like not added" });
      }
      const input = {
        post: req.body.post,
      };
      const postDertails = await commonQuery(likeModel, findOne, {
        post: input.post,
      });
      let addLikes;
      if (!postDertails.data) {
        const newAddLikes = await commonQuery(likeModel, create, {
          post: input.post,
          users: user.id,
        });
        return res
          .status(OK)
          .json({ status: 1, message: "Like updated successfully" });
      }
      if (postDertails?.data?.users?.toString()?.includes(user.id)) {
        addLikes = await commonQuery(
          likeModel,
          findOneAndUpdate,
          { post: input.post },
          { $pull: { users: user.id } }
        );
      } else {
        addLikes = await commonQuery(
          likeModel,
          findOneAndUpdate,
          { post: input.post },
          { $push: { users: user.id } }
        );
        let findToUser, userId

        const notificationData = await commonQuery(postModel, findOne, { _id: input.post }, {}, "", { path: "user", select: "fcmToken" })
        if (notificationData.status === 1) {
          console.log(notificationData?.data?.user?.fcmToken, "==================0000000000000000");

          findToUser = notificationData?.data?.user?.fcmToken
          userId = notificationData?.data?.user?._id
        } else {
          const notificationData1 = await commonQuery(eventModel, findOne, { _id: input.post }, {}, "", { path: "createdBy", select: "fcmToken" })

          if (notificationData.status === 1) {
            findToUser = notificationData1?.data?.createdBy?.fcmToken
            console.log(notificationData1?.data, "==================11111111111111111111");

            userId = notificationData1?.data?.createdBy?._id
          } else {
            const notificationData2 = await commonQuery(organizationModel, findOne, { _id: input.post }, {}, "", { path: "createdBy", select: "fcmToken" })
            console.log(notificationData2?.data, "==================22222222222222222222222");

            findToUser = notificationData2?.data?.createdBy?.fcmToken
            userId = notificationData2?.data?.createdBy?._id
          }
        }
        console.log(findToUser, "=========== findToUser ============");
        if (user.id !== userId?.toString()) {
          const notification = await sendNotification("Like post", `${user.firstName} ${user.lastName} liked your post`, "", [findToUser])
          await commonQuery(notificationModel, create, { description: `${user.firstName} ${user.lastName} liked your post`, type: "like-post", user: userId, fromUser: user.id });
        }
      }
      if (addLikes.status !== 1) {
        return res
          .status(BAD_REQUEST)
          .json({ status: 0, message: "like not updated" });
      }

      return res
        .status(OK)
        .json({ status: 1, message: "Like updated successfully" });
    } catch (error) {
      console.log(error, "========= error =========");
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json({ status: 0, message: commonMessages.INTERNAL_SERVER_ERROR });
    }
  },

  addCommets: async (req, res) => {
    try {
      const user = req.user;
      if (!req.body.comment || !req.body.post) {
        return res
          .status(BAD_REQUEST)
          .json({ status: 0, message: "Post and comment are required" });
      }
      const input = {
        comment: req.body.comment,
        post: req.body.post,
        users: user.id,
      };
      const addCommets = await commonQuery(commentModel, create, input);
      if (addCommets.status !== 1) {
        return res
          .status(BAD_REQUEST)
          .json({ status: 0, message: "Comment not created" });
      }
      const notificationData = await commonQuery(postModel, findOne, { _id: input.post }, {}, "", { path: "user", select: "fcmToken" })
      if (notificationData.status === 1) {
        findToUser = notificationData?.data?.user?.fcmToken
        userId = notificationData?.data?.user?._id
      } else {
        const notificationData1 = await commonQuery(eventModel, findOne, { _id: input.post }, {}, "", { path: "createdBy", select: "fcmToken" })

        if (notificationData.status === 1) {
          findToUser = notificationData1?.data?.createdBy?.fcmToken
          userId = notificationData1?.data?.createdBy?._id
        } else {
          const notificationData2 = await commonQuery(organizationModel, findOne, { _id: input.post }, {}, "", { path: "createdBy", select: "fcmToken" })
          findToUser = notificationData2?.data?.createdBy?.fcmToken
          userId = notificationData2?.data?.createdBy?._id
        }
      }

      if (user.id !== userId?.toString()) {

        const notification = await sendNotification("Comment post", `${user.firstName} ${user.lastName} commented on your post`, "", [findToUser])
        await commonQuery(notificationModel, create, { description: `${user.firstName} ${user.lastName} commented on your post`, type: "comment-post", user: userId, fromUser: user.id });
      }
      return res
        .status(OK)
        .json({ status: 1, message: "Comment created successfully" });
    } catch (error) {
      console.log(error, "========= error =========");
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json({ status: 0, message: commonMessages.INTERNAL_SERVER_ERROR });
    }
  },

  getComments: async (req, res) => {
    try {
      const user = req.user;
      const { page, size } = req.query;
      const input = {
        post: req.body.post,
      };
      const getComments = await commonQuery(
        commentModel,
        find,
        { post: input.post, isActive: true },
        { createdAt: -1 },
        "",
        { path: "users", select: "profileImg firstName lastName email address" },
        size,
        page
      );
      if (getComments.status !== 1) {
        return res
          .status(BAD_REQUEST)
          .json({ status: 0, message: "Comment not found" });
      }

      return res.status(OK).json({
        status: 1,
        message: "Comment retrieved successfully",
        data: getComments.data,
      });
    } catch (error) {
      console.log(error, "========= error =========");
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json({ status: 0, message: commonMessages.INTERNAL_SERVER_ERROR });
    }
  },

  addEventShareCount: async (req, res) => {
    try {
      const user = req.user;
      const { id } = req.query;
      if (id) {
        return res
          .status(BAD_REQUEST)
          .json({ status: 0, message: "Event is required" });
      }

      const addShareCount = await commonQuery(eventModel, findOneAndUpdate, { _id: id }, { $inc: { shareCount: 1 } },);
      if (!addShareCount) {
        return res
          .status(BAD_REQUEST)
          .json({ status: 0, message: "Share count not updated" });
      }

      return res.status(OK).json({
        status: 1,
        message: "Share count updated successfully",
      });
    } catch (error) {
      console.log(error, "========= error =========");
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json({ status: 0, message: commonMessages.INTERNAL_SERVER_ERROR });
    }
  },

  addOrganizationShareCount: async (req, res) => {
    try {
      const user = req.user;
      const { id } = req.query;
      if (id) {
        return res
          .status(BAD_REQUEST)
          .json({ status: 0, message: "Organization event is required" });
      }
      const addShareCount = await commonQuery(organizationModel, findOneAndUpdate, { _id: id }, { $inc: { shareCount: 1 } },);
      if (!addShareCount) {
        return res
          .status(BAD_REQUEST)
          .json({ status: 0, message: "Share count not updated" });
      }

      return res.status(OK).json({
        status: 1,
        message: "Share count updated successfully",
      });
    } catch (error) {
      console.log(error, "========= error =========");
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json({ status: 0, message: commonMessages.INTERNAL_SERVER_ERROR });
    }
  },

  addPostShareCount: async (req, res) => {
    try {
      const user = req.user;
      const { id } = req.query;
      if (id) {
        return res
          .status(BAD_REQUEST)
          .json({ status: 0, message: "Post is required" });
      }
      const addShareCount = await commonQuery(postModel, findOneAndUpdate, { _id: id }, { $inc: { shareCount: 1 } },);
      if (!addShareCount) {
        return res
          .status(BAD_REQUEST)
          .json({ status: 0, message: "Share count not updated" });
      }

      return res.status(OK).json({
        status: 1,
        message: "Share count updated successfully",
      });
    } catch (error) {
      console.log(error, "========= error =========");
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json({ status: 0, message: commonMessages.INTERNAL_SERVER_ERROR });
    }
  },

  sendFollowRequest: async (req, res) => {
    try {
      const user = req.user;
      const { toUser } = req.query;

      const findToUser = await commonQuery(userModel, findOne, { _id: toUser })
      if (findToUser.status !== 1) {
        return res
          .status(BAD_REQUEST)
          .json({ status: 0, message: "The requested user does not exist" });
      }

      const findRequest = await commonQuery(requestModel, findOne, { toUser, fromUser: user._id, $or: [{ status: "pending" }, { status: "accept" }] });
      if (findRequest.status === 1) {
        return res
          .status(BAD_REQUEST)
          .json({ status: 0, message: "You have already sent a friend request" });
      }
      const createRequest = await commonQuery(requestModel, create, { toUser, fromUser: user._id });
      if (createRequest.status !== 1) {
        return res
          .status(BAD_REQUEST)
          .json({ status: 0, message: "Request not created" });
      }

      console.log(findToUser.data, "======= findToUser =======");

      const notification = await sendNotification("Friend Request", `You received a friend request from ${user.firstName} ${user.lastName}`, createRequest.data._id.toString(), [findToUser.data.fcmToken])
      await commonQuery(notificationModel, create, { description: `You received a friend request from ${user.firstName} ${user.lastName}`, type: "friend-request", requestId: createRequest.data._id, user: findToUser.data._id, fromUser: user.id });

      return res.status(OK).json({
        status: 1,
        message: "Request created successfully",
      });
    } catch (error) {
      console.log(error, "========= error =========");
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json({ status: 0, message: commonMessages.INTERNAL_SERVER_ERROR });
    }
  },

  getFollowRequest: async (req, res) => {
    try {
      const user = req.user;
      const { toUser } = req.query;

      const findRequest = await commonQuery(requestModel, find, { toUser: user._id, status: "pending" }, { createdAt: -1 }, "", { path: "fromUser", select: "profileImg lastName firstName email address" });

      return res
        .status(OK)
        .json({ status: 1, message: "Request found successfully", data: findRequest || [] });

    } catch (error) {
      console.log(error, "========= error =========");
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json({ status: 0, message: commonMessages.INTERNAL_SERVER_ERROR });
    }
  },

  cancelFollowRequest: async (req, res) => {
    try {
      const user = req.user;
      const { id } = req.query;

      // const findRequest = await commonQuery(requestModel, find, { toUser: user._id, status: "pending" }, { createdAt: -1 }, "", { path: "fromUser", select: "profileImg lastName firstName email address" });
      const deleteRequest = await commonQuery(requestModel, findOneAndDelete, { _id: id, status: "pending" });
      if (!deleteRequest) {
        return res
          .status(BAD_REQUEST)
          .json({ status: 0, message: "Request not canceled" });
      }
      return res
        .status(OK)
        .json({ status: 1, message: "Request canceled successfully" });

    } catch (error) {
      console.log(error, "========= error =========");
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json({ status: 0, message: commonMessages.INTERNAL_SERVER_ERROR });
    }
  },

  updateFollowRequest: async (req, res) => {
    try {
      const user = req.user;
      const { id, status } = req.body;

      const findRequest = await commonQuery(requestModel, findOne, { _id: id });
      if (findRequest.status !== 1) {
        return res
          .status(BAD_REQUEST)
          .json({ status: 0, message: "Request not found" });
      }
      if (findRequest.data.status === 'accept') {
        return res
          .status(BAD_REQUEST)
          .json({ status: 0, message: "You are already friends" });
      }
      const updateRequest = await commonQuery(requestModel, findOneAndUpdate, { _id: id }, { status });
      if (updateRequest.status !== 1) {
        return res
          .status(BAD_REQUEST)
          .json({ status: 0, message: "Request not updated" });
      }
      const findToUser = await commonQuery(userModel, findOne, { _id: findRequest.data.fromUser })
      if (status === 'accept') {
        await commonQuery(followerModel, create, { users: user._id, followers: findRequest.data.fromUser })
        await commonQuery(followingModel, create, { following: user._id, users: findRequest.data.fromUser })

        const notification = await sendNotification("Accept Friend Request", `${user.firstName} ${user.lastName} accept your friend request`, "", [findToUser?.data?.fcmToken])
        await commonQuery(notificationModel, create, { description: `You got friend from ${user.firstName} ${user.lastName}`, type: "friend-accept", user: findToUser.data._id, fromUser: user.id });
        await commonQuery(notificationModel, findOneAndUpdate, { requestId: id }, { type: "friend-accept" });
      } else {

        await commonQuery(notificationModel, create, { description: `You got friend from ${user.firstName} ${user.lastName}`, type: "friend-reject", user: findToUser.data._id, fromUser: user.id });
        await commonQuery(notificationModel, findOneAndDelete, { requestId: id });

      }
      return res.status(OK).json({
        status: 1,
        message: status === 'accept' ? "Request accepted" : "Request rejected",
      });
    } catch (error) {
      console.log(error, "========= error =========");
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json({ status: 0, message: commonMessages.INTERNAL_SERVER_ERROR });
    }
  },

  unFollowRequest: async (req, res) => {
    try {
      const user = req.user;
      const { toUser } = req.body;

      await commonQuery(followerModel, findOneAndDelete, { followers: user._id, users: toUser })
      await commonQuery(followingModel, findOneAndDelete, { users: user._id, following: toUser })

      await commonQuery(requestModel, findOneAndUpdate, { toUser, fromUser: user._id, $or: [{ status: "accept" }] }, { status: "reject" });
      await commonQuery(requestModel, findOneAndUpdate, { toUser: user._id, fromUser: toUser, $or: [{ status: "accept" }] }, { status: "reject" });

      return res.status(OK).json({
        status: 1,
        message: "User unfollowed successfully",
      });
    } catch (error) {
      console.log(error, "========= error =========");
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json({ status: 0, message: commonMessages.INTERNAL_SERVER_ERROR });
    }
  },

  unFollowingRequest: async (req, res) => {
    try {
      const user = req.user;
      const { toUser } = req.body;

      await commonQuery(followerModel, findOneAndDelete, { users: user._id, followers: toUser })
      await commonQuery(followingModel, findOneAndDelete, { following: user._id, users: toUser })

      await commonQuery(requestModel, findOneAndUpdate, { toUser, fromUser: user._id, $or: [{ status: "accept" }] }, { status: "reject" });
      await commonQuery(requestModel, findOneAndUpdate, { toUser: user._id, fromUser: toUser, $or: [{ status: "accept" }] }, { status: "reject" });

      return res.status(OK).json({
        status: 1,
        message: "User removed successfully",
      });
    } catch (error) {
      console.log(error, "========= error =========");
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json({ status: 0, message: commonMessages.INTERNAL_SERVER_ERROR });
    }
  },

  getFollowers: async (req, res) => {
    try {
      const user = req.user;
      const { id } = req.query;

      // const findRequest = await commonQuery(followerModel, find, { users: user._id }, { createdAt: -1 }, "", { path: "followers", select: "profileImg lastName firstName email" });
      const findRequest = await followerModel.aggregate([{ $match: { users: new mongoose.Types.ObjectId(id) } }, { $lookup: { from: "users", foreignField: "_id", localField: "followers", as: "followers", pipeline: [{ $project: { profileImg: 1, lastName: 1, firstName: 1, email: 1, address: 1 } }] } }, { $unwind: "$followers" },
      {
        $group: {
          _id: "$users", // Group by the 'users' field
          followers: {
            $push: {
              _id: "$followers._id", // Add follower's ID
              email: "$followers.email", // Add follower's email
              lastName: "$followers.lastName", // Add follower's last name
              firstName: "$followers.firstName", // Add follower's last name
              profileImg: "$followers.profileImg", // Add follower's profile image
            },
          },
          count: { $sum: 1 }, // Add a count of followers for each group
        },
      },])

      return res
        .status(OK)
        .json({ status: 1, message: "Followers retrieved successfully", data: findRequest[0] || [] });

    } catch (error) {
      console.log(error, "========= error =========");
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json({ status: 0, message: commonMessages.INTERNAL_SERVER_ERROR });
    }
  },

  getFollowing: async (req, res) => {
    try {
      const user = req.user;
      const { id } = req.query;

      // const findRequest = await commonQuery(followingModel, find, { users: user._id }, { createdAt: -1 }, "", { path: "following", select: "profileImg lastName firstName email" });
      const findRequest = await followingModel.aggregate([{ $match: { users: new mongoose.Types.ObjectId(id) } }, { $lookup: { from: "users", foreignField: "_id", localField: "following", as: "following", pipeline: [{ $project: { profileImg: 1, lastName: 1, firstName: 1, email: 1, address: 1 } }] } }, { $unwind: "$following" },
      {
        $group: {
          _id: "$users", // Group by the 'users' field
          following: {
            $push: {
              _id: "$following._id", // Add follower's ID
              email: "$following.email", // Add follower's email
              lastName: "$following.lastName", // Add follower's last name
              firstName: "$following.firstName", // Add follower's last name
              profileImg: "$following.profileImg", // Add follower's profile image
            },
          },
          count: { $sum: 1 }, // Add a count of followers for each group
        },
      },])
      return res
        .status(OK)
        .json({ status: 1, message: "Following retrieved successfully", data: findRequest[0] || [] });

    } catch (error) {
      console.log(error, "========= error =========");
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json({ status: 0, message: commonMessages.INTERNAL_SERVER_ERROR });
    }
  },

  getPost: async (req, res) => {
    try {
      const user = req.user;
      const { page, size, id } = req.query;
      const getUserFollowing = await commonQuery(followingModel, find, { users: user.id });

      const findAllPost = await commonQuery(postModel, find, { user: id }, { createdAt: -1 }, "", { path: "user", select: "email firstName lastName profileImg address" }, size, page);
      const allPostCount = await commonQuery(postModel, countDocuments, { user: id });

      findAllPost.data = await Promise.all(findAllPost.data?.map(async (_data) => {
        const countData = await commonQuery(commentModel, countDocuments, { post: _data?._id })
        const likeCountData = await commonQuery(likeModel, findOne, { post: _data?._id })
        return {
          ..._data,
          commentCount: countData.data || 0,
          createdBy: _data.user,
          commentCount: countData.data || 0,
          likeCount: likeCountData?.data?.users?.length || 0,
          isLike: likeCountData?.data?.users?.toString()?.includes(user._id.toString()) ? true : false,
          isMyPost: _data?.user?.toString() == user?.id ? true : false
        }
      }))

      return res
        .status(OK)
        .json({ status: 1, message: "Post retrieved successfully", data: findAllPost.data, page: +page, total: allPostCount.data });

    } catch (error) {
      console.log(error, "========= error =========");
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json({ status: 0, message: commonMessages.INTERNAL_SERVER_ERROR });
    }
  },

  getNotification: async (req, res) => {
    try {
      const user = req.user;
      const { page, size, id } = req.query;
      // const aggregate = [
      //   { $match: { user: new mongoose.Types.ObjectId(id) } },
      //   {
      //     $lookup: {
      //       from: "users",
      //       localField: "fromUser",
      //       foreignField: "_id",
      //       as: "user"
      //     }
      //   },
      //   {
      //     $addFields: {
      //       user: {
      //         $cond: {
      //           if: { $gt: [{ $size: "$user" }, 0] },
      //           then: { $arrayElemAt: ["$user", 0] }, // Populate if data exists
      //           else: {} // Return an empty object if no data
      //         }
      //       }
      //     }
      //   }
      // ]
      // const aggregate = [
      //   { $match: { user: new mongoose.Types.ObjectId(id) } },
      //   { $lookup: { from: "users", foreignField: "_id", localField: "fromUser", as: "user", pipeline: [{ $project: { profileImg: 1, lastName: 1, firstName: 1, email: 1, address: 1 } }] } }, { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } }]
      // if (page && size) {
      //   aggregate.push({ $skip: +size * (+page - 1) }, { $limit: +size })
      // }

      const findAllPost = await commonQuery(notificationModel, find, { user: id }, { createdAt: -1 }, "", { path: "fromUser", select: "email firstName lastName profileImg address" }, size, page);
      // const findAllPost = await notificationModel.aggregate(aggregate)
      console.log(findAllPost, "========== findAllPost ==========");
      const allPostCount = await commonQuery(notificationModel, countDocuments, { user: id });
      return res
        .status(OK)
        .json({ status: 1, message: "Notification retrieved successfully", data: findAllPost.data, page: +page, total: allPostCount.data });

    } catch (error) {
      console.log(error, "========= error =========");
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json({ status: 0, message: commonMessages.INTERNAL_SERVER_ERROR });
    }
  },

  createUrl: async (req, res) => {
    try {
      const user = req.user;
      const file = req.files;
      const url = `${IMAGE_URL}/image/${file.image[0].filename}`;
      return res
        .status(OK)
        .json({ status: 1, message: "Url created successfully", url });
    } catch (error) {
      console.log(error, "======= error ====");
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json({ status: 0, message: commonMessages.INTERNAL_SERVER_ERROR });
    }
  },

  notificationTest: async (req, res) => {
    try {
      const { token } = req.body
      const notification = await sendNotification("Test", `test`, "", [token])

      return res
        .status(OK)
        .json({ status: 1, message: "Url created successfully", data: notification });
    } catch (error) {
      console.log(error, "======= error ====");
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json({ status: 0, message: commonMessages.INTERNAL_SERVER_ERROR });
    }
  },
};
