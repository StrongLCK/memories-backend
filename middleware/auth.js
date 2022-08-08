
import jwt from "jsonwebtoken";
//wants to like a post
//click the like button => auth middleware(next)=>like controller...

const auth = async (req, res, next) => {
    try {
        //console.log(req.headers);
        //split("Bear ") due to client/src/api/index.js (not split("Bear"))
        //split(" ") not split("")
        const token = req.headers.authorization.split(" ")[1];
        //console.log(token);
        const isCustomAuth = token.length < 500;
        let decodedData;
        if (token && isCustomAuth) {
            decodedData = jwt.verify(token, process.env.TOKEN_SECRET);
            // console.log(decodedData);
            req.userId = decodedData?.id; //.id due to ../controllers/user.js
        } else {
            decodedData = jwt.decode(token);
            req.userId = decodedData?.sub;

        }
        next();

    } catch (error) {
        console.log(error);
    }
};

export default auth;
