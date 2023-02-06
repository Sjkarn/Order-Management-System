const { isValidObjectId } = require("mongoose");
const orderModel = require("../models/orderModel");
const customerModel = require("../models/customerModel");

// -----------orderCreation--------------

exports.orderCreation = async (req, res) => {
  try {
    let orderData = req.body;
    let { customerId, amount } = orderData;

    if (!customerId) {
      return res
        .status(400)
        .send({ status: false, message: "please provide customer id" });
    }
    if (!isValidObjectId(customerId)) {
      return res
        .status(400)
        .send({ status: false, message: "please provide valid customer id" });
    }

    let customerDetails = await customerModel.findById(customerId);
    
    let discount = 0;
    console.log(typeof customerDetails.category, "  category type");
    console.log(customerDetails.category, "   category");
    if (customerDetails.category == "gold") {
      discount = amount * 0.1;
      amount = amount - discount;

      console.log(discount);
      console.log(amount);

      await orderModel.findOneAndUpdate(
        { customerId: customerId },
        { $set: { amount: amount, discount: discount } },
        { new: true }
      );
    } else if (customerDetails.category == "platinum") {
      discount = amount * 0.2;
      amount = amount - discount;

      await orderModel.findOneAndUpdate(
        { customerId: customerId },
        { $set: { amount: amount, discount: discount } },
        { new: true }
      );
    }

    if (customerDetails.orderCount === 10) {
      customerDetails.category = "gold";
      await customerModel.findOneAndUpdate(
        { _id: customerId },
        { $set: { category: customerDetails.category } },
        { new: true }
      );
    }
    if (customerDetails.orderCount === 20) {
      customerDetails.category = "platinum";

      await customerModel.findOneAndUpdate(
        { _id: customerId },
        { $set: { category: customerDetails.category } },
        { new: true }
      );
    }
    
    await customerModel.findOneAndUpdate(
      { _id: customerId },
      { $inc: { orderCount: +1 } },
      { new: true }
    );
    
    const orderDetails = { customerId: customerId, amount, discount };

    let savedOrder = await orderModel.create(orderDetails);

    return res.status(201).send({ status: true, data: savedOrder });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

// -----------getOrder--------------

exports.getOrder = async (req, res) => {
  try {
    const customerId = req.params.customerId;

    const allOrders = await orderModel
      .find({ customerId: customerId })
      .sort({ amount: 1 });
    if (allOrders.length == 0) {
      return res.status(404).send({ status: false, message: "no order found" });
    }

    res.status(200).send({ status: false, data: allOrders });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};