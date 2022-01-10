const { response } = require('express');
var express = require('express');
var router = express.Router();
const otp = require('../config/otp')
const client = require('twilio')(otp.accountSID,otp.authToken)
var adminHelpers = require('../helpers/admin-helpers')
const productHelpers = require('../helpers/product-helpers');
const userHelpers = require('../helpers/user-helpers');
const fs = require('fs')
const path = require('path')
let databody = {}
const verifyLogin = (req, res, next) => {
  if (req.session.admin) {

    next();
  }
  else {

    res.redirect('/admin/')
  }
}
/* GET users listing. */
router.get('/', function(req, res, next) {
  if(req.session.admin)
  {
    res.redirect('/admin/dashboard')
  }

  res.render('admin/login',{err:req.session.adminloginErr})
  req.session.adminloginErr=false
});

router.get('/dashboard',verifyLogin,async function(req,res){
  var men = await adminHelpers.menCount()
  var women =await adminHelpers.womenCount()
  var nike = await adminHelpers.nikeCount()
  var addidas = await adminHelpers.addidasCount()
  var puma = await adminHelpers.pumaCount()
  var order=await adminHelpers.orderCount()
  var customer = await adminHelpers.customerCount()
  var  revenue = await adminHelpers.revenue()
  var pendingorder = await adminHelpers.pendingOrder()
  var target = await adminHelpers.showTarget()
  var january = await adminHelpers.january()
  var feb = await adminHelpers.feb()
  var janRevenue = await adminHelpers.janRevenue()
  var febRevenue = await adminHelpers.febRevenue()
  console.log(767676);
  console.log(febRevenue);

    res.render('admin/dashboard',{january,admin:true,target,pendingorder,men,women,nike,addidas,puma,order,customer,revenue,janRevenue,febRevenue})
 
})

router.post('/login',function(req,res){
  console.log(1);
  
  
  adminHelpers.doLogin(req.body).then((response)=>{
    console.log(2);
    
    if(response.status) {
      console.log(3);
      req.session.admin=true
      console.log("admin login");

      res.redirect('/admin/dashboard')
      // req.session.loggedIn = true
      // req.session.user=response.user
      // databody = response.user;
    
    
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
      //           res.render('admin/adminotp',{databody})
                
      //       }).catch(()=>{
      //           res.redirect('/admin/login');
      //       })
    }
    else{
      console.log(4);
      req.session.adminloginErr=true;
      res.redirect('/admin/')
    }
  })
})

router.get('/adminotpverify',function(req,res){
  console.log(req.query.code);
  console.log("dara"+databody.mobile);
  var mobile = `+91${databody.mobile}`
  client
        .verify
        .services(otp.serviceID)
        .verificationChecks
        .create({
            to: mobile,
            code:req.query.code
        }).then((data,err)=>{
          console.log(data);
            if(data.valid){
                res.redirect('/admin/dashboard')  
            }
            else{
                res.redirect('/adminotp')

            }
        })
})

router.get('/all-products',verifyLogin,function(req,res){
  productHelpers.showProducts().then((products)=>{
    res.render('admin/all-products',{products,admin:true})
  })
})

router.get('/add-product',verifyLogin,async function(req,res){
  let category = await adminHelpers.showCategory()
  let brand = await adminHelpers.showBrand()
  console.log(category);
  res.render('admin/add-product',{admin:true,category,brand})
})

router.post('/add-product',verifyLogin,function(req,res){
  console.log("hi");
    console.log(req.body);
   
    productHelpers.addProduct(req.body,(id)=>{
      console.log(id);
      let image1 = req.body.image1;
      let image2 = req.body.image2;
      let image3 = req.body.image3;
      let image4 = req.body.image4;
      console.log(req.body);
      base64Date1 = image1.replace(/^data:image\/png;base64,/, "")
    const fileName1 = path.join(__dirname,'../public/images/product-images/',id+'_1.png')
    fs.writeFile(fileName1, base64Date1, 'base64', function(err){
      console.log(err);
      
    })

    base64Date2 = image2.replace(/^data:image\/png;base64,/, "")
    const fileName2 = path.join(__dirname,'../public/images/product-images/',id+'_2.png')
    fs.writeFile(fileName2, base64Date2, 'base64', function(err){
      console.log(err);
      
    })

    base64Date3 = image3.replace(/^data:image\/png;base64,/, "")
    const fileName3 = path.join(__dirname,'../public/images/product-images/',id+'_3.png')
    fs.writeFile(fileName3, base64Date3, 'base64', function(err){
      console.log(err);
      
    })

    base64Date4 = image4.replace(/^data:image\/png;base64,/, "")
    const fileName4 = path.join(__dirname,'../public/images/product-images/',id+'_4.png')
    fs.writeFile(fileName4, base64Date4, 'base64', function(err){
      console.log(err);
      
    })
     
      
    })
    res.json(true)
    
})
router.get('/users',verifyLogin,(req,res)=>{
  
  adminHelpers.viewUsers().then((response)=>{
    
    res.render('admin/users',{response,admin:true})
  })
})

