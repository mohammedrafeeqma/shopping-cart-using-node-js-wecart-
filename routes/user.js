var express = require('express');
var router = express.Router();
const otp = require('../config/otp')
const client = require('twilio')(otp.accountSID, otp.authToken)
const userHelpers = require('../helpers/user-helpers')
const productHelpers = require('../helpers/product-helpers');
const { emailExist } = require('../helpers/admin-helpers');
const adminHelpers = require('../helpers/admin-helpers');
var Readable = require('stream').Readable
const mime = require('mime')
const fs = require('fs')
const path = require('path')
const paypal = require('paypal-rest-sdk');
const CC = require('currency-converter-lt');

paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'AfiL35SVXzKx-GlkJNxIVS8Ly2ImQjrEQjIU3ybTKe52XYzKg_HlPiObje7OWCw1uvxD2oW6jgMBVv07',
  'client_secret': 'ENiKENxSiUIJTLQKOQ4c8ZJ1xFNSqJoRIMfAXy9EuWc4xPlDDh99FmNi4aC4WZLsTznUqvx_iucsEUzY'
});


const verifyLogin = (req, res, next) => {
  if (req.session.user) {

    next();
  }
  else {
    res.redirect('/')
    console.log("************************");
    
  
    
  }
}
let databody = {}
var profilepic={}
var discout=0
var paypalData;
/* GET home page. */
router.get('/', async function (req, res, next) {
  req.session.coupon=null

  var mainbanner = await adminHelpers.getMainBanner()

  if (req.session.loggedIn) {
    user = req.session.user
    let cartcount = await productHelpers.getCartCount(user._id)
    let userDetails = await userHelpers.user(req.session.user._id)
    console.log(userDetails.profile);
    profilepic=userDetails
    productHelpers.showProducts().then((products) => {
      // console.log(products);
      req.session.cartcount = cartcount;
      res.render('user/index', {profilepic, products, user, cartcount, mainbanner });
    })
  }
  else {
    productHelpers.showProducts().then((products) => {
      // console.log(products);
      res.render('user/index', { products, mainbanner })
    })

  }


});

router.get('/login', function (req, res, next) {
  
  
  
    console.log(11);
    if (req.session.loggedIn) {
      res.redirect('/')
    }
    
    else {
  
      res.render('user/login', { loginErr: req.session.logginErr, blockErr: req.session.blockErr, otpErr: req.session.otperr })
      req.session.logginErr = false
      req.session.blockErr = false
      req.session.otperr = false
    }
    
  
  

})

router.post('/login', function (req, res) {
  userHelpers.doLogin(req.body).then((response) => {
    if (response.status) {

      if (response.user.access) {

        // req.session.loggedIn = true
        // req.session.user = response.user
        // res.redirect('/')
        if(req.session.currentposition)
  {
    
    req.session.loggedIn = true
      req.session.user = response.user;
    res.redirect('/'+req.session.currentposition)
    
  }
  else{
    req.session.loggedIn = true
        req.session.user = response.user;
        res.redirect('/')

  }
        


        // var mobile = `+91${databody.mobile}`
        // client
        //       .verify
        //       .services(otp.serviceID)
        //       .verifications
        //       .create({
        //           to: mobile,
        //           channel:'sms'
        //       }).then((data)=>{
        //         console.log("frist"+databody._id);

        //           res.render('user/loginotp',{databody})

        //       }).catch(()=>{
        //           res.redirect('/login');
        //       })
      }
      else {
        console.log("fjff");
        req.session.blockErr = true;
        res.redirect('/login')
      }



    }
    else {
      req.session.logginErr = true
      res.redirect('/login')
    }
  })

})
router.get('/loginotpverify', function (req, res) {
  console.log(req.query.code);
  console.log("dara" + databody.mobile);
  var mobile = `+91${databody.mobile}`
  client
    .verify
    .services(otp.serviceID)
    .verificationChecks
    .create({
      to: mobile,
      code: req.query.code
    }).then((data, err) => {
      console.log(data);
      if (data.valid) {
        req.session.loggedIn = true
        req.session.user = databody
        res.redirect('/')
      }
      else {
        res.redirect('/login')

      }
    })
})
router.get('/signup', function (req, res) {
  if (req.session.loggedIn) {
    res.redirect('/')
  }
  else {
    res.render('user/signup', { signupErr: req.session.signupErr })
  }

})
router.post('/signup', function (req, res) {

  adminHelpers.emailExist(req.body).then((response) => {
    if (response) {
      req.session.signupErr = true
      res.redirect('/signup')
    }
  })

  databody = req.body;
  var d = new Date();
  // var year =d.getFullYear();
  // var month = d.getMonth();
  // var day = d.getDate();
  // var date = year + "/" + month + "/" + day;
  // databody.date=date
  // console.log(databody.mobile);


  // var details = req.body
  // var mobile = `+91${databody.mobile}`
  // client
  //       .verify
  //       .services(otp.serviceID)
  //       .verifications
  //       .create({
  //           to: mobile,
  //           channel:'sms'
  //       }).then((data)=>{
  //         console.log("frist"+databody._id);
  //           res.render('user/otp',{databody})

  //       }).catch(()=>{
  //           res.redirect('/signup');
  //       })

  userHelpers.doSignup(databody).then((date) => {

    console.log("success");
    res.redirect('/login')

  })


})
// router.get('/otp',function(req,res){
//   console.log("hi");
//   res.render('user/otp',{databody,otpErr:req.session.otpErr})
//   req.session.otpErr=false;
// })
router.get('/otpverify', function (req, res) {
  console.log(req.query.code);
  console.log("dara" + databody.mobile);
  var mobile = `+91${databody.mobile}`
  client
    .verify
    .services(otp.serviceID)
    .verificationChecks
    .create({
      to: mobile,
      code: req.query.code
    }).then((data, err) => {
      console.log(data);
      if (data.valid) {
        req.session.user = databody
        req.session.loggedIn = true;

        res.redirect('/')
      }
      else {
        req.session.otpErr = true;
        res.redirect('/mobileverify')

      }
    })
})

