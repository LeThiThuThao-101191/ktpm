const express = require('express')
const router = express.Router()

const product_listController = require('../app/controllers/Product_listController')

router.get('/rau-cu', product_listController.show_raucu)
router.get('/sinh-to', product_listController.show_sinhto)
router.get('/thuc-pham-tuoi-song', product_listController.show_thucphamtuoisong)
router.get('/hoa-qua', product_listController.show_hoaqua)
router.get('/cac-loai-hat', product_listController.show_cacloaihat)
router.get('/gia-vi', product_listController.show_giavi)
router.get('/ngu-coc', product_listController.show_ngucoc)
router.get('/sieu-thuc-pham', product_listController.show_sieuthucpham)

module.exports = router;
