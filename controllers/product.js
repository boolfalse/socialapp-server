
const mongoose = require('mongoose');
const port = process.env.PORT || 3000;

const Product = require('../models/product');
const Order = require("../models/order");
const model_name = Product.model_name;
const model_docs = Product.model_docs;



exports.get_products = (req, res, next) => {
    Product.find()
        .select('name price image _id')
        // .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                items: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        image: doc.image,
                        _id: doc._id,
                        request: {
                            description: 'get_' + model_name,
                            type: 'GET',
                            url: 'http://localhost:' + port + '/' + model_docs + '/' + doc._id,
                            body: {}
                        },
                    }
                })
            };

            // if(docs.length >= 0) {
            res.status(200).json({
                success: true,
                message: 'Got ' + model_docs,
                data: response
            });
            // } else {
            //     res.status(403).json({
            //         success: true,
            //         message: "Have not any item there.",
            //     });
            // }
        })
        .catch(err => {
            res.status(500).json({
                success: false,
                message: err
            });
        });
};

exports.get_product = (req, res, next) => {
    const itemId = req.params.itemId;
    Product.findById(itemId)
        .select('name price image _id')
        // .exec()
        .then(doc => {
            if(doc) {
                // res.status(200).json(doc);
                res.status(200).json({
                    success: true,
                    message: "Found Data.",
                    data: doc,
                    request: {
                        description: 'update_' + model_name,
                        type: 'PATCH',
                        url: 'http://localhost:' + port + '/' + model_docs + '/' + itemId,
                        body: {
                            name: 'String',
                            price: 'Number',
                            image: 'Image'
                        }
                    }
                });
            } else {
                return res.status(403).json({
                    success: false,
                    message: model_name + ' not found!',
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                success: false,
                message: err
            });
        });
};

exports.create_product = (req, res, next) => {
    const createdItem = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        image: req.file.path
    });

    createdItem.save()
        .then(result => {
            res.status(201).json({
                success: true,
                message: "Item was successfully created!",
                data: {
                    name: result.name,
                    price: result.price,
                    image: result.image,
                    _id: result._id,
                    request: {
                        description: 'delete_' + model_name,
                        type: 'DELETE',
                        url: 'http://localhost:' + port + '/' + model_docs + '/' + result._id,
                        body: {}
                    }
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                success: false,
                message: err
            });
        });
};

exports.delete_product = (req, res, next) => {
    const itemId = req.params.itemId;
    Product.remove({
        _id: itemId
    })
    // .exec()
        .then(result => {
            res.status(200).json({
                success: true,
                message: "Item successfully deleted.",
                data: result,
                request: {
                    description: 'create_' + model_name,
                    type: 'POST',
                    url: 'http://localhost:' + port + '/' + model_docs,
                    body: {
                        name: 'String',
                        price: 'Number',
                        image: 'Image'
                    }
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                success: false,
                message: err
            });
        });
};

exports.update_product = (req, res, next) => {
    const itemId = req.params.itemId;
    const updateOps = {};

    for(let key in req.body){
        updateOps[key] = req.body[key];
    }

    Product.update({ _id: itemId }, { $set: updateOps })
    // .exec()
        .then(result => {
            res.status(200).json({
                success: true,
                message: "Item successfully updated.",
                data: result,
                request: {
                    description: 'create_' + model_name,
                    type: 'POST',
                    url: 'http://localhost:' + port + '/' + model_docs,
                    body: {
                        name: 'String',
                        price: 'Number',
                        image: 'Image'
                    }
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                success: false,
                message: err
            });
        });
};

// --------------------------------------------------------

exports.get_orders = (req, res, next) => {
    Order.find()
        .select('product_id quantity _id')
        .populate('product_id', 'name price image')
        // .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                items: docs.map(doc => {
                    return {
                        product_id: doc.product_id,
                        quantity: doc.quantity,
                        _id: doc._id,
                        request: {
                            description: 'get_' + model_name,
                            type: 'GET',
                            url: 'http://localhost:' + port + '/' + model_docs + '/' + doc._id,
                            body: {}
                        },
                    }
                })
            };

            // if(docs.length >= 0) {
            res.status(200).json({
                success: true,
                message: 'Got ' + model_docs,
                data: response
            });
            // } else {
            //     res.status(403).json({
            //         success: true,
            //         message: "Have not any item there.",
            //     });
            // }
        })
        .catch(err => {
            res.status(500).json({
                success: false,
                message: err
            });
        });
};

exports.get_order = (req, res, next) => {
    const itemId = req.params.itemId;
    Order.findById(itemId)
        .select('product_id quantity _id')
        .populate('product_id', 'name price image')
        // .exec()
        .then(doc => {
            if(doc) {
                // res.status(200).json(doc);
                res.status(200).json({
                    success: true,
                    message: "Found Data.",
                    data: doc,
                    request: {
                        description: 'update_' + model_name,
                        type: 'PATCH',
                        url: 'http://localhost:' + port + '/' + model_docs + '/' + itemId,
                        body: {
                            product_id: 'String',
                            quantity: 'Number'
                        }
                    }
                });
            } else {
                return res.status(403).json({
                    success: false,
                    message: model_name + ' not found!',
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                success: false,
                message: err
            });
        });
};

exports.create_order = (req, res, next) => {

    let product_id = req.body.product_id;
    Product.findById(product_id)
        .then(product => {
            if(product) {
                const createdItem = new Order({
                    _id: new mongoose.Types.ObjectId(),
                    product_id: product_id, // product._id
                    quantity: req.body.quantity
                });

                return createdItem.save();
            }
            else {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found!'
                });
            }
        })
        .then(result => {
            res.status(201).json({
                success: true,
                message: "Item was successfully created!",
                data: {
                    product_id: product_id, // result.product_id,
                    quantity: result.quantity,
                    _id: result._id,
                    request: {
                        description: 'delete_' + model_name,
                        type: 'DELETE',
                        url: 'http://localhost:' + port + '/' + model_docs + '/' + result._id,
                        body: {}
                    }
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                success: false,
                message: 'Product not found!'
            });
        });

};

exports.delete_order = (req, res, next) => {
    const itemId = req.params.itemId;
    Order.remove({
        _id: itemId
    })
        // .exec()
        .then(result => {
            res.status(200).json({
                success: true,
                message: "Item successfully deleted.",
                data: result,
                request: {
                    description: 'create_' + model_name,
                    type: 'POST',
                    url: 'http://localhost:' + port + '/' + model_docs,
                    body: {
                        product_id: 'String',
                        quantity: 'Number'
                    }
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                success: false,
                message: err
            });
        });
};

exports.update_order = (req, res, next) => {
    const itemId = req.params.itemId;
    const updateOps = {};

    for(let key in req.body){
        updateOps[key] = req.body[key];
    }

    Order.update({ _id: itemId }, { $set: updateOps })
        // .exec()
        .then(result => {
            res.status(200).json({
                success: true,
                message: "Item successfully updated.",
                data: result,
                request: {
                    description: 'create_' + model_name,
                    type: 'POST',
                    url: 'http://localhost:' + port + '/' + model_docs,
                    body: {
                        product_id: 'String',
                        quantity: 'Number'
                    }
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                success: false,
                message: err
            });
        });
};
