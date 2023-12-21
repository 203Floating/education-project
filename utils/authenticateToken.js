const crypto = require("crypto")

const JWT_SECRET_KEY =
  "be07e7093fefeaaf95f54c2b350d7810fdfdgdfgdfgdfgdfgsdgfdg487f4d87g48df4g84df84g8df4g84df87g4"

const authenticateToken = (request, response, next) => {
  const token = request.header("Authorization")?.split(" ")[1]

  if (!token) {
    return response
      .status(401)
      .json({ status: false, message: "Access denied. No token provided." })
  }
  const { username, password } = request.session.userobj
  // 验证 token
  const concatenatedString = `${username}${password}${JWT_SECRET_KEY}`
  const sha1Hash = crypto.createHash("sha1").update(concatenatedString).digest()
  const shastr = sha1Hash.toString("hex")

  if (token !== shastr) {
    return response.status(401).json({
      status: false,
      message: "Invalid token.",
      concatenatedString: concatenatedString,
      sha1Hash: sha1Hash,
      shastr: shastr,
      token: token,
    })
  }

  // 将用户信息添加到请求对象中
  request.user = {
    username: request.query.username,
    password: request.query.password,
  }

  // 继续处理请求
  next()
}

module.exports = authenticateToken
