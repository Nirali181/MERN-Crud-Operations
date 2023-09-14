const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/usersController");
const upload = require("../multerconfig/storageConfig")

router.post("/user/adduser",upload.single("profile"),userControllers.usersController)
router.get("/user/getusers",userControllers.GetAllUsers)
router.get("/user/getsingleuser/:id",userControllers.GetSingleUser)
router.put("/user/editsingleuser/:id",upload.single("profile"),userControllers.EditSingleUser)
router.delete("/user/deleteuser/:id",userControllers.deleteUser)
router.put("/user/changestatus/:id",userControllers.ChangeStatus)
router.get("/user/exportcsv",userControllers.ExportToCSV)
module.exports = router