const Product = require('../models/products')
const apiFeatures = require('../features/apiFeatures')


exports.createProduct = async(req,res) => {
  try {
    req.body.user = req.body.id
    const product = await Product.create(req.body)
    res.status(201).json({
      success: true,
      product
    })

  } catch(err) {
    res.status(400).json(err)
  }
}

exports.getAllProducts = async(req, res) => {
  if(req.query.keyword){
    const product = await Product.find({name: req.query.keyword})
    res.status(201).json({
      success: true,
      product
    })
  }
  // console.log(req.query)
  const product = await Product.find(req.body)
  res.status(201).json({
    success: true,
    product
  })
}

exports.getAllProductDetails = async(req, res) => {
  const product = await Product.findById(req.params.id)
  if(!product){
    return res.status(500).json({
      success: false,
      message: 'Product Not Found'
    })
  }
  res.status(201).json({
    success: true,
    product
  })
}

exports.updateProducts = async(req,res) => {
  try {
    let product = await Product.findById(req.params.id)
  
    if(!product){
      return res.status(500).json({
        success: false,
        message: 'Product Not Found'
      })
    }
  
    product = await Product.findByIdAndUpdate(req.params.id,req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false
    })
  
    res.status(200).json({
      success: true,
      product
    })

  } catch(err){
    res.status(400).json(err)
  }
}

exports.deleteProduct = async(req,res) => {
  const product = await Product.findById(req.params.id)

  if(!product){
    return res.status(500).json({
      success: false,
      message: 'Product Not Found'
    })
  }

  await product.remove();

  res.status(200).json({
    success: true,
    message: "Product Deleted Successfully"
  })
}