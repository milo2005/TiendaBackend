var express = require("express");
var router = express.Router();

router.use((req, res, next) => {
    console.log("Entro Request en Items");
    next();
});

function middlewareSaludo(req, res, next) {
    console.log("Hola como estas?");
    next();
}

router.get("/", (req, res, next) => {
    // let nombre = req.query.q;
    // let limit = req.query.limit;
    // limit = limit ? parseInt(limit) : 0;
    //res.send({ nombre: nombre, limite: limit });

    req.db.query("SELECT * FROM items", (err, result) => {
        if (err) {
            res.status(500)
                .send({ err: "Error al consultar items" });
        } else {
            res.send(result);
        }
    });
});

router.get("/:id", middlewareSaludo, (req, res, next) => {
    let id = req.params.id;
    // if (id === '1') {
    //     res.send({ item: id });
    // } else {
    //     res.status(404)
    //         .send({ err: "Item no encontrado" })
    // }
    req.db.query("SELECT * FROM items WHERE iditems = ?"
        , [id], (err, results) => {
            if (err) {
                res.status(500)
                    .send({ err: "Error al obtener item" });
            } else if (results.length == 0) {
                res.status(404)
                    .send({ err: "Item no encontrado" });
            } else {
                res.send(results[0]);
            }
        });
});

router.post("/", (req, res, next) => {
    let item = req.body;
    req.db.query("INSERT INTO items SET ?", [item],
        (err, results) => {
            if (err) {
                res.status(500)
                    .send({ err: "Error al insertar item" });
            } else {
                res.send({ success: true });
            }
        }
    );
});

router.put("/:id", (req, res, next) => {
    let id = req.params.id;
    let item = req.body;
    req.db.query("UPDATE items SET "
        + " nombre = ?, "
        + " precio = ?,"
        + " marca = ? WHERE iditems = ?",
        [item.nombre, item.precio,
        item.marca, item.id],
        (err, results) => {
            if (err) {
                res.status(500)
                    .send({ err: "Error al actualizar" });
            } else {
                res.send({ success: true });
            }
        }
    );
});

router.delete("/:id", (req, res, next) => {
    let id = req.params.id;
    req.db.query("DELETE FROM items WHERE iditems = ?",
        [id], (err, results) => {
            if (err) {
                res.status(500)
                    .send({err:"Error al eliminar item"});
            }else{
                res.send({success:true});
            }
        }
    );
});

module.exports = router;