router.get('/edit-product/:id',verifyLogin,async(req,res)=>{
  let user = await adminHelpers.getProductDetails(req.params.id)
  res.render('admin/edit-product',{user,admin:true})
}) 
router.post('/edit-product',verifyLogin,(req,res)=>{
  console.log(req.body);
  productHelpers.editProduct(req.body.idname,req.body).then((result)=>{
    var id =req.body.idname;
     
    let image1 = req.body.image1;
      let image2 = req.body.image2;
      let image3 = req.body.image3;
      let image4 = req.body.image4;
      console.log(req.body);
      if(req.body.image1)
      {
        base64Date1 = image1.replace(/^data:image\/png;base64,/, "")
    const fileName1 = path.join(__dirname,'../public/images/product-images/',id+'_1.png')
    fs.writeFile(fileName1, base64Date1, 'base64', function(err){
      console.log(err);
      
    })
      }
    
      if(req.body.image2)
      {
        base64Date2 = image2.replace(/^data:image\/png;base64,/, "")
    const fileName2 = path.join(__dirname,'../public/images/product-images/',id+'_2.png')
    fs.writeFile(fileName2, base64Date2, 'base64', function(err){
      console.log(err);
      
    })
      }

      if(req.body.image3)
      {
        base64Date3 = image3.replace(/^data:image\/png;base64,/, "")
    const fileName3 = path.join(__dirname,'../public/images/product-images/',id+'_3.png')
    fs.writeFile(fileName3, base64Date3, 'base64', function(err){
      console.log(err);
      
    })
      }
    

    if(req.body.image4)
    {
      base64Date4 = image4.replace(/^data:image\/png;base64,/, "")
    const fileName4 = path.join(__dirname,'../public/images/product-images/',id+'_4.png')
    fs.writeFile(fileName4, base64Date4, 'base64', function(err){
      console.log(err);
      
    })
    }

    res.json(true)
    
  })
})

router.get('/delete-product/:id',verifyLogin,async(req,res)=>{
  let proId = req.params.id;
  let product = await productHelpers.deleteProduct(proId).then((response)=>{
    res.redirect('/admin/all-products')
  })
})

router.get('/block/:id',verifyLogin,(req,res)=>{
  adminHelpers.block(req.params.id).then(()=>{
    res.redirect('/admin/users')
  })
  res.redirect('/admin/users')
})

router.get('/delete/:id',verifyLogin,(req,res)=>{
  let userId=req.params.id
  console.log(userId);
  adminHelpers.deleteUser(userId).then((response)=>{
    console.log(userId);
    res.redirect('/admin/users')
  })
})
router.get('/category',verifyLogin,function(req,res){
  productHelpers.showCategory().then((category)=>{
    res.render('admin/category',{category,admin:true})
  })
})
router.get('/add-category',verifyLogin,function(req,res){
  res.render('admin/add-category',{admin:true})
})
router.post('/add-category',verifyLogin,function(req,res){
  adminHelpers.addCategory(req.body).then((category)=>{
    res.redirect('/admin/category')
  })
})
router.get('/edit-category/:id',verifyLogin,async(req,res)=>{
  var id = req.params.id;
  let category = await adminHelpers.getCategory(id)
  res.render('admin/edit-category',{category,admin:true})
})
router.post('/edit-category',(req,res)=>{
  productHelpers.editCategory(req.body._id,req.body).then((result)=>{
    var id =req.body._id;
    res.redirect('/admin/category')
  })
})
router.get('/delete-category/:id',(req,res)=>{
  let id = req.params.id;
  adminHelpers.deleteCategory(id).then((response)=>{
    res.redirect('/admin/category')
  })
  
})
// brand
router.get('/brand',verifyLogin,function(req,res){
  adminHelpers.showBrand().then((brand)=>{
    res.render('admin/brand',{brand,admin:true})
  })
})
router.get('/add-brand',function(req,res){
  res.render('admin/add-brand',{admin:true})
})
router.post('/add-brand-image',function(req,res){
    let body = req.body.image;
    base64Date = body.replace(/^data:image\/png;base64,/, "")
    const fileName = path.join(__dirname,'../public/images/brand-images/','11.png')
    fs.writeFile(fileName, base64Date, 'base64', function(err){
      console.log(err);
      
    })

  res.json(true)
})
router.post('/add-brand',function(req,res){
  console.log(122333);
  console.log(req.body);
  adminHelpers.addBrand(req.body.brandname).then((category)=>{
    let id=category;
    let body = req.body.image;
    base64Date = body.replace(/^data:image\/png;base64,/, "")
    const fileName = path.join(__dirname,'../public/images/brand-images/',id+'.png')
    fs.writeFile(fileName, base64Date, 'base64', function(err){
      console.log(err);
      
    })

   res.json(true)

  })
})
router.get('/edit-brand/:id',async(req,res)=>{
  var id = req.params.id;
  let brand = await adminHelpers.getBrand(id)
  console.log(brand);
  res.render('admin/edit-brand',{brand,admin:true})

})
router.post('/edit-brand',(req,res)=>{
  console.log(req.body);
  adminHelpers.editBrand(req.body._id,req.body).then((result)=>{
    console.log("hiiirffii");
    var id =req.body._id;
    res.redirect('/admin/brand')
    if(req.files.image){
      let image=req.files.image
      image.mv('./public/images/brand-images/'+id+'.png')
    }
  })
})
router.get('/delete-brand/:id',(req,res)=>{   
  let id = req.params.id;
  adminHelpers.deleteBrand(id).then((response)=>{
    res.redirect('/admin/brand')
  })
  
})

