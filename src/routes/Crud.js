const express = require('express');
const router = express.Router();
const passport = require('../lib/passport');
const helpers = require("../lib/helpers");


const pool = require('../database');
const { isloggedIn} = require('../lib/auth');

router.get('/add', async (req, res) => {
    const usuario = await pool.query('SELECT * FROM tbl_usuario');
    res.render('crud/add', {usuario});
});

router.post('/Cruds/addUser', async (req, res) => {
    const {
        nombre,
        apellido,
        telefono,
        correo,
        contraseña_us
    } = req.body;
    const newUsers = {
        nombre,
        apellido,
        telefono,
        correo,
        contraseña_us,
    };
    console.log(newUsers);
    newUsers.contraseña_us = await helpers.encryptPassword(contraseña_us); //se descifre la contraseña nueva de un nuevo usuario
     const result = await pool.query("INSERT INTO tbl_usuario SET ? ", [newUsers]); //Se guarda la constraseña en la BD 
    newUsers.id_usuario = result.insertId;
    res.redirect('/Cruds/add');
    return done(null, newUsers); //Para que se alamacene en una nueva fila
    
});

router.get('/delete/:id_usuario', async (req, res) => {
    const {
        id_usuario
    } = req.params;
    await pool.query('DELETE FROM tbl_usuario WHERE id_usuario = ?', [id_usuario]);
    res.redirect('/Cruds/add');
});

router.get('/edit/:id_usuario', async (req, res) => {
    const {
        id_usuario
    } = req.params;
    const usuarios = await pool.query('SELECT * FROM tbl_usuario WHERE id_usuario =?', [id_usuario]);
    res.render('crud/edit', {
        tbl_usuario : usuarios[0]
    });
});

router.post('/edit/:id_usuario', async (req, res) => {
    const {
        nombre,
        apellido,
        telefono,
        correo,
        contraseña_us,
    } = req.body;
    const {
        id_usuario
    } = req.params;
    const newUser = {
        nombre,
        apellido,
        telefono,
        correo,
        contraseña_us,
    };
    await pool.query('UPDATE tbl_usuario set ? WHERE id_usuario = ?', [newUser, id_usuario]);
    res.redirect('/Cruds/add');
});



// router.get('/', isLoggedIn, async (req, res) => {
//     const links = await pool.query('SELECT * FROM links WHERE user_id = ?', [req.user.id]);
//     res.render('links/list', {
//         links
//     });
// });

// router.get('/delete/:id', async (req, res) => {
//     const {
//         id
//     } = req.params;
//     await pool.query('DELETE FROM links WHERE ID = ?', [id]);
//     req.flash('success', 'Link Removed Successfully');
//     res.redirect('/links');
// });

// router.get('/edit/:id', async (req, res) => {
//     const {
//         id
//     } = req.params;
//     const links = await pool.query('SELECT * FROM links WHERE id = ?', [id]);
//     console.log(links);
//     res.render('links/edit', {
//         link: links[0]
//     });
// });

// router.post('/edit/:id', async (req, res) => {
//     const {
//         id
//     } = req.params;
//     const {
//         title,
//         description,
//         url
//     } = req.body;
//     const newLink = {
//         title,
//         description,
//         url
//     };
//     await pool.query('UPDATE links set ? WHERE id = ?', [newLink, id]);
//     req.flash('success', 'Link Updated Successfully');
//     res.redirect('/links');
// });

module.exports = router;