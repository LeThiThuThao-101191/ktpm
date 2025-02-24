const crypto = require('crypto')

const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')
const { validationResult } = require('express-validator/check')

const User = require('../models/User');



class AuthController {

    getLogin(req, res, next) {
        res.render('auth/login', {
            errorMessage: req.flash('error'),
            oldInput: {
                email: '',
                password: '',
                confirmPassword: ''
            },
            validationErrors: []

        });
    }

    postLogin(req, res, next) {
        const email = req.body.email
        const password = req.body.password
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(422).render('auth/login', {
                errorMessage: errors.array()[0].msg,
                oldInput: { email: email, password: password },
                validationErrors: errors.array()
            })
        }
        User.findOne({ email: email })
            .then(user => {
                if (!user) {
                    return res.status(422).render('auth/login', {
                        errorMessage: 'Email hoặc mật khẩu không hợp lệ!',
                        oldInput: { email: email, password: password },
                        validationErrors: []
                    })
                }
                bcrypt
                    .compare(password, user.password)
                    .then(doMatch => {
                        if (doMatch) {
                            req.session.isLoggedIn = true
                            req.session.user = user
                            req.session.role = user.role
                            return req.session.save(() => {
                                res.redirect('/')
                            })
                        }
                        return res.status(422).render('auth/login', {
                            errorMessage: 'Email hoặc mật khẩu không hợp lệ!',
                            oldInput: { email: email, password: password },
                            validationErrors: []
                        })
                    })
                    .catch(() => {
                        res.redirect('/dang-nhap')
                    })
            })
            .catch(next)

    }
    postLogout(req, res, next) {
        req.session.destroy(() => {
            res.redirect('/')
        })
    }

    getSignup(req, res, next) {
        res.render('auth/signup', {
            errorMessage: req.flash('error'),
            oldInput: {
                firstname: '',
                lastname: '',
                email: '',
                password: '',
                confirmPassword: ''
            },
            validationErrors: []
        });
    }

    postSignup(req, res, next) {
        const firstname = req.body.firstname
        const lastname = req.body.lastname
        const email = req.body.email
        const password = req.body.password
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            console.log(errors.array())
            return res.status(422).render('auth/signup', {
                errorMessage: errors.array()[0].msg,
                oldInput: { firstname: firstname, lastname: lastname, email: email, password: password, confirmPassword: req.body.confirmPassword },
                validationErrors: errors.array()
            })
        }
        bcrypt
            .hash(password, 12)
            .then(hashedPassword => {
                const user = new User({
                    firstname: firstname,
                    lastname: lastname,
                    email: email,
                    password: hashedPassword,
                    role: 2,
                    cart: {
                        items: []
                    }
                })
                return user.save()
            })
            .then(result => {
                res.redirect('/dang-nhap')
                return transporter.sendMail({
                    to: email,
                    from: 'mvt16102001@gmail.com',
                    subject: 'Đăng ký thành công',
                    html: '<h1>Bạn đã đăng ký thành công!</h1>'
                })
            })
            .catch(next)
    }
}

module.exports = new AuthController;