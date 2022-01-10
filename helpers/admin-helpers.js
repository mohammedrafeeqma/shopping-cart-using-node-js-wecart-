var db = require('../config/connection')
var collection = require('../config/collection')
const bcrypt = require('bcrypt')
var objectId = require('mongodb').ObjectId
const { response } = require('express')

module.exports = {
    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let loginStatus = false;
            let response = {}
            let user = await db.get().collection(collection.ADMIN_COLLECTION).findOne({ $and: [{ username: userData.username }, { password: userData.password }] })
            if (user) {

                response.user = user
                response.status = true
                resolve(response)
            }
            else {
                resolve({ status: false })
            }
        })
    },
    viewUsers: () => {
        return new Promise((res, rej) => {
            db.get().collection(collection.USER_COLLECTION).find().toArray().then((data) => {
                res(data)
            })
        })
    },
    getProductDetails: (uId) => {

        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).findOne({ _id: objectId(uId) }).then((response) => {

                resolve(response)

            })
        })

    },
    block: (uId) => {
        return new Promise(async (resolve, reject) => {
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ _id: objectId(uId) })
            console.log("testin:" + user.access);
            if (user.access) {
                value = user.access = false

            } else {
                value = user.access = true

            }
            // console.log("testin:"+user.access);
            db.get().collection(collection.USER_COLLECTION).updateOne({ _id: objectId(uId) },
                {
                    $set: {
                        access: value
                    }
                })
        }).then((response) => {
            console.log("dattt");
            resolve()
        })
    },
    emailExist: (userdata) => {
        return new Promise((res, rej) => {
            db.get().collection(collection.USER_COLLECTION).findOne({ email: userdata.email }).then((data) => {
                res(data)
            })
        })
    },
    mobileExist: (userdata) => {

        return new Promise((res, rej) => {
            db.get().collection(collection.USER_COLLECTION).findOne({ mobile: userdata.mobile }).then((data) => {
                res(data)
            })
        })
    },

    deleteUser: (uId) => {
        return new Promise((resolve, reject) => {
            // console.log(uId);
            db.get().collection(collection.USER_COLLECTION).deleteOne({ _id: objectId(uId) }).then((response) => {
                console.log("response: " + resolve)
                resolve(response)
            })
        })
    },
    addCategory: (data) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.CATEGORY_COLLECTION).insertOne(data).then((response) => {
                resolve()
            })
        })
    },
    getCategory: (id) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.CATEGORY_COLLECTION).findOne({ _id: objectId(id) }).then((response) => {
                resolve(response)
            })
        })
    },
    deleteCategory: (id) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.CATEGORY_COLLECTION).deleteOne({ _id: objectId(id) }).then((response) => {
                resolve(response)
            })
        })
    },
    showCategory: () => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.CATEGORY_COLLECTION).find().toArray().then((response) => {
                resolve(response)
            })
        })
    },
    // brand
    addBrand: (data) => {
        return new Promise((resolve, reject) => {
            console.log(data);
            var obj = {
                brandName: data
            }
            console.log(12121);
            db.get().collection(collection.BRAND_COLLECTION).insertOne(obj).then((response) => {
                console.log("rseses  " + response.insertedId);
                console.log(response);
                resolve(response.insertedId)
            })
        })
    },
    getBrand: (id) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.BRAND_COLLECTION).findOne({ _id: objectId(id) }).then((response) => {
                resolve(response)
            })
        })
    },
    deleteBrand: (id) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.BRAND_COLLECTION).deleteOne({ _id: objectId(id) }).then((response) => {
                resolve(response)
            })
        })
    },
    showBrand: () => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.BRAND_COLLECTION).find().toArray().then((response) => {
                resolve(response)
            })
        })
    },
    editBrand: (uId, data) => {

        return new Promise((resolve, reject) => {
            db.get().collection(collection.BRAND_COLLECTION)
                .updateOne({ _id: objectId(uId) },
                    {
                        $set: {
                            Name: data.Name
                        }
                    }).then((response) => {
                        // console.log(response); 
                        resolve(response)
                    })
        })
    },

    //banner
    addBanner: (data) => {
        console.log(data);
        var obj = {
            name: data
        }
        return new Promise((resolve, reject) => {
            db.get().collection(collection.BANNER_COLLECTION).insertOne(obj).then((response) => {

                resolve(response.insertedId)
            })
        })
    },
    getBanner: (id) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.BANNER_COLLECTION).findOne({ _id: objectId(id) }).then((response) => {
                resolve(response)
            })
        })
    },
    deleteBanner: (id) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.BANNER_COLLECTION).deleteOne({ _id: objectId(id) }).then((response) => {
                resolve(response)
            })
        })
    },
    showBanner: () => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.BANNER_COLLECTION).find().toArray().then((response) => {
                console.log("banner");
                console.log(response);
                resolve(response)
            })
        })
    },
    editBanner: (uId, data) => {

        return new Promise((resolve, reject) => {
            db.get().collection(collection.BANNER_COLLECTION)
                .updateOne({ _id: objectId(uId) },
                    {
                        $set: {
                            Name: data.Name
                        }
                    }).then((response) => {
                        // console.log(response); 
                        resolve(response)
                    })
        })
    },
    getMainBanner: () => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.BANNER_COLLECTION).find().toArray().then((response) => {
                console.log("banner");
                console.log(response);
                resolve(response[0])
            })
        })

    },
    getAllOrders: () => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.ORDER_COLLECTION).aggregate([{
                $group: {
                    _id: "$_id", orders: { $push: "$$ROOT" }
                }
            },
            {
                $unwind: "$orders"
            },
            {
                $sort: {
                    "orders._id": -1
                }
            }
            ]).toArray().then((response) => {
                console.log("order admin");
                console.log(response);
                resolve(response)
            })

        })
    },
    orderDispatched: (orderId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.ORDER_COLLECTION).updateOne({ _id: objectId(orderId) },
                {
                    $set: {
                        order_status: "dispatched"
                    }
                }).then((response) => {
                    resolve()
                })
        })
    },
    orderShipped: (orderId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.ORDER_COLLECTION).updateOne({ _id: objectId(orderId) },
                {
                    $set: {
                        order_status: "shipped"
                    }
                }).then((response) => {
                    resolve()
                })
        })
    },
    orderDelivered: (orderId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.ORDER_COLLECTION).updateOne({ _id: objectId(orderId) },
                {
                    $set: {
                        order_status: "delivered",
                        delivered: true
                    }
                }).then((response) => {
                    resolve()
                })
        })
    },
    orderReject: (orderId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.ORDER_COLLECTION).updateOne({ _id: objectId(orderId) },
                {
                    $set: {
                        order_status: "Rejected"
                    }
                }).then((response) => {
                    resolve()
                })
        })
    },
    addCoupon: (data) => {
        let obj = {
            coupon: data.coupon,
            discount: data.discount,
            expireAt: new Date(data.expireDate),
            active: true
        }

        return new Promise((resolve, reject) => {

            db.get().collection(collection.COUPON_COLLECTION).insertOne(obj).then((response) => {

                resolve(response)
            })
        })
    },
    couponExist:(coupon)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.COUPON_COLLECTION).findOne({coupon:coupon}).then((response)=>{
                resolve(response)
            })
        })
    },
    showCoupon: () => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.COUPON_COLLECTION).find().toArray().then((response) => {
                resolve(response)
            })
        })
    },
    couponActive: (uId) => {
        return new Promise(async (resolve, reject) => {
            let coupon = await db.get().collection(collection.COUPON_COLLECTION).findOne({ _id: objectId(uId) })
            console.log("testin:" + coupon.access);
            if (coupon.active) {
                value = coupon.active = false

            } else {
                value = coupon.active = true

            }
            // console.log("testin:"+user.access);
            db.get().collection(collection.COUPON_COLLECTION).updateOne({ _id: objectId(uId) },
                {
                    $set: {
                        active: value
                    }
                })
        }).then((response) => {
            console.log("dattt");
            resolve()
        })
    },

    deleteCoupon: (id) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.COUPON_COLLECTION).deleteOne({ _id: objectId(id) }).then((response) => {
                resolve(response)
            })
        })
    },
    menCount: () => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.ORDER_COLLECTION).find({ "products.category": "Men" }).count().then((response) => {
                resolve(response)
            })
        })
    },
    womenCount: () => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.ORDER_COLLECTION).find({ "products.category": "Women" }).count().then((response) => {
                resolve(response)
            })
        })
    },
    nikeCount: () => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.ORDER_COLLECTION).find({ "products.brand": "Nike" }).count().then((response) => {
                resolve(response)
            })
        })
    },
    addidasCount: () => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.ORDER_COLLECTION).find({ "products.brand": "addidas" }).count().then((response) => {
                resolve(response)
            })
        })
    },
    pumaCount: () => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.ORDER_COLLECTION).find({ "products.brand": "puma" }).count().then((response) => {
                resolve(response)
            })
        })
    },
    orderCount: () => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.ORDER_COLLECTION).find().count().then((response) => {
                resolve(response)
            })
        })
    },
    customerCount: () => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).find().count().then((response) => {
                resolve(response)
            })
        })
    },
    revenue: () => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.ORDER_COLLECTION).aggregate([
                { $match: { status: "paid" } },
                {
                    $group: {
                        _id: {},
                        totalAmount: { $sum: "$grandtotal" }
                    }
                }]).toArray().then((response) => {
                    console.log(response);
                    resolve(response[0].totalAmount)
                })

        })
    },
    pendingOrder: () => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.ORDER_COLLECTION).find({ order_status: "pending" }).count().then((response) => {
                resolve(response)
            })
        })

    },
    salesReport: () => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.ORDER_COLLECTION).aggregate([{
                $match: {
                    status: "paid"
                }
            }, {
                $unwind: "$products"
            },
            {
                $group: { _id: { name: '$products.name', price: "$products.price", brand: "$products.brand" }, quantity: { $sum: "$products.quantity" } }
            },
            {
                $sort: { quantity: -1 , total:-1}
            }]).toArray().then((response) => {
                console.log(response);
                resolve(response)
            })
        })
    },
    target: (data) => {

        return new Promise((resolve, reject) => {
            db.get().collection(collection.TARGET_COLLECTION).updateOne({},
                {
                    $set: {
                        orderTarget: parseInt(data.order_target),
                        customerTarget: parseInt(data.customer_target),
                        revenueTarget: parseInt(data.revenue_target)

                    }
                }).then((response) => {
                    resolve(response)
                })
        })
    },
    showTarget: () => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.TARGET_COLLECTION).findOne().then((response) => {
                resolve(response)
            })
        })
    },
    addOffer: (data) => {
        return new Promise(async (resolve, reject) => {
            const result = await db.get().collection(collection.PRODUCT_COLLECTION).find({ brand: data.brand }).toArray()

            console.log((result));
            for (const x of result) {

                let offerprice = parseInt(x.price)-(parseInt(x.price) * parseInt(data.discount)/100)
                offerprice =~~offerprice+1
                db.get().collection(collection.PRODUCT_COLLECTION).update({_id:x._id, brand: data.brand },
                    {
                        $set: {
                            offer: parseInt(data.discount),
                            offerprice: offerprice
                        }
                    }).then((response) => {
                        resolve(response)
                    })

            }

        })
    },
    january:() =>{
        var date1 = new Date("2022-01-01")
        var date2 = new Date("2022-01-30")
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.ORDER_COLLECTION).aggregate([
            {
                $match:{
                    $and:[
                  {orderDate:{$gte:(date1)}},
                   {orderDate:{$lte:(date2)}}
                 ]
               }

                
            },
            {
                $count:"item"
            }
            ]).toArray().then((response)=>{
                console.log(55);
                console.log(response[0].item);
                resolve(response[0].item)
            })
        })
    },
    feb:() =>{
        var date1 = new Date("2022-02-01")
        var date2 = new Date("2022-02-29")
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.ORDER_COLLECTION).aggregate([
            {
                $match:{
                    $and:[
                  {orderDate:{$gte:(date1)}},
                   {orderDate:{$lte:(date2)}}
                 ]
               }

                
            },
            {
                $count:"item"
            }
            ]).toArray().then((response)=>{
                console.log(55);
                if(response.length==0)
                {
                    resolve(0)
                }
                else{
                    console.log(response[0].item);
                resolve(response[0].item)
                }
                
            })
        })
    },
    janRevenue: () => {
        var date1 = new Date("2022-01-01")
        var date2 = new Date("2022-01-29")
        return new Promise((resolve, reject) => {
            db.get().collection(collection.ORDER_COLLECTION).aggregate([
                {
                    $match:{
                        $and:[
                      {orderDate:{$gte:(date1)}},
                       {orderDate:{$lte:(date2)}}
                     ]
                   }
                },
                { $match: { status: "paid" } },
                {
                    $group: {
                        _id: {},
                        totalAmount: { $sum: "$grandtotal" }
                    }
                }]).toArray().then((response) => {
                    console.log(response);
                    resolve(response[0].totalAmount)
                })

        })
    },
    febRevenue: () => {
        var date1 = new Date("2022-02-01")
        var date2 = new Date("2022-02-29")
        return new Promise((resolve, reject) => {
            db.get().collection(collection.ORDER_COLLECTION).aggregate([
                {
                    $match:{
                        $and:[
                      {orderDate:{$gte:(date1)}},
                       {orderDate:{$lte:(date2)}}
                     ]
                   }
                },
                { $match: { status: "paid" } },
                {
                    $group: {
                        _id: {},
                        totalAmount: { $sum: "$grandtotal" }
                    }
                }]).toArray().then((response) => {
                    console.log(response);
                    if(response.length==0)
                {
                    resolve(0)
                }
                else{
                    console.log(response[0].item);
                resolve(response[0].item)
                }
                })

        })
    },
    dateSale:(data)=>{
        return new Promise((resolve,reject)=>{
            var startdate = new Date(data.startDate) 
            var enddate = new Date(data.endDate) 
            db.get().collection(collection.ORDER_COLLECTION).aggregate([
                {
                    $match:{
                        $and:[
                      {orderDate:{$gte:(startdate)}},
                       {orderDate:{$lte:(enddate)}}
                     ]
                   }
                },
                {
                $match: {
                    status: "paid"
                }
            }, {
                $unwind: "$products"
            },
            {
                $group: { _id: { name: '$products.name', price: "$products.price", brand: "$products.brand" }, quantity: { $sum: "$products.quantity" } }
            },
            {
                $sort: { quantity: -1, total:-1 }
            }]).toArray().then((response) => {
                console.log("+++++++++++++++++++++++++++++++++");
                console.log(response);
                resolve(response)
            })
        })
    },
    showProductName:()=>{
        
            return new Promise((resolve, reject) => {
                db.get().collection(collection.PRODUCT_COLLECTION).find({},{_id:0,Name:1}).toArray().then((response) => {
                    resolve(response)
                })
            })
        
    },
    addProductOffer: (data) => {
        return new Promise(async (resolve, reject) => {
            const result = await db.get().collection(collection.PRODUCT_COLLECTION).find({ Name: data.brand }).toArray()

            console.log((result));
            for (const x of result) {

                let offerprice = parseInt(x.price)-(parseInt(x.price) * parseInt(data.discount)/100)
                offerprice =~~offerprice+1
                db.get().collection(collection.PRODUCT_COLLECTION).update({_id:x._id, Name: data.brand },
                    {
                        $set: {
                            offer: parseInt(data.discount),
                            offerprice: offerprice
                        }
                    }).then((response) => {
                        resolve(response)
                    })

            }

        })
    },
    showOffers:()=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).find().toArray().then((response)=>{
                resolve(response)
            })
        })

    }

}