// banner

router.get('/banner',verifyLogin,function(req,res){
  
  adminHelpers.showBanner().then((banner)=>{
    console.log(3333333333333333);
    
    console.log(banner);
    banner=banner[0]
    res.render('admin/banner',{banner,admin:true})
  })
})
router.get('/add-banner',function(req,res){
  res.render('admin/add-banner',{admin:true})
})
router.post('/add-banner',function(req,res){
  console.log("banner"+94949);
  console.log(req.body)
  adminHelpers.addBanner(req.body.name).then((id)=>{
    
      let image1 = req.body.image1;
      let image2 = req.body.image2;
      let image3 = req.body.image3;

      base64Date1 = image1.replace(/^data:image\/png;base64,/, "")
      const fileName1 = path.join(__dirname,'../public/images/banner-images/',id+'_1.png')
      fs.writeFile(fileName1, base64Date1, 'base64', function(err){
        console.log(err);
        
      })
  
      base64Date2 = image2.replace(/^data:image\/png;base64,/, "")
      const fileName2 = path.join(__dirname,'../public/images/banner-images/',id+'_2.png')
      fs.writeFile(fileName2, base64Date2, 'base64', function(err){
        console.log(err);
        
      })
  
      base64Date3 = image3.replace(/^data:image\/png;base64,/, "")
      const fileName3 = path.join(__dirname,'../public/images/banner-images/',id+'_3.png')
      fs.writeFile(fileName3, base64Date3, 'base64', function(err){
        console.log(err);
        
      })

      res.json(true)
   
  })
})
router.get('/edit-banner/:id',async(req,res)=>{
  var id = req.params.id;
  let banner = await adminHelpers.getBanner(id)
  console.log(banner);
  res.render('admin/edit-banner',{banner,admin:true})

})
router.post('/edit-banner',(req,res)=>{
  
  console.log(typeof(req.files));
  console.log(req.body_id);
  adminHelpers.editBanner(req.body._id,req.body).then((result)=>{
    console.log("hiiirffii");
    var id =req.body._id;
    res.redirect('/admin/banner')
    if(req.files.image){
      let image=req.files.image
      image.mv('./public/images/banner-images/'+id+'.png')
    }
    if(req.files){
      if(req.files.image1){ 
        let image1 = req.files.image1;
        image1.mv('./public/images/banner-images/'+id+'_1'+'.png')
      } 
      if(req.files.image2){
        let image2 = req.files.image2; 
        image2.mv('./public/images/banner-images/'+id+'_2'+'.png')
      }
      if(req.files.image3){
        let image3 = req.files.image3; 
        image3.mv('./public/images/banner-images/'+id+'_3'+'.png') 
      }
    }
  })
})
router.get('/delete-banner/:id',(req,res)=>{   
  let id = req.params.id;
  adminHelpers.deleteBanner(id).then((response)=>{
    res.redirect('/admin/banner')
  })
  
})
// router.get('/banner',(req,res)=>{
//   res.render('admin/banner',{admin:true})
// })
router.get('/orders',verifyLogin,(req,res)=>{
  adminHelpers.getAllOrders().then((orders)=>{
    res.render('admin/orders',{orders,admin:true})
  })
})