router.post('/mobileverify', (req, res) => {
  adminHelpers.mobileExist(req.body).then((response) => {
    if (response) {
      console.log("start");
     


      databody = response
      console.log(databody.mobile);
      var mobile = `+91${response.mobile}`
      client
        .verify
        .services(otp.serviceID)
        .verifications
        .create({
          to: mobile,
          channel: 'sms'
        }).then((response) => {
          console.log("hiii");
          console.log(response);


          res.render('user/otp', { response })


        }).catch((err) => {
          console.log(err);
          res.redirect('/login');
        })
    }
    else {
      req.session.otperr = true;
      res.redirect('/login')
    }
  })

})

router.get('/mobileverify', (req, res) => {

  console.log("start");
  console.log(databody.mobile);
  var mobile = `+91${databody.mobile}`
  client
    .verify
    .services(otp.serviceID)
    .verifications
    .create({
      to: mobile,
      channel: 'sms'
    }).then((data) => {

      res.render('user/otp', { databody, otpErr: req.session.otpErr })


    }).catch(() => {

      res.redirect('/mobileverify');
    })



})


router.get('/logout', function (req, res) {
  req.session.destroy()
  res.redirect('/login')
})
router.get('/product-view/:id', async function (req, res) {
  if (req.session.user) {
    user=req.session.user
    var cartcount = await productHelpers.getCartCount(user._id)
  }

  productHelpers.getProductDetails(req.params.id).then((products) => {
    res.render('user/product-view', {profilepic, products, user: req.session.user, cartcount })
  })

})
router.post('/coupon',async(req,res)=>{
  console.log(req.body);
  console.log('coupon');
  var coupon = await userHelpers.verifyCoupon(req.body)
  if(coupon)
  {
    if(coupon.active)
    {
     let couponPermission= await userHelpers.couponPermission(coupon._id,req.session.user._id)
      if(couponPermission)
      {
        res.json(false)
      }
      
      else{
        req.session.coupon=coupon
        res.json(coupon)
      }
    
    }
    else{
      res.json(false)
    }
    
    
  }
  else{
    res.json(false)
  }
})
router.get('/cart', verifyLogin, async function (req, res) {
  
  
  let cartproducts = await userHelpers.getCartProducts(req.session.user._id)
  let total = await userHelpers.getTotalAmount(req.session.user._id)
  subtotal = await userHelpers.getSubTotal(req.body.product, req.session.user._id)

  cartproducts.subTotal = await userHelpers.getSubTotal(req.body.product, req.session.user._id)

  res.render('user/cart', {profilepic, total, cartproducts, user: req.session.user, cartcount: req.session.cartcount, subtotal })
})
router.get('/add-to-cart/:id', verifyLogin, async (req, res) => {
  var eachProduct = await userHelpers.eachProductDetails(req.params.id)
  console.log(11111);
  console.log(req.body);
  userHelpers.addToCart(req.params.id, req.session.user._id, eachProduct).then(() => {
    // res.redirect('/')
    res.json({ status: true })
  })
})
router.post('/add-to-cart/', async (req, res,next) => {
  console.log("hlooe");
  if(req.session.user)
  { 
    console.log(req.body);
  var eachProduct = await userHelpers.eachProductDetails(req.body.proId)
  console.log(11111);
  console.log(req.body);
  userHelpers.addToCart(req.body, req.session.user._id, eachProduct).then(() => {
    // res.redirect('/')
    res.json({ status: true })
  })
  }
  else{
    console.log("console");
    req.session.currentposition='product-view/'+req.body.proId
    console.log(req.session.currentposition);
    console.log(444);
    res.json(false)


  }

    
  
})
router.get('/remove-item/:id', verifyLogin, (req, res) => {

  console.log(req.params.id);
  userHelpers.deleteFromCart(req.params.id, req.session.user._id).then((response) => {
    res.redirect('/cart')
  })
})
router.post('/change-product-quantity', verifyLogin, (req, res) => {
  userHelpers.changeProductQuantity(req.body).then(async (response) => {

    req.body.user = req.session.user._id;
    
    
    response.subtotal = await userHelpers.getSubTotal(req.body.product, req.session.user._id)
    response.total = await userHelpers.getTotalAmount(req.session.user._id)
    console.log(response);
    res.json(response)

  })
})
router.get('/make-purchase', verifyLogin, async (req, res) => {
  userId = req.session.user._id;
  
  let products = await userHelpers.getCartProducts(req.session.user._id)
 
  let total = await userHelpers.getTotalAmount(req.session.user._id)
  let user = await userHelpers.getUserDetails(userId)

 if(req.session.coupon)
  {
    var coupon = req.session.coupon
    userHelpers.couponList(coupon,req.session.user._id)
    var discount = total*(parseInt(req.session.coupon.discount)/100)
    discount=~~discount;
    var grandtotal = total-parseInt(discount) 
    req.session.coupon.discount=discount
    
  }
  else{
    var discount=0
  }
  res.render('user/make-purchase', {discount,profilepic, address: user.address, total, products, user: req.session.user })
})

