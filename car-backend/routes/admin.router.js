var express = require("express");
var router = express.Router();

const adminController = require("../controllers/admin/admin.controller");
const upload = require("../helper/fileUploading");
const { auth } = require("../middleware/authentication");

/* GET users listing. */
router.post("/register", adminController.register);
router.post("/login", adminController.signIn);
router.post("/getUser", auth, adminController.getUser);
router.post("/getUserDetails", auth, adminController.getUserDetails);
router.patch("/updateUser", auth, adminController.updateUser);
router.post("/getMemberEvent", auth, adminController.getMemberEvent);
router.post("/getMemberEventDetails", auth, adminController.getMemberEventDetails);
router.patch("/updateMemberEvent", auth, adminController.updateMemberEvent);
router.post("/getOrganizationEvent", auth, adminController.getOrganizationEvent);
router.post("/getOrganizationDetails", auth, adminController.getOrganizationDetails);
router.patch("/updateOrganizationEvent", auth, adminController.updateOrganizationEvent);
router.post("/getComments", auth, adminController.getComments);
router.post("/getCommentDetails", auth, adminController.getCommentDetails);
router.patch("/updateComments", auth, adminController.updateComments);
router.post("/getOrganization", auth, adminController.getOrganization);
// router.post("/getOrganizationDetails", auth, adminController.getCommentDetails);
router.patch("/updateOrganization", auth, adminController.updateOrganization);


module.exports = router;
