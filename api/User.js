require('dotenv').config();
const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();

var jwt = require("jsonwebtoken");

const User = require("../models/UserModel");

function authentificateToken(req , res, next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(403).send({ message: "Le token est vide!" });
      }
    
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
          return res.status(401).send({ message: "Non authoriser!" });
        }
        req.user = user;
        next();
      });
}

router.get("/user", authentificateToken, (req, res) => {
    User.findOne().then(result => {
        res.json({
            status : "200",
            erreur : false,
            message : "user connecter",
            data : result
        })
    })
    .catch(err => {
        console.log(err);
    })
})

router.delete("/user", authentificateToken, (req, res) => {
    User.findOneAndDelete().then(result => {
        res.json({
            status : "200",
            erreur : false,
            message : "suppression user",
            data : req.User
        })
    })
    .catch(err => {
        console.log(err);
    })
})


router.put("/user", authentificateToken , (req, res) => {
    let {firstname , lastname , email , password , date_naissance , sexe} = req.body;
    firstname = firstname.trim();
    lastname = lastname.trim();
    email = email.trim();
    password = password.trim();
    date_naissance = date_naissance.trim();
    sexe = sexe.trim();

    if(firstname == "" || lastname == "" || email == "" || password == "" || date_naissance == "" || sexe == ""){
        res.json({
            status : "401",
            erreur : true,
            message : "L'une ou plusieurs données obligatoire sont manquante"
        })
    } else if(!/^[a-zA-Z ]*$/.test(firstname) || !/^[a-zA-Z ]*$/.test(lastname) || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email) || !new Date(date_naissance).getTime() || password.length < 8){
        res.json({
            status : "401",
            erreur : true,
            message : "L'une ou plusieurs données obligatoire ne sont pas conforme"
        })
    } else {
        const mdp = 10;

        bcrypt.hash(password, mdp).then(hashedPassword => {
            let id = req.body.id;
            const newUser = new User({
                firstname,
                lastname,
                email,
                password : hashedPassword,
                date_naissance,
                sexe
            });

            User.update(newUser , {
                where: {_id : id}
            }).then(result => {
                res.json({
                    status : 200,
                    erreur : false,
                    message : "Utlisateur a bien été modifier avec succès",
                    data : result,
                });
            })
            .catch(err => {
                console.log(err);
            });
        })
        .catch(err => {
            console.log(err);
        });
    };
})

router.post("/register", (req, res) => {
    let {firstname , lastname , email , password , date_naissance , sexe} = req.body;
    firstname = firstname.trim();
    lastname = lastname.trim();
    email = email.trim();
    password = password.trim();
    date_naissance = date_naissance.trim();
    sexe = sexe.trim();

    if(firstname == "" || lastname == "" || email == "" || password == "" || date_naissance == "" || sexe == ""){
        res.json({
            status : "401",
            erreur : true,
            message : "L'une ou plusieurs données obligatoire sont manquante"
        })
    } else if(!/^[a-zA-Z ]*$/.test(firstname) || !/^[a-zA-Z ]*$/.test(lastname) || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email) || !new Date(date_naissance).getTime() || password.length < 8){
        res.json({
            status : "401",
            erreur : true,
            message : "L'une ou plusieurs données obligatoire ne sont pas conforme"
        })
    } else {
        User.find({email}).then(result => {
            if(result.length){
                res.json({
                    status : "401",
                    erreur : true,
                    message : "L'utilisateur existe déja "
                })
            } else {
                const mdp = 10;

                bcrypt.hash(password, mdp).then(hashedPassword => {
                    const newUser = new User({
                        firstname,
                        lastname,
                        email,
                        password : hashedPassword,
                        date_naissance,
                        sexe
                    });

                    newUser.save().then(result => {
                        res.json({
                            status : 200,
                            erreur : false,
                            message : "Utlisateur a bien été créé avec succès",
                            data : result,
                        });
                    })
                    .catch(err => {
                        console.log(err);
                    });
                })
                .catch(err => {
                    console.log(err);
                });
            };
        })
        .catch(err => {
            console.log(err);
        });
    };
})


router.post("/login", (req, res) => {
    let {email , password} = req.body;
    email = email.trim();
    password = password.trim();

    if(email == "" || password == ""){
        res.json({
            status: 500,
            erreur : true,
            message : "Email ou mot de passe manquante",
        });
    } else {
        User.find({email})
        .then(data => {
            if(data.length) {
                const hashedPassword = data[0].password;
                bcrypt.compare(password, hashedPassword).then(result => {
                    if(result){
                        var token = jwt.sign({ data }, process.env.ACCESS_TOKEN_SECRET, {
                            expiresIn: 86400
                        });
                        res.json({
                            status : 200,
                            erreur : false,
                            message : "L'utilisateur a été authentifié avec succès",
                            accessToken: token,
                            data : data,
                        })

                    } else {
                        res.json({
                            status : 500,
                            erreur : true,
                            message : "Mot de passe invalide",
                        })
                    }
                })
                .catch(err => {
                    console.log(err);
                });
            } else {
                res.json({
                    status : 500,
                    erreur : true,
                    message : "Votre email est éroné",
                })
            }
        })
        .catch(err => {
            console.log(err);
        })
    }
})

module.exports = router;