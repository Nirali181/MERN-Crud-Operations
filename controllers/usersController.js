const users = require("../models/usersSchema");
const moment = require("moment");
const csv = require("fast-csv");
const fs = require("fs");

exports.usersController = async (req, res) => {
  const file = req.file.filename;
  const { firstName, lastName, email, mobile, gender, status, location } =
    req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !mobile ||
    !gender ||
    !status ||
    !file ||
    !location
  ) {
    return res
      .status(400)
      .json({ error: "All fields are required", status: 400 });
  }
  try {
    const existingUser = await users.findOne({ email: email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User already exist with this email id", status: 400 });
    } else {
      const datecreated = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");
      const newUser = new users({
        firstName,
        lastName,
        email,
        mobile,
        gender,
        status,
        profile: file,
        location,
        datecreated,
      });
      await newUser.save();
      return res
        .status(201)
        .json({ message: "User registered successfully", status: 201 });
    }
  } catch (error) {
    return res.status(500).json({ error: error, status: 500 });
  }
};

// Get Users
exports.GetAllUsers = async (req, res) => {
  const search = req.query.search || "";
  const gender = req.query.gender;
  const sort = req.query.sort || "";
  console.log("aaaaaaaa", req.query);
  const query = {
    $or: [
      {
        firstName: {
          $regex: search,
          $options: "i",
        },
      },
      {
        lastName: {
          $regex: search,
          $options: "i",
        },
      },
      {
        email: {
          $regex: search,
          $options: "i",
        },
      },
      {
        location: {
          $regex: search,
          $options: "i",
        },
      },
    ],
  };

  if (gender !== "All") {
    query.gender = gender;
  }

  try {
    console.log("abababa", req.query);
    const getAllUsers = await users
      .find(query)
      .sort({ datecreated: sort === "New" ? -1 : 1 });
    console.log("!222", getAllUsers);
    res.status(200).json({ data: getAllUsers, status: 200 });
  } catch (error) {
    res.status(500).json({ error: error, status: 500 });
  }
};

// get single user
exports.GetSingleUser = async (req, res) => {
  const { id } = req.params;
  try {
    const singleUser = await users.findOne({ _id: id });
    res.status(200).json({ data: singleUser, status: 200 });
  } catch (error) {
    res.status(500).json({ error: error, status: 500 });
  }
};

// edit single user
exports.EditSingleUser = async (req, res) => {
  const { id } = req.params;

  const {
    firstName,
    lastName,
    email,
    mobile,
    gender,
    status,
    location,
    profile,
  } = req.body;
  const file = req.file ? req.file.filename : profile;

  const dateupdated = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");
  try {
    const singleUser = await users.findByIdAndUpdate(
      { _id: id },
      {
        firstName,
        lastName,
        email,
        mobile,
        gender,
        status,
        profile: file,
        location,
        dateupdated,
      },
      { new: true }
    );

    await singleUser.save();
    return res.status(200).json({ data: singleUser, status: 200 });
  } catch (error) {
    return res.status(500).json({ error: error, status: 500 });
  }
};

// delete user
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  console.log("idd", id);
  try {
    const deleteUser = await users.findByIdAndDelete({ _id: id });
    console.log("deleteUser", deleteUser);
    return res.status(200).json({
      message: "User Deleted Successfully",
      data: deleteUser,
      status: 200,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({ error: error, status: 500 });
  }
};

// status channge
exports.ChangeStatus = async (req, res) => {
  const { id } = req.params;
  console.log("uuuuuuidd", id);
  console.log("reqstatus", req.body.status);

  try {
    const userData = await users.findByIdAndUpdate(
      { _id: id },
      { status: req.body.status },
      { new: true }
    );
    console.log("userData", userData);
    await userData.save();
    return res.status(200).json({
      data: userData,
      message: "User status updated Successfully",
      status: 200,
    });
  } catch (error) {
    return res.status(500).json({ error: error, status: 500 });
  }
};

// export csv file
exports.ExportToCSV = async (req, res) => {
  try {
    const usersData = await users.find();
    const csvStream = csv.format({ headers: true });

    if (!fs.existsSync("public/files/export/")) {
      if (!fs.existsSync("public/files")) {
        fs.mkdirSync("public/files/");
      }
      if (!fs.existsSync("public/files/export")) {
        fs.mkdirSync("./public/files/export/");
      }
    }
    const writablestream = fs.createWriteStream(
      "public/files/export/users.csv"
    );
    csvStream.pipe(writablestream);

    writablestream.on("finish", function () {
      res.status(200).json({
        downloadUrl: `http://localhost:8009/files/export/users.csv`,
        status: 200,
      });
    });
    if (usersData?.length > 0) {
      usersData?.map((user) => {
        csvStream.write({
          FirstName: user.firstName ? user.firstName : "-",
          LastName: user.lastName ? user.lastName : "-",
          Email: user.email ? user.email : "-",
          Phone: user.mobile ? user.mobile : "-",
          Gender: user.gender ? user.gender : "-",
          Status: user.status ? user.status : "-",
          Profile: user.profile ? user.profile : "-",
          Location: user.location ? user.location : "-",
          DateCreated: user.datecreated ? user.datecreated : "-",
          DateUpdated: user.dateupdated ? user.dateupdated : "-",
        });
      });
    }
    csvStream.end();
    writablestream.end();
  } catch (error) {
    return res.status(500).json({ error: error, status: 500 });
  }
};
