const Product = require('../models/products')



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

////Create new review or update the review
exports.createProductReview = async(req, res) => {
  try {
  const {rating, comment, productId} = req.body
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment
  }

  const product = await Product.findById(productId)
  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString())
  
  if(isReviewed){
    product.reviews.forEach((rev) => {
      if(rev.user.toString() === req.user._id.toString()){
        rev.rating = rating,
        rev.comment = comment
      }
    })
  } else {
    product.reviews.push(review)
    product.numOfReviews = product.reviews.length
  }

  let avg = 0;

  product.reviews.forEach((rev) => {
    avg = avg + rev.rating
  })
  product.ratings = avg / product.reviews.length

  await product.save({validateBeforeSave: false})
   
  res.status(200).json({
    success: true,
    message: "Rating Successful"
  })
  }catch(error){
    console.log(error)
    res.status(400).json({
      success: false,
      message: "Rating Failed"
    })
  }
}

//get all reviews product

exports.getAllProductReviews = async(req,res) => {
  try {

    const product = await Product.findById(req.query.productId)

    if(!product){
      res.status(400).json({message: "Product Not Found"})
    }

    res.status(200).json({
      success: true,
      reviews: product.reviews
    })

  }catch(err){
    console.log(err)
    res.status(400).json({message: "Failed"})
  }
}


exports.deleteReview = async(req,res) => {
  try {
    const product = await Product.findById(req.query.productId)

    if(!product){
      res.status(400).json({message: "Product Not Found"})
    }


    const reviews = product.reviews.filter(rev => {
      // console.log({first: rev._id.toString(), second: req.query.id.toString()})
      rev._id.toString() !== req.query.id.toString()
    })

    let avg = 0;

    product.reviews.forEach((rev) => {
      avg = avg + rev.rating
    })
    const ratings = avg / product.reviews.length
    const numOfReviews = reviews.length

    await Product.findByIdAndUpdate(req.query.productId,
      {
        reviews,
        ratings,
        numOfReviews
      }, 
      {
        new: true,
        runValidators: true,
        useFindAndModify: true
      })

    res.status(200).json({
      success: true,
      reviews: product.reviews
    })

  }catch(err){
    console.log(err)
    res.status(400).json({message: "Failed"})
  }
}