router.post('/make-purchase', verifyLogin, async (req, res) => {
  
  let total = await userHelpers.getTotalAmount(req.session.user._id)
  console.log(11);
  let products = await userHelpers.getCartProductsList(req.session.user._id)
  console.log("*************get cart products*****************");

  console.log(products);
  let deliveryAddress = await userHelpers.getDeliveryAddress(req.session.user._id, req.body.deliveryAddress)
  req.body.user = req.session.user._id;
  let billingAddress = await userHelpers.getBillingAddress(req.session.user._id)
  console.log(3434);
  if(req.session.coupon)
  {
    grandtotal=total-req.session.coupon.discount
    discount=req.session.coupon.discount
  }
  else{
    grandtotal=total
    discount=0
  }
 req.session.coupon=null

  userHelpers.addToOrders(discount,grandtotal,req.body, total, products, deliveryAddress[0], req.session.user._id, billingAddress[0]).then((orderId) => {
    if (req.body.paymentMethod === 'COD') {
      res.json({ codSuccess: true })
    }
    else {
      console.log("payment online" + 111);
      userHelpers.generateRazorpay(orderId, grandtotal).then((response) => {
        console.log(2222);
        res.json(response)

      })
    }


  })


})
router.get('/order-success', verifyLogin, async (req, res) => {
  let orders = await userHelpers.getLastOrders(req.session.user._id)
  user = req.session.user
    let cartcount = await productHelpers.getCartCount(user._id)
    let userDetails = await userHelpers.user(req.session.user._id)
    console.log(userDetails.profile);
    profilepic=userDetails
    productHelpers.showProducts().then((products) => {
      // console.log(products);
      req.session.cartcount = cartcount;
      res.render('user/order-success', {profilepic, products, user, cartcount,orders});
    })

})
router.get('/orders', verifyLogin, async (req, res) => {
  let orders = await userHelpers.getUserOrders(req.session.user._id)
  let cartcount = await productHelpers.getCartCount(user._id)

  console.log(orders);
  res.render('user/orders', {profilepic, user: req.session.user, orders, cartcount })
})


