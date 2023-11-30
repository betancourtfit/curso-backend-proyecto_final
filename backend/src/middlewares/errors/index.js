import EError from "../../services/errors/enum.js";

const errorHandler = (err, req, res, next) => {

    if (err.code === EError.VALIDATION_ERROR) {
        return res.status(400).send({ mensaje: err.message });
    }
    if (err.code === EError.AUTHENTICATION_ERROR) {
        return res.status(401).send({ mensaje: err.message });
    }
    if (err.code === EError.AUTHORIZATION_ERROR) {
        return res.status(403).send({ mensaje: err.message });
    }
    if (err.code === EError.NOT_FOUND_ERROR) {
        return res.status(404).send({ mensaje: err.message });
    }
    if (err.code === EError.BAD_REQUEST_ERROR) {
        return res.status(400).send({ mensaje: err.message });
    }
    if (err.code === EError.FORBIDDEN_ERROR) {
        return res.status(403).send({ mensaje: err.message });
    }
    if (err.code === EError.INTERNAL_SERVER_ERROR) {
        return res.status(500).send({ mensaje: err.message });
    }
    if (err.code === EError.DATABASE_ERROR) {
        return res.status(500).send({ mensaje: err.message });
    }
    if (err.code === EError.INVALID_TYPE_ERROR) {
        return res.status(400).send({ mensaje: err.message });
    }
    res.status(500).send({ mensaje: 'Error interno del servidor' });
}

export default errorHandler;