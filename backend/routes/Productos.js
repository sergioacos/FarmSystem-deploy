const express = require('express');
const router = express.Router();
const Producto= require('../models/producto')
router.get('/', async(req, res)=>{
    try{
        const arrayProductosBD= await Producto.find()
        console.log(arrayProductosBD)
        /*res.render("productos",{arrayProductos:arrayProductosBD

         })*/
    } catch(error){
        console.log(error)
    }
    
})
module.exports = router;