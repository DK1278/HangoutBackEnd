var express = require("express");
var router = express.Router();

const userController = require("../controllers/user.controller");
const upload = require("../helper/fileUploading");
const { auth } = require("../middleware/authentication");

/* GET users listing. */
router.post("/homeScreen", auth, userController.homeScreen);
router.post("/getUserDetails", auth, userController.getUserDetails);
router.get("/getMember", auth, userController.getMemberList);
router.get("/getAllUser", auth, userController.getAllMemberList);
// router.post("/login", authController.signIn);
router.post("/createEvent", auth, upload.fields([{ name: "eventImage", maxCount: 1 }]), userController.createEvent);
router.patch("/editEvent", auth, upload.fields([{ name: "eventImage", maxCount: 1 }]), userController.editEvent);
router.delete("/deleteEvent", auth, userController.deleteEvent);

router.post("/createPost", auth, upload.fields([{ name: "postImage", maxCount: 1 }]), userController.createPost);
router.patch("/editPost", auth, upload.fields([{ name: "postImage", maxCount: 1 }]), userController.editPost);
router.delete("/deletePost", auth, userController.deletePost);

router.post("/getPostDetails", auth, userController.postDetails);

router.post("/createOrganizationEvent", auth, upload.fields([{ name: "eventImage", maxCount: 1 }]), userController.createOrganizationEvent);

router.post("/registerOrganization", auth, upload.fields([{ name: "documentImage", maxCount: 1 }]), userController.registerOrganization);
router.get("/getMyOrganization", auth, userController.getOrganization);
router.get("/getUserEvent", auth, userController.getEvent);
router.get("/getUserOrganizationEvent", auth, userController.getOrganizationEvent);
// router.post(
//   "/completeCarDetails",
//   auth,
//   upload.fields([{ name: "carImage", maxCount: 1 }]),
//   authController.completeCarDetails
// );
router.get("/mapEventList", auth, userController.mapPageEventList);
router.get("/getMemberEventDetails", auth, userController.eventDetails);
router.get("/getOrganizationEventDetails", auth, userController.organizationEventDetails);
router.post("/blockAndUnBlockUser", auth, userController.blockUser);
router.post("/reportUser", auth, userController.reportUser);
router.post("/updateLike", auth, userController.addLikes);
router.post("/addComments", auth, userController.addCommets);
router.post("/getComments", auth, userController.getComments);
router.post("/addEventShareCount", auth, userController.addEventShareCount);
router.post("/addOrganizationShareCount", auth, userController.addOrganizationShareCount);
router.post("/addPostShareCount", auth, userController.addPostShareCount);
router.post("/sendFollowRequest", auth, userController.sendFollowRequest);
router.get("/getFollowRequest", auth, userController.getFollowRequest);
router.delete("/cancelFollowRequest", auth, userController.cancelFollowRequest);
router.post("/updatedFollowRequest", auth, userController.updateFollowRequest);
router.post("/unFollowUser", auth, userController.unFollowRequest);
router.post("/removeUser", auth, userController.unFollowingRequest);
router.get("/getMyFollowers", auth, userController.getFollowers);
router.get("/getMyFollowing", auth, userController.getFollowing);
router.get("/getMyPost", auth, userController.getPost);
router.get ("/getMyNotification", auth, userController.getNotification);

router.post("/createUrl", auth, upload.fields([{ name: "image", maxCount: 1 }]), userController.createUrl);

router.post("/testNotification", userController.notificationTest);

module.exports = router;