router.get('/view-order-product/:id', verifyLogin, async (req, res) => {
  subtotal = await userHelpers.getSubTotal(req.params.id, req.session.user._id)
  let products = await userHelpers.getOrderProducts(req.params.id)
  res.render('user/view-order-product', {profilepic, user: req.session.user, products, subtotal })
})
router.post('/add-address', verifyLogin, (req, res) => {
  console.log("add address");
  userHelpers.updateAddress(req.body, req.session.user._id).then((response) => {
    res.redirect('/make-purchase')

  })
})
router.post('/add-addressprofile', verifyLogin, (req, res) => {
  console.log("add address");
  userHelpers.updateAddress(req.body, req.session.user._id).then((response) => {
    res.redirect('/profile')

  })
})
router.get('/add-address', (req, res) => {
  console.log("looo");
  alert("hhh")
})
router.get('/wishlist', verifyLogin, async (req, res) => {

  let products = await userHelpers.getWishlistProducts(req.session.user._id)
  res.render("user/wishlist", {profilepic, products, user: req.session.user })
})
router.get('/add-to-wishlist/:id', async (req, res) => {

  if(req.session.user)
  {
    var eachProduct = await userHelpers.eachProductDetails(req.params.id)

    console.log(req.body);
    userHelpers.addToWishlist(req.params.id, req.session.user._id, eachProduct).then((data) => {
  
  
      // res.redirect('/')
      res.json(data)
    })
  }
  else{
    res.json({login:true})
  }


})

router.get('/remove-wishlist/:id', (req, res) => {
  userHelpers.removeWishlist(req.params.id, req.session.user._id).then((response) => {
    res.redirect('/wishlist')
  })
})

router.post('/verify-payment', async (req, res) => {
  console.log(req.body);
  console.log(000000);
  let orders = await userHelpers.getLastOrders(req.session.user._id)
  console.log(11111);
  userHelpers.verifyPayment(req.body,req.session.user._id).then(() => {
    console.log(22222);
    paymentMethod="razorpay"
    userHelpers.changePaymentStatus(orders._id,paymentMethod).then(() => {
      console.log(33333);
      console.log("payment success");
      res.json({ status: true })
    })
  }).catch((err) => {
    res.json({ status: false, errMsg: '' })
  })
})

router.post('/pay', async(req, res) => {
  let total = await userHelpers.getTotalAmount(req.session.user._id)
  console.log(11);
  let products = await userHelpers.getCartProductsList(req.session.user._id)
  console.log(22);
  let deliveryAddress = await userHelpers.getDeliveryAddress(req.session.user._id, req.body.deliveryAddress)
  req.body.user = req.session.user._id;
  let billingAddress = await userHelpers.getBillingAddress(req.session.user._id)
  console.log(3434);
  if(req.session.coupon)
  {
    grandtotal=total-req.session.coupon.discount
    discount=req.session.coupon.discount
  }
  else{
    grandtotal=total
    discount=0
  }
 req.session.coupon=null
 var inrToDollar




let fromCurrency = "INR"
let toCurrency = "USD"
let amountToConvert = grandtotal;
let currencyConverter = new CC(
  {
    from: fromCurrency,
    to: toCurrency,
    amount: amountToConvert
  }
);
currencyConverter.convert().then((response)=>{
  console.log("48484858585885================================");
  response=response.toFixed(2)
  req.session.grandtotal= parseFloat(response)
  console.log(amountToConvert+" "+fromCurrency+" is equal to "+response +" "+toCurrency)
  inrToDollar=parseFloat(response)
  console.log(inrToDollar);



console.log(grandtotal);
  userHelpers.addToOrders(discount,grandtotal,req.body, total, products, deliveryAddress[0], req.session.user._id, billingAddress[0]).then((orderId) => {
    if (req.body.paymentMethod === 'COD') {
      res.json({ codSuccess: true })
    }

    else {
      console.log(666666);
      console.log(products)
     


      const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:3000/paypal-success",
            "cancel_url": "http://localhost:3000/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "products",
                    "sku": "001",
                    "price": inrToDollar,
                    "currency": "USD",
                    "quantity": "1"
                }]
            },
            "amount": {
                "currency": "USD",
                "total": inrToDollar
            },
            "description": "Hat for the best team ever"
        }]
        
        
    };
    
    
    paypal.payment.create(create_payment_json, function (error, payment) {
      if (error) {
          throw error;
      } else {
          for(let i = 0;i < payment.links.length;i++){
            if(payment.links[i].rel === 'approval_url'){
              console.log(555);
              console.log(payment);
              paypalData=payment.links[i]
              console.log(1212);
              res.json(payment.links[i])
              // res.redirect(payment.links[i].href);
            }
          }
      }
    });
    
  
      
    }


  })

})
  console.log(1234);
  console.log(544);
  console.log(444);
  

});





