const Product = require('../models/Product');
const Order = require('../models/Order')
const Story = require('../models/Story')
const Rating = require('../models/Rating')
const User = require('../models/User')

const { mutipleMongooseToObject } = require('../../util/mongoose');
const { mongooseToObjiect } = require('../../util/mongoose')

class SiteController {
    //[GET] /search
    search(req, res, next) {
        Product.find(
            {
                $text: {
                    $search: req.query.keyword,
                    $language: 'none', $diacriticSensitive: false, $caseSensitive: false
                }
            }
        )
            .then(productsSearch => {
                res.render('search', {
                    productsSearch: mutipleMongooseToObject(productsSearch)
                })
            })
            .catch(next);
    }

    //[GET] /huong-dan-mua-hang
    shoppingGuide(req, res, next) {
        res.render('mua-hang')
    }
    //[GET] /gioi-thieu
    show(req, res, next) {
        res.render('gioi-thieu')
    }

    //[GET] /tin-tuc
    showNews(req, res, next) {
        Story.find({})
            .then(stories => {
                res.render('news', {
                    stories: mutipleMongooseToObject(stories),
                })
            })
    }

    //[GET] /tin-tuc/:slug
    showNewsDetail(req, res, next) {
        Story.findOne({ slug: req.params.slug })
            .then((story) => {
                console.log(story)
                res.render('news/show', {
                    story: mongooseToObjiect(story),
                });
            })
            .catch(next);
    }

    //[GET] /gio-hang
    getCart(req, res, next) {
        req.user
            .populate('cart.items.productId')
            .then(user => {
                console.log(user)
                const products = user.cart.items
                let total = 0
                products.forEach(p => {
                    total += p.quantity * p.productId.price
                })
                res.render('cart', {
                    products: mutipleMongooseToObject(products),
                    total: total,
                })
            })
    }

    //[POST] /gio-hang
    addCart(req, res, next) {
        const prodId = req.body.productId
        const quantity = req.body.quantity
        Product.findById(prodId)
            .then(product => {
                return req.user.addToCart(product, quantity)
            })
            .then(result => {
                req.session.user = req.user
                return req.session.save(() => {
                    res.redirect('/gio-hang')
                })
            })
    }

    //[POST] /cart-delete-item
    postCartDeleteProduct = (req, res, next) => {
        const prodId = req.body.productId
        req.user
            .removeFromCart(prodId)
            .then(() => {
                req.session.user = req.user
                return req.session.save(() => {
                    res.redirect('/gio-hang')
                })
            })
    }

    //[POST] /create-order
    postOrder = (req, res, next) => {
        req.user
            .populate('cart.items.productId')
            .then(user => {
                const products = user.cart.items.map(i => {
                    return { quantity: i.quantity, product: { ...i.productId._doc } }
                })
                console.log(products)
                let total = 0
                products.forEach(p => {
                    total += p.quantity * p.product.price
                })
                const order = new Order({
                    user: {
                        email: req.user.email,
                        firstname: req.user.firstname,
                        lastname: req.user.lastname,
                        userId: req.user,
                    },
                    status: 'Chờ xác nhận',
                    name: req.body.name,
                    phone: req.body.phone,
                    address: req.body.address,
                    products: products,
                    tong_tien: total
                })
                return order.save()
            })
            .then(result => {
                return req.user.clearCart()
            })
            .then(() => {
                req.session.user = req.user
                return req.session.save(() => {
                    res.redirect('/don-hang')
                })
            })
    }

    chatRealTime = (req, res, next) => {
        res.render('chat')
    }

    //[GET] /don-hang
    getPurchase(req, res, next) {
        Order.find({ 'user.userId': req.user._id })
            .then(orders => {
                res.render('purchase', {
                    orders: mutipleMongooseToObject(orders),
                })
            })
    }

    //[GET] /danh-gia/:slug
    getEvaluate(req, res, next) {
        Product.findOne({ slug: req.params.slug })
            .then((product) => {
                res.render('evaluate', {
                    product: mongooseToObjiect(product),
                });
            })
            .catch(next);
    }

    //[POST] /danh-gia
    postEvaluate(req, res, next) {
        req.body.imgRating = req.files[0].path.split('\\').slice(2).join('/')
        console.log(req.body)
        const rating = new Rating({
            rating: req.body.rating,
            comment: req.body.comment,
            productId: req.body.productId,
            user: {
                email: req.user.email,
                firstname: req.user.firstname,
                lastname: req.user.lastname,
                userId: req.user,
            },
            imgRating: req.body.imgRating,
        })

        rating
            .save()
            .then(() => {
                console.log([rating._id])
                Product.updateOne({ _id: req.body.productId }, { $push: { danh_gia: [{ ratingId: rating._id }] } })
                    .then(() => res.redirect('/don-hang'))
            })
            .catch(next)
    }

    //[GET] /tai-khoan
    showProfile(req, res, next) {
        User.findOne({ email: req.user.email })
            .then(user => {
                res.render('profile', {
                    user: mongooseToObjiect(user),
                })
            })
    }

    // [POST] /tai-khoan
    postProfile(req, res, next) {
        User.updateOne({ email: req.user.email }, {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            phone: req.body.phone,
            address: req.body.address
        })
            .then(() => res.redirect('/tai-khoan'))
            .catch(next)
    }

    //[GET] /
    index(req, res, next) {
        res.render('home')
    }
}

module.exports = new SiteController;