router.get('/edit-order/:id',verifyLogin,async(req,res)=>{
  let order = await userHelpers.getOrderProducts(req.params.id)
  console.log(44444);
  console.log(order);
  res.render('admin/edit-order',{admin:true,order})
})

router.get('/dispatched/:id',verifyLogin,(req,res)=>{
  adminHelpers.orderDispatched(req.params.id).then(()=>{
    res.redirect('/admin/edit-order/'+req.params.id)
})
})

router.get('/shipped/:id',(req,res)=>{
  adminHelpers.orderShipped(req.params.id).then(()=>{
    res.redirect('/admin/edit-order/'+req.params.id)
  })
})
router.get('/delivered/:id',(req,res)=>{
  adminHelpers.orderDelivered(req.params.id).then(()=>{
    res.redirect('/admin/edit-order/'+req.params.id+'#delivered')
  })
})
router.get('/reject/:id',(req,res)=>{
  adminHelpers.orderReject(req.params.id).then(()=>{
    res.redirect('/admin/edit-order/'+req.params.id)
  })
})

router.get('/coupon',verifyLogin,async(req,res)=>{
  offerproduct = await adminHelpers.showOffers()
  console.log("&***^*&*(((((");
  console.log(offerproduct);
  adminHelpers.showCoupon().then((coupon)=>{
    res.render('admin/coupon',{coupon,admin:true,offerproduct})
  })
})
router.get('/add-coupon',(req,res)=>{
  
  res.render('admin/add-coupon',{admin:true,Exist:req.session.couponExist})
  req.session.couponExist=false
})
router.post('/add-coupon',(req,res)=>{
  console.log(req.body);
  adminHelpers.couponExist(req.body.coupon).then((response)=>{
    if(response){

      req.session.couponExist=true
      res.redirect('/admin/add-coupon')

    }
    else{
      adminHelpers.addCoupon(req.body).then((response)=>{
        res.redirect('/admin/coupon')
      })

    }
  })
  
})

router.get('/coupon-active/:id',(req,res)=>{
  adminHelpers.couponActive(req.params.id).then(()=>{
    res.redirect('/admin/coupon')
  })
  res.redirect('/admin/coupon')
})

router.get('/delete-coupon/:id',(req,res)=>{   
  let id = req.params.id;
  adminHelpers.deleteCoupon(id).then((response)=>{
    res.redirect('/admin/coupon')
  })
  
})

router.get('/logout',(req,res)=>{
  req.session.admin=null
  res.redirect('/admin/')
})

router.get('/salesreport',(req,res)=>{
  adminHelpers.salesReport().then((orders)=>{
    res.render('admin/sales-report',{orders,admin:true, sales:req.session.dateSale,date:req.session.date,len:req.session.dateSalelength})
    req.session.dateSalelength=null
    req.session.date=null
    req.session.dateSale=null
  })
  
})
router.post('/target',(req,res)=>{
  adminHelpers.target(req.body).then((response)=>{
    console.log(response);
    res.redirect('/admin/dashboard')
  })
})
router.get('/offers',(req,res)=>{
  adminHelpers.offers().then((offers)=>{
    res.render('admin/offers')
  })
})
router.get('/add-offer',async(req,res)=>{
  let brand = await adminHelpers.showBrand()
    res.render('admin/add-offer',{brand})
})
router.post('/add-offer',(req,res)=>{
  adminHelpers.addOffer(req.body).then(()=>{
    res.redirect('/admin/coupon')
  })
  
})


router.get('/productoffers',(req,res)=>{
  adminHelpers.offers().then((offers)=>{
    res.render('admin/offers')
  })
})
router.get('/add-productoffer',async(req,res)=>{
  let productName = await adminHelpers.showProductName()
    res.render('admin/add-productoffer',{productName})
})
router.post('/add-productoffer',(req,res)=>{
  adminHelpers.addProductOffer(req.body).then(()=>{
    res.redirect('/admin/coupon')
  })
  
})

router.post('/salesReport-date',(req,res)=>{
  console.log(req.body)
  adminHelpers.dateSale(req.body).then((data)=>{
    console.log("%$##@");
    console.log(data.length);
    if(data.length==0)
    {
      req.session.dateSalelength=true
    }
    else{
      req.session.date=req.body
    req.session.dateSale=data
    }
    
    res.json(data)
  })
})

module.exports = router;   
  