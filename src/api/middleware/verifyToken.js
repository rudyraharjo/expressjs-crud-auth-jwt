import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        res.status(401).json({
            status: false,
            message: "Unauthorize token null",
        });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decode) => {
        if (err) {
            res.status(401).json({
                status: false,
                message: "Unauthorize token not valid (" + err.message + ")",
            });
        }
        req.id = decode.userId;
        req.email = decode.userEmail;
        req.role_id = decode.userRoleId
        next();
    })
}