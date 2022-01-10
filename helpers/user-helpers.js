var db = require('../config/connection')
var collection = require('../config/collection')
const bcrypt = require('bcrypt')
var objectId = require('mongodb').ObjectId;
var Razorpay = require('razorpay');
const paypal = require('paypal-rest-sdk');
const { response } = require('express');
const { resolve } = require('path');
var instance = new Razorpay({
    key_id: 'rzp_test_R7ncH3P3rsEiai',
    key_secret: 'cJ1EQ3BMZyDqjFJQjtS7fvsC',
  });

  paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AdMdSdN3418iqxTwH00Vbp8fiVq0k3f9q7d2nMh_dEl0WhMV77oZh3xbo7DTgcX7FAg3zjmi48txDjsd',
    'client_secret': 'EL-gfL_LCYRLEKVUE2AWqZ8NZ4FRAWGQNlFb5io8kLiX8gJ-ic_KFeUBmoQmUNybNQK71T47UcT32Cj4'
  });

module.exports = {
    doSignup:(userData)=>{
        let d = Math.floor((Math.random() * 1000) + 3);
                    d=d.toString()
                    var date = new Date()
                    var year =date.getFullYear();
                    var month = date.getMonth();
                    var day = date.getDate();
                    
                    var time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
              console.log(time);
                    var date = year + "/" + month + "/" + day + " "+time;
        return new Promise( async(resolve,reject)=>{
            var obj={
                firstname:userData.firstname,
                lastname:userData.lastname,
                username:userData.username,
                mobile:userData.mobile,
                email:userData.email,
                password:userData.password = await bcrypt.hash(userData.password,10),
                access:true,
                date: new Date(date),
                address:[{
                    _id: d,
                    username:userData.username, 
                    mobile:userData.mobile,
                    address:userData.address,
                    pincode:userData.pincode,
                    locality:userData.locality,
                    city:userData.city,
                    state:userData.state 
                }]
            }
            
            
            db.get().collection(collection.USER_COLLECTION).insertOne(obj).then( (data)=>{
                
                resolve(data)
            })
        })
    },
    doLogin:(userData)=>{
        return new Promise( async(resolve,reject)=>{
            let loginStatus=false
            let response={}
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({email:userData.email})
            if(user){
                console.log(3);
                bcrypt.compare(userData.password,user.password).then( (status)=>{
                    if(status){
                        response.user=user;
                        response.status=true;
                        resolve(response)
                    }else{
                        resolve({status:false})
                    }
                })
            }
            else{
                resolve({status:false})
            }

        })
    },
    eachProductDetails:(prodId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:objectId(prodId)}).then((response)=>{
                console.log(response);
                console.log("hi heloll el");
                resolve(response)
            })
        })


    },
    
    addToCart:(prodId,userId,product)=>{
        console.log("************************");
        console.log(product);
       
        price =parseInt(product.price)
        let proObj={
            item:objectId(prodId.proId),
            size:prodId.size,
            quantity:1,
            price:price,
            name:product.Name,
            brand:product.brand,
            category:product.category,
            offerprice:product.offerprice

            
        }
        
        return new Promise(async(resolve,reject)=>{
            let userCart = await db.get().collection(collection.CART_COLLECTION).findOne({user:objectId(userId)})
            if(userCart){
                console.log(userCart);
                let proExist = userCart.products.findIndex(product=>product.item==prodId.proId && product.size==prodId.size)
                console.log(proExist);
                if(proExist!=-1){
                    
                    db.get().collection(collection.CART_COLLECTION)
                    .updateOne({user:objectId(userId),'products.item':objectId(prodId.proId)},
                    {
                        $inc:{'products.$.quantity':1}
                    })
                }else{
                    ;
                    db.get().collection(collection.CART_COLLECTION)
                .updateOne({user:objectId(userId)},
                {
                    $push:{products:proObj}
                }).then((response)=>{
                     resolve()
                })
               

                }
                
            }
            else{
                let cartObj = {
                    user:objectId(userId),
                    products:[proObj]
                }
                db.get().collection(collection.CART_COLLECTION).insertOne(cartObj).then((response)=>{
                    resolve()
                })
            }
        })
    },
    getCartProducts:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            let cartItems = await db.get().collection(collection.CART_COLLECTION).aggregate([
                {
                    $match:{user:objectId(userId)}
                },
                {
                    $unwind: '$products'
                },
                {
                    $project:{
                        item:'$products.item',
                        quantity:'$products.quantity',
                        size:"$products.size"
                    }
                },
                {
                    $lookup:{
                        from: collection.PRODUCT_COLLECTION,
                        localField: 'item',
                        foreignField: '_id',
                        as:'product'
                    }
                },
                {
                    $project:{
                        item:1,
                        quantity:1,
                        size:1,
                        product:{$arrayElemAt:['$product',0]}

                    }
                }
                
                // {
                //     $lookup:{
                //         from:collection.PRODUCT_COLLECTION,
                //         let:{prodList:'$products'},
                //         pipeline:[
                //             {
                //                 $match:{
                //                     $expr:{
                //                         $in:['$_id',"$$prodList"]
                //                     }
                //                 }
                //             }
                //         ],
                //         as:'cartItems'
                //     }
                // }
            ]).toArray()
            // console.log(cartItems[0].product);
           
            resolve(cartItems)
        })
    },
    changeProductQuantity:(details)=>{
        count = parseInt(details.count)
        quantity = parseInt(details.quantity)
        return new Promise((res,rej)=>{
            if(details.count==-1 && details.quantity==1){
                // db.get().collection(collection.CART_COLLECTION)
                // .updateOne({_id:objectId(details.cart)},
                // {
                //     $pull:{products:{item:objectId(details.product)}}
                // }).then((response)=>{
                //     res({removeProduct:true})
                // })
                res({removeProduct:true})
            }
            
            else{
                if(details.quantity>=10)
                {
                    count=0
                    details.quantity=9
                }
                console.log(("&&&&&&&&&&&&&&&"));
                console.log(details);
                db.get().collection(collection.CART_COLLECTION)
                    .updateOne({_id:objectId(details.cart),'products.item':objectId(details.product)},
                    {
                        $inc:{'products.$.quantity':count}
                    }).then((response)=>{
                        res(response)
                    })

            }
            
        })
    },
    deleteFromCart:(proId,uId)=>{
        return new Promise((res,rej)=>{
            db.get().collection(collection.CART_COLLECTION)
        .updateOne({user:objectId(uId)},
        {
            $pull:{products:{item:objectId(proId)}}
        }).then((response)=>{
            res({removeProduct:true})
        })
        })
        

    },
    getSubTotal:(prodId,uId)=>{
        return new Promise(async(resolve,reject)=>{
            let subTotal = await db.get().collection(collection.CART_COLLECTION).aggregate([
            {$match:{$and:[{user: objectId(uId)}]}},
            {$unwind:"$products"},
            {$match:{"products.item":objectId(prodId)}},
            {$group:{_id:"$products"}},
            {$unwind:"$_id"},
            {$project:{"_id.item":1,"_id.quantity":1,"_id.price":1,total:{$multiply:["$_id.offerprice","$_id.quantity"]}}}
            ]).toArray()
            if(subTotal.length==0)
            {
                resolve()
            }
            else{ 
                resolve(subTotal[0].total)
            }
            
        })
        
    },
    getTotalAmount:(userId)=>{  
        return new Promise(async(resolve,reject)=>{
            let total = await db.get().collection(collection.CART_COLLECTION).aggregate([
                {
                    $match:{user:objectId(userId)}
                },
                {
                    $unwind: '$products'
                },
                {
                    $project:{
                        item:'$products.item',
                        quantity:'$products.quantity'
                    }
                },
                {
                    $lookup:{
                        from: collection.PRODUCT_COLLECTION,
                        localField: 'item',
                        foreignField: '_id',
                        as:'product'
                    }
                },
                {
                    $project:{
                        item:1,
                        quantity:1,
                        product:{$arrayElemAt:['$product',0]}

                    }
                },
                {
                    $group:{
                        _id:null,
                        total:{$sum:{$multiply: ['$quantity', {$toInt: '$product.offerprice'}]}}
                    }
                }
            ]).toArray()
            console.log("ieiei");
            console.log(total.length);
            if(total.length==0)
            {
                resolve()
            }
            else{ 
                resolve(total[0].total)
            }
              
        })

    },
    getUserDetails:(uId)=>{
        
        return new Promise ((resolve,reject)=>{
            db.get().collection(collection.USER_COLLECTION).findOne({_id:objectId(uId)}).then((response)=>{
        
                resolve(response)
                
            })
        })
        
    },
    addToOrders:(discount,grandtotal,order,total,product,address,uId,billingAddress)=>{
        var d = new Date()
        var year =d.getFullYear();
        var month = d.getMonth();
        var day = d.getDate();
        
        var time = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
  console.log(time);
        var date = year + "/" + month + "/" + day + " "+time;
        return new Promise((resolve,reject)=>{
            let status = order.paymentMethod==='COD'?'cod':'pending'
            let orderObj = {
                
                item:product[0].item,
                deliveryaddress:address,
                billingAddress:billingAddress,
                products:product,
                status:status,
                order_status:"pending",
                order:true,
                userId:uId,
                paymentMethod:order.paymentMethod,
                orderDate:new Date(),
                total:total,
                discount,
                grandtotal:grandtotal
            }
            db.get().collection(collection.ORDER_COLLECTION).insertOne(orderObj).then((response)=>{
                if(order.paymentMethod==='COD')
                {
                    db.get().collection(collection.CART_COLLECTION).remove({user:objectId(uId)})
                }
                
                console.log(response);
                resolve(response.insertedId)
            })
        })
    },
    getDeliveryAddress:(uId,deliveryAddress)=>{
        return new Promise((resolve,reject)=>{ 
            console.log(833838);
            console.log(deliveryAddress);
            
            
           let add= db.get().collection(collection.USER_COLLECTION).aggregate([{
               $match:{
                "address._id":deliveryAddress
               }
           },
        {
            $unwind:"$address"
        },{
            $match:{
                "address._id":deliveryAddress
            }
        },
    {
        $project:{
            _id:0,
            address:{
                _id:1,
                username:1,
                mobile:1,
                address:1,
                pincode:1,
                locality:1,
                city:1,
                state:1
            }
        }
    }
]).toArray()
                
                console.log("address");
                console.log(add);
                resolve(add) 
            })
        
    },


    getBillingAddress:(uId)=>{
        return new Promise((resolve,reject)=>{ 
            console.log(833838);
            
            
            
           let billingadd= db.get().collection(collection.USER_COLLECTION).aggregate([{
               $match:{
                _id:objectId(uId)
               }
           },
           {
               $unwind:"$address"
           },
           {
               $project:{
                   _id:0,
                
                address:1
               }
           }
]).toArray()
                
                console.log("billing address");
                console.log(billingadd.address);
                console.log(billingadd);
                resolve(billingadd) 
            })
        
    },

    
    getUserOrders:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            let orders = await db.get().collection(collection.ORDER_COLLECTION).aggregate([{
                $match:{
                    userId:userId
                }
            },
            {
                $group:{
                    _id:"$_id",orders:{$push:"$$ROOT"}
                }
            },
            {
                $unwind:"$orders"
            },
            {
                $sort:{
                    "orders.orderDate":-1
                }
            }
        ]).toArray()
            console.log("teees ss");
            console.log(userId);
            console.log(orders);
            resolve(orders)
        })
    },
    getLastOrders:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            let orders = await db.get().collection(collection.ORDER_COLLECTION).aggregate([{
                $match:{
                    userId:userId
                }
            },
            {
                $sort:{
                    _id:-1
                }
            },
            {
                $limit:1
            },
            {
                $unwind:"$products"
            }
        ]).toArray()
            console.log("teees ss");
            console.log(userId);
            console.log(orders[0]);
            resolve(orders[0])
        })
    },
    getCartProductsList:(uId)=>{
        return new Promise(async(resolve,reject)=>{
            let cart = await db.get().collection(collection.CART_COLLECTION).findOne({user:objectId(userId)})
            if(cart.products)
            {
                resolve(cart.products)
            }
            else{
                resolve(cart)
            }
        })
    },
    updateAddress:(data,uId)=>{
        return new Promise((resolve,reject)=>{
                    let d = Math.floor((Math.random() * 1000) + 3);
                    d=d.toString()
                    console.log(d);
                    var obj={
                        _id: d,
                        username:data.username, 
                        mobile:data.mobile,
                        address:data.address,
                        pincode:data.pincode,
                        locality:data.locality,
                        city:data.city,
                        state:data.state 

                    }
        db.get().collection(collection.USER_COLLECTION).updateOne({_id:objectId(uId)},{"$push":{"address":obj}}).then((response)=>{
            console.log(response);
            resolve(response)
        })

        })
    },
    getOrderProducts:(orderId)=>{
        return new Promise(async(resolve,reject)=>{
            let orderItems = await db.get().collection(collection.ORDER_COLLECTION).aggregate([
                {
                    $match:{_id:objectId(orderId)}
                },
                
                {
                    $unwind: '$deliveryaddress'
                }
                
            ]).toArray()
            console.log("hi hello ");
            console.log(orderItems);
            console.log(orderItems[0]);
            resolve(orderItems[0])
        })
    },


    addToWishlist:(prodId,userId,product)=>{
        price =parseInt(product.price)
        
        console.log("testing......");
        console.log(prodId);
        let proObj={
            item:objectId(prodId),
            price:price,
            status:true
            
        }
        console.log(proObj);
        return new Promise(async(resolve,reject)=>{
            let userWishlist = await db.get().collection(collection.WISHLIST_COLLECTION).findOne({user:objectId(userId)})
            if(userWishlist){
                console.log(userWishlist);
                let proExist = userWishlist.products.findIndex(product=>product.item==prodId)
                console.log(proExist);
                if(proExist!=-1){
                    
                    // db.get().collection(collection.CART_COLLECTION)
                    // .updateOne({user:objectId(userId),'products.item':objectId(prodId.proId)},
                    // {
                    //     $inc:{'products.$.quantity':1}
                    
                    // })
                    resolve("error")
                }else{
                    ;
                    db.get().collection(collection.WISHLIST_COLLECTION)
                .updateOne({user:objectId(userId)},
                {
                    $push:{products:proObj}
                }).then((response)=>{
                     resolve("success")
                })
               

                }
                
            }
            else{
                let cartObj = {
                    user:objectId(userId),
                    products:[proObj]
                }
                db.get().collection(collection.WISHLIST_COLLECTION).insertOne(cartObj).then((response)=>{
                    resolve()
                })
            }
        })
    },
    removeWishlist:(wId,uId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.WISHLIST_COLLECTION).update({user:objectId(uId)},{$pull:{products:{item:objectId(wId)}}}).then((response)=>{
                resolve(response)
            })
        })
        
        

    },
    getWishlistProducts:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            let wishlistitems = await db.get().collection(collection.WISHLIST_COLLECTION).aggregate([
                {
                    $match:{user:objectId(userId)}
                },
                {
                    $unwind: '$products'
                },
                {
                    $project:{
                        item:'$products.item'
                    }
                },
                {
                    $lookup:{
                        from: collection.PRODUCT_COLLECTION,
                        localField: 'item',
                        foreignField: '_id',
                        as:'product'
                    }
                },
                {
                    $project:{
                        item:1,
                        quantity:1,
                        size:1,
                        product:{$arrayElemAt:['$product',0]}

                    }
                }
                
               
            ]).toArray()
            // console.log(cartItems[0].product);
            resolve(wishlistitems)
        })
    },
    generateRazorpay:(orderId,total)=>{
        
        console.log(orderId);
        return new Promise((resolve,reject)=>{
            var options ={
                amount:total*100,
                currency:"INR",
                //reciept:"receipt#1",
                notes: {
                    key1: "value3",
                    key2: "value2"
                }
            };
            instance.orders.create(options, function(err, order){
                if(err){
                    console.log(err);
                }else{
                    console.log("new order: "+order);
                    console.log(order);
                    resolve(order)
                }
            })
              
              
        })
    },
    verifyPayment:(details,uId)=>{
        console.log(98765);
        return new Promise((resolve,reject)=>{
            console.log(12345);
            let crypto = require('crypto')
            let hmac = crypto.createHmac('sha256','cJ1EQ3BMZyDqjFJQjtS7fvsC')
            hmac.update(details.payment.razorpay_order_id+'|'+details.payment.razorpay_payment_id);
            hmac = hmac.digest('hex')
            console.log(6565656);
            console.log(hmac);
            console.log(details.payment.razorpay_signature);
            if(hmac==details.payment.razorpay_signature){
                db.get().collection(collection.CART_COLLECTION).remove({user:objectId(uId)})
                console.log(9999);
                resolve()
            }
            else{
                console.log(8888);
                reject()
            }


        })
    },



    
    changePaymentStatus:(orderId,paymentMethod)=>{
        console.log(555);
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.ORDER_COLLECTION).updateOne({_id:objectId(orderId)},
            {
                $set:{
                    status:'paid',
                    paymentMethod:paymentMethod
                }
            }).then(()=>{
                resolve()
            })
        })
    },
    user:(uid)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.USER_COLLECTION).findOne({_id:objectId(uid)}).then((response)=>{
                resolve(response)
            })
        })
    },
    userEdit:(uId,data)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.USER_COLLECTION).updateOne({_id:objectId(uId)},{
                $set:{
                    firstname:data.firstname,
                    lastname:data.lastname,
                    username:data.username,
                    mobile:data.mobile,
                    email:data.email

                }
            }).then((response)=>{
                console.log(response);
                resolve(response)
            })
        })
    },
    updatePassword:(uId,password)=>{
        return new Promise(async(resolve,reject)=>{
            password = await bcrypt.hash(password.password,10)
            db.get().collection(collection.USER_COLLECTION).updateOne({_id:objectId(uId)},
            {
                $set:{
                    password:password
                }
            }).then((response)=>{
                resolve(response)
            })
        })
    },
    passwordCheck:(uId,password)=>{
        return new Promise(async(resolve,reject)=>{
            let user= await db.get().collection(collection.USER_COLLECTION).findOne({_id:objectId(uId)})
            if(user){
               
                bcrypt.compare(password.currentpassword,user.password).then((status)=>{
                    if(status){
                        resolve(response)
                    }
                    else{
                        reject()
                    }
                })
            }

        })
    },
    men:()=>{
    
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).find({category:"Men"}).toArray().then((response)=>{
                resolve(response)
            })
        })
    },
    women:()=>{
        
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).find({category:"Women"}).toArray().then((response)=>{
                resolve(response)
            })
        })
    },
    orderCancel:(orderId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.ORDER_COLLECTION).updateOne({_id:objectId(orderId)},
            {
                $set:{
                    order:false
                }
            }).then((response)=>{
                resolve()
            })
    })
},
removeAddress:(data,uId)=>{
    return new Promise((resolve,reject)=>{
        db.get().collection(collection.USER_COLLECTION).updateOne({_id:objectId(uId)},{$pull:{address:{_id:data}}}).then((response)=>{
            resolve(response)
        })
    })
},
editAddress:(data,uId)=>{
    var obj= {
        _id:data._id,
        username:data.username,
        mobile:data.mobile,
        address:data.address,
        pincode:data.pincode,
        locality:data.locality,
        city:data.city,
        state:data.state
    }
    console.log(55555);
    console.log(obj);
    return new Promise((resolve,reject)=>{
        db.get().collection(collection.USER_COLLECTION).updateOne({_id:objectId(uId),"address._id":data._id},{$set:{"address.$":obj}}).then((response)=>{
            console.log(response);
            resolve(response)
        })
    })
},
getAddress:(Aid)=>{
    return new Promise((resolve,reject)=>{
        db.get().collection(collection.USER_COLLECTION).aggregate([{$match:{"address._id":Aid}},
        {$unwind:"$address"},
        {$match:{"address._id":Aid}},
    {
        $project:{
            _id:0,
            address:1

        }
    }]).toArray().then((response)=>{
        
        resolve(response[0])
    })
    })
},
updateProfile:(uId)=>{
    return new Promise((resolve,reject)=>{
        db.get().collection(collection.USER_COLLECTION).update({_id:objectId(uId)},{$set:{profile:true}}).then((response)=>{
            resolve()
        })
    })
},
verifyCoupon:(data)=>{
   
    return new Promise((resolve,reject)=>{
        db.get().collection(collection.COUPON_COLLECTION).findOne({coupon:data.coupon}).then((response)=>{
            console.log(response)
            console.log(878778);
            resolve(response)
        })
    })
},
removerFromCart:(uId)=>{
    return new Promise((resolve,reject)=>{
        db.get().collection(collection.CART_COLLECTION).remove({user:objectId(uId)})
    })
},
couponList:(coupon,uId)=>{
    var obj={
        coupon:objectId(coupon._id),
        user:objectId(uId)
    }
    return new Promise((resolve,reject)=>{
        db.get().collection(collection.COUPON_LIST).insert(obj).then((response)=>{
            resolve(response)
        })
    })
},
couponPermission:(coupon,uId)=>{
    
    return new Promise((resolve,reject)=>{
        db.get().collection(collection.COUPON_LIST).find({coupon:objectId(coupon),user:objectId(uId)}).toArray().then((response)=>{
            console.log("88888888");
            console.log(coupon);
            console.log(uId);
            console.log(response);
            resolve(response[0])
        })
    })
},
nike:()=>{
    
    return new Promise((resolve,reject)=>{
        db.get().collection(collection.PRODUCT_COLLECTION).find({brand:"Nike"}).toArray().then((response)=>{
            resolve(response)
        })
    })
},
searchProduct:(product)=>{
    console.log(11);
    console.log(product.sample_search);
    return new Promise((resolve,reject)=>{
        db.get().collection(collection.PRODUCT_COLLECTION).find({Name:{$regex:".*"+product.sample_search+".*"}}).toArray().then((response)=>{
            console.log(response);
            resolve(response)
        })
    })
}
    
}
//db.user.updateOne({"email":"rafeequemaz11@gmail.com"},
//{"$push":{"address":{"username":"rafeeq","mobile":"123456","address":"mogral",pincode:"123",locality:"puthur",city:"kasaragod",state:"kerala"}}})
