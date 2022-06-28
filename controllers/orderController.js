const Product = require('../models/products')
const Order = require('../models/orderModel')


exports.createOrder = async(req,res) => {
  try {
    const {
      shippingInfo,
      orderItems,
      paymentInfo,
      itemPrice,
      taxPrice,
      shippingPrice,
      totalPrice
    } = req.body

    const order = await Order.create({
      shippingInfo,
      orderItems,
      paymentInfo,
      itemPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      paidAt: Date.now(),
      user: req.user._id
    })

    res.status(200).json({
      success: true,
      order
    })

  }catch(err){
    console.log(err)
    res.status(400).json({
      success: false,
      message: err
    })
  }
}

exports.getSingleOrder = async(req,res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email")
    if(!order)
      return res.status(401).json({message: "Order Not Found"})

    res.status(200).json({
      success: true,
      order
    })
  }catch(err){

  }
}

exports.myOrders = async(req,res) => {
  try {
    const order = await Order.find({user: req.user._id})
    res.status(200).json({
      success: true,
      order
    })
  }catch(err){
    res.status(400).json({
      success: false,
      message: err
    })
  }
}

exports.getAllOrders = async(req,res) => {
  try {
    const order = await Order.find()

    let totalamount = 0;

    order.forEach(order => {
      totalamount += order.totalPrice;
    });


    res.status(200).json({
      success: true,
      totalamount,
      order
    })
  }catch(err){
    res.status(400).json({
      success: false,
      message: err
    })
  }
}

exports.updateOrder = async(req,res) => {
  try {
    const order = await Order.findById(req.params.id)

    if(order.orderStatus==='Delivered'){
      return res.status(401).json({message: "You have already delivered this order"})
    }


    order.orderItems.forEach(async(o) => {
      await updateStock(o.product, o.quantity)
    })

    order.orderStatus = req.body.status;
    if(req.body.status === 'Delivered'){
      order.deliveredAt = Date.now()
    }

    await order.save({validateBeforeSave: false})

    res.status(200).json({
      success: true,
    })
  }catch(error){
    console.log(error)
    res.status(400).json({
      success: false,
      message: "Failed"
    })
  }
}


async function updateStock(id, quantity){
  const product = await Product.findById(id)

  product.stock-=quantity

  await product.save({validateBeforeSave: false})

}


exports.deleteOrder = async(req,res) => {
  try {
    const order = await Order.findById(req.params.id)
    if(!order)
      return res.status(401).json({message: "Order Not Found with this Id"})
    await order.remove()

    res.status(200).json({
      success: true,
    })
  }catch(err){
    res.status(400).json({
      success: false,
      message: err
    })
  }
}