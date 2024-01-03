//导入 2个模块
//生成token
const jwt = require("jsonwebtoken")
//解析token
const { expressjwt: expressJWT } = require("express-jwt")

//jwt配置
const jwtConfig = {
  //密钥：自定义
  secretKey: "lynn_zhangsn_jwttoken_::>_<::",
  //加密方式
  //HS256 使用同一个「secret_key」进行签名与验证
  //RS256 是使用 RSA 私钥进行签名，使用 RSA 公钥进行验证。
  algorithms: ["HS256"],
  unlessPath: ["/users"],
}

//解析配置
const jwtAuth = expressJWT({
  secret: jwtConfig.secretKey,
  algorithms: jwtConfig.algorithms,
  //获取请求中 头部或url带的token值
  getToken: function fromHeaderOrQuerystring(req) {
    if (
      req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Bearer"
    ) {
      return req.headers.authorization.split(" ")[1]
    } else if (req.query && req.query.token) {
      return req.query.token
    }
    return null
  },
}).unless({ path: jwtConfig.unlessPath })

//生成token
const tokenStr = (user) => {
  return `Bearer ${jwt.sign(user, jwtConfig.secretKey, {
    expiresIn: "1d",
    // 有效期一天 1d，
    // 有效期30小时 30h
    // 有效期120秒  120s
  })}`
}

module.exports = { jwtAuth, tokenStr }
