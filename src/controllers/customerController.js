const customerModel = require("../models/customerModel");
const {
  isValidName,
  isValidEmail,
  isValidPassword,
} = require("../validators/validation");

// ----------------customerCreation------------------

exports.customerCreation = async (req, res) => {
  try {
    const data = req.body;

    let { name, email, password } = data;

    if (!name) {
      return res
        .status(400)
        .send({ status: false, message: "provide your name" });
    }

    if (typeof name != "string") {
      return res
        .status(400)
        .send({ status: false, message: "name field should be in string" });
    }
    name = data.name = name.trim();

    if (!isValidName(name)) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide valid name" });
    }
    
    if (!email) {
      return res
        .status(400)
        .send({ status: false, message: "provide your email" });
    }

    if (typeof email != "string" || email == "") {
      return res
        .status(400)
        .send({ status: false, message: "email field can not be empty" });
    }
    email = data.email = email.trim();
    
    if (!isValidEmail(email)) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide valid email" });
    }

    const emailExist = await customerModel.findOne({ email: email });
    
    if (emailExist) {
      return res.status({ status: false, message: "email already exist" });
    }

    if (!password) {
      return res
        .status(400)
        .send({ status: false, message: "provide your password" });
    }

    if (typeof password != "string" || password == "") {
      return res
        .status(400)
        .send({ status: false, message: "password field can not be empty" });
    }
    password = data.password = password.trim();
    
    if (!isValidPassword(password)) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide valid password" });
    }

    const saveCustomer = await customerModel.create(data);

    res.status(201).send({ status: true, data: saveCustomer });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

// ----------------getCustomer------------------

exports.getCustomer = async (req, res) => {
  try {
    const customerId = req.params.customerId;

    if (!customerId) {
      return res
        .status(400)
        .send({ status: false, message: "please provide customer id" });
    }
    
    if(!mongoose.isValidObjectId (customerId)){return res.status(400).send({status:false , message:"please provide valid customer id"})}
    
    const customerData = await customerModel.findById(customerId);
    res.status(200).send({ status: false, message: customerData });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};