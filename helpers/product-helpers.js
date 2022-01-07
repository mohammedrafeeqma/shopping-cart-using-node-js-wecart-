var db = require('../config/connection')
var collection = require('../config/collection');
const { ObjectId, ObjectID } = require('bson');

module.exports = {
    addProduct:(product,callback)=>{
        console.log("add products");
        var obj={
            Name:product.Name,
            category:product.category,
            brand:product.brand,
            description:product.description,
            price:product.price,
            size:{"s":product.s,"m":product.m,"l":product.l, "xl":product.xl}
        }
       
        console.log(obj);
        db.get().collection(collection.PRODUCT_COLLECTION).insertOne(obj).then((data)=>{
            console.log(data);
            callback(data.insertedId)
        })

    },
    showProducts:()=>{
        return new Promise( async (resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).find().toArray().then((data)=>{
                resolve(data)
            })
        })
    },
    editProduct:(uId,data)=>{
        console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
        console.log(data);
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION)
            .updateOne({_id:ObjectId(uId)},
            {
                $set:{
                    Name:data.Name,
                    category:data.category,
                    brand:data.brand,
                    description:data.description,
                    price:data.price,
                    size:{"s":data.s,"m":data.m,"l":data.l, "xl":data.xl}

                }
            }).then((response)=>{
                console.log(response);
                resolve(response)
            })
        })
    },
    deleteProduct:(proId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({_id:ObjectId(proId)}).then((response)=>{
                resolve(response )
            })
        })
    },
    showCategory:()=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.CATEGORY_COLLECTION).find().toArray().then((data)=>{
                resolve(data)
            })
        })
    },
    editCategory:(uId,data)=>{
        
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.CATEGORY_COLLECTION)
            .updateOne({_id:ObjectId(uId)},
            {
                $set:{
                    Name:data.Name
                }
            }).then((response)=>{
                // console.log(response);
                resolve(response)
            })
        })
    },
    getCartCount:(uId)=>{
        return new Promise(async(resolve,reject)=>{
            let count = 0
            let cart = await db.get().collection(collection.CART_COLLECTION).findOne({user:ObjectId(uId)})
            if(cart){
                count = cart.products.length
            }
            resolve(count)
        })
    },
    getProductDetails:(proId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:ObjectId(proId)}).then((response)=>{
                resolve(response)
                console.log(response);
            })
        })
    }
}