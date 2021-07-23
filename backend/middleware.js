const jwt= require ('jsonwebtoken')
const SECRET_KEY = "pixels"
exports.verifyUser = (req,res,next) => {
    /****** getting the token from header ***/
    let token =req.cookies['x-auth-token']?req.cookies['x-auth-token']:req.headers['x-auth-token']
    if (!token && !apiKey) return res.status(401).send({"status": false, "code": 401, "msg": "TOKEN_NOT_FOUND "});
    try{
      const decodedTokenData=jwt.verify(token, SECRET_KEY)
      req.user=decodedTokenData.user 
      req.session.username = req.user.username
      next();
    }
    catch(exception) {
        res.status(401).send({"status": false, "code": 401, "msg": "INVALID_TOKEN"});
    }
  }