router.get('/paypal-success', (req, res) => {
  grandtotal=req.session.grandtotal
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;

  const execute_payment_json = {
    "payer_id": payerId,
    "transactions": [{
        "amount": {
            "currency": "USD",
            "total": grandtotal
        }
    }]
  };



  paypal.payment.execute(paymentId, execute_payment_json, async function (error, payment) {
    if (error) {
        console.log(error.response);
        throw error;
    } else {
      console.log(444409);
        console.log(JSON.stringify(payment));
        let orders = await userHelpers.getLastOrders(req.session.user._id)
        userHelpers.removerFromCart(req.session.user._id)
        paymentMethod="paypal"
        userHelpers.changePaymentStatus(orders._id,paymentMethod).then(()=>{
          res.render('user/order-success', {profilepic, user: req.session.user, orders })
        })
 
    }
});
});
router.get('/cancel',(req,res)=>{
  res.redirect('/make-purchase')
})

router.get('/profile', verifyLogin, async (req, res) => {
  let user = await userHelpers.user(req.session.user._id)
  let cartcount = await productHelpers.getCartCount(user._id)
  console.log(user.address[0]);
  res.render('user/profile', {cartcount,profilepic, user, address: user.address[0] })
})

router.post('/edit-profile', async (req, res) => {
  console.log(11);
  userHelpers.userEdit(req.session.user._id, req.body).then((response) => {
    res.redirect('/profile')

  })
})

router.post('/update-password', (req, res) => {
  console.log(00);
  console.log(req.body);
  userHelpers.passwordCheck(req.session.user._id, req.body).then((response) => {
    if (response) {
      console.log(11);

      userHelpers.updatePassword(req.session.user._id, req.body).then((response) => {
        console.log("success");
        res.redirect('/profile')
      })
    }
  })

})
router.get('/men', (req, res) => {
  userHelpers.men().then((mens) => {
    console.log(mens);
    res.render('user/men', {profilepic, user:req.session.user, mens })
  })

})
router.get('/women', (req, res) => {
  userHelpers.women().then((womens) => {
    res.render('user/women', {profilepic,user:req.session.user, womens })
  })
})
router.get('/brand', async (req, res) => {
  products = await productHelpers.showProducts()
  brand = await adminHelpers.showBrand()
  console.log(products)

  res.render('user/brand', {profilepic, user:req.session.user, products, brand })
})

router.get('/order-cancel/:id', (req, res) => {
  userHelpers.orderCancel(req.params.id).then(() => {
    res.redirect('/orders')
  })
})
router.get('/edit-address/:id', (req, res) => {
  userHelpers.getAddress(req.params.id).then((address) => {
    res.render('user/edit-address', {user:req.session.user,profilepic, address })
  })

})
router.post("/edit-address", (req, res) => {
  userHelpers.editAddress(req.body, req.session.user._id).then(() => {
    res.redirect('/make-purchase')
  })
})
router.get('/remove-address/:id', (req, res) => {
  userHelpers.removeAddress(req.params.id, req.session.user._id).then(() => {
    res.redirect('/make-purchase')
  })
})
router.get('/remove-proaddress/:id', (req, res) => {
  userHelpers.removeAddress(req.params.id, req.session.user._id).then(() => {
    res.redirect('/profile')
  })
})
router.post('/upload-profile', (req, res) => {
  
   console.log(req.body);
  let id = req.session.user._id;
  let image = req.body.image;
  userHelpers.updateProfile(req.session.user._id)
  base64Date = image.replace(/^data:image\/png;base64,/, "")
    const fileName = path.join(__dirname,'../public/images/profile/',id+'.png')
    fs.writeFile(fileName, base64Date, 'base64', function(err){
      console.log(err);
      
    })
    res.json(true)

})

router.get('/Nike',(req,res)=>{
  userHelpers.nike().then((nike)=>{
    console.log(5);
    console.log(nike);
    res.render('user/nike',{nike})
  })
})





router.get('/demo', (req, res) => {

  res.render('user/demo1')

})
router.post('/demo', (req, res) => {

  console.log(req.body.image);
  console.log(3332);
  

  var body =req.body.image
    base64Data = body.replace(/^data:image\/png;base64,/, "")
    const fileName = path.join(__dirname,'../public/images/',"out.png")
    fs.writeFile(fileName, base64Data, 'base64', function(err) {
      console.log(err);
    });
   




  console.log("success");



  res.json(true)
})

router.get('/chart', (req, res) => {
  res.render('user/chart')
})



module.exports = router;



