var express = require("express");
var router = express.Router();

const authController = require("../controllers/auth/user.controller");
const upload = require("../helper/fileUploading");
const { auth, commonAuth } = require("../middleware/authentication");

/* GET users listing. */
router.post("/register", authController.register);
router.post("/login", authController.signIn);
router.post("/googleLogin", authController.googleSignIn);
// router.post("/appleLogin", authController.signIn);
router.get("/logout", auth, authController.logout);

router.post(
  "/completeProfile",
  commonAuth,
  upload.fields([{ name: "profileImage", maxCount: 1 }]),
  authController.completeProfile
);

router.patch(
  "/editProfile",
  commonAuth,
  upload.fields([{ name: "profileImage", maxCount: 1 },{ name: "profileBackgroundimg", maxCount: 1 }]),
  authController.editProfile
);

router.post(
  "/completeCarDetails",
  auth,
  upload.fields([{ name: "carImage", maxCount: 1 }]),
  authController.completeCarDetails
);
router.post("/otpVerify", commonAuth, authController.otpVerify);
router.post("/forgotPassword", authController.forgotPassword);
router.post("/updatePassword", commonAuth, authController.updatePassword);
router.get("/getProfile", auth, authController.getProfileDetails);
router.get("/getMyCarList", auth, authController.getCarDetails);
router.patch("/updateMyCarList", auth, upload.fields([{ name: "carImage", maxCount: 1 }]), authController.updateCarDetails);
router.get("/getMyBlockUserList", auth, authController.getMyBlockUserDetails);



module.exports = router;
