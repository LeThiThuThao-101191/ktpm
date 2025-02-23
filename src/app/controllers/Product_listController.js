const Product = require('../models/Product');

const { mutipleMongooseToObject } = require('../../util/mongoose')

class Product_listController {
    show_raucu(req, res, next) {
        Product.find({ product_type: "rau củ" })
            .then(products => {
                res.render('product_list/rau-cu', {
                    products: mutipleMongooseToObject(products),
                })
            })
            .catch(next);
    }

    show_sinhto(req, res, next) {
        Product.find({ product_type: "sinh tố" })
            .then(products => {
                res.render('product_list/sinh-to', {
                    products: mutipleMongooseToObject(products),
                })
            })
            .catch(next);
    }

    show_thucphamtuoisong(req, res, next) {
        Product.find({ product_type: "thực phẩm tươi sống" })
            .then(products => {
                res.render('product_list/thuc-pham-tuoi-song', {
                    products: mutipleMongooseToObject(products),
                })
            })
            .catch(next);
    }

    show_hoaqua(req, res, next) {
        Product.find({ product_type: "hoa quả" })
            .then(products => {
                res.render('product_list/hoa-qua', {
                    products: mutipleMongooseToObject(products),
                })
            })
            .catch(next);
    }

    show_cacloaihat(req, res, next) {
        Product.find({ product_type: "các loại hạt" })
            .then(products => {
                res.render('product_list/cac-loai-hat', {
                    products: mutipleMongooseToObject(products),
                })
            })
            .catch(next);
    }

    show_giavi(req, res, next) {
        Product.find({ product_type: "gia vị" })
            .then(products => {
                res.render('product_list/gia-vi', {
                    products: mutipleMongooseToObject(products),
                })
            })
            .catch(next);
    }

    show_ngucoc(req, res, next) {
        Product.find({ product_type: "ngũ cốc" })
            .then(products => {
                res.render('product_list/ngu-coc', {
                    products: mutipleMongooseToObject(products),
                })
            })
            .catch(next);
    }

    show_sieuthucpham(req, res, next) {
        Product.find({ product_type: "siêu thực phẩm" })
            .then(products => {
                res.render('product_list/sieu-thuc-pham', {
                    products: mutipleMongooseToObject(products),
                })
            })
            .catch(next);
    }

}

module.exports = new Product_listController;
