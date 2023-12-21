const express = require("express")
const router = express.Router()
const DButils = require("../utils/DButils")
const { success, error } = require("../utils/msg")
const crypto = require("crypto")
router.post("/", async function (request, response, next) {
  const { username, password } = request.body
  try {
    if (username === undefined || password === undefined) {
      response.send(error("用户名或密码不能为空"))
      return
    }
    const data = await DButils.excute(useSql.loginSql, [username, password])
    if (data.length === 0) {
      response.send(error("用户名或密码错误"))
      return
    } else {
      const JWT_SECRET_KEY =
        "be07e7093fefeaaf95f54c2b350d7810fdfdgdfgdfgdfgdfgsdgfdg487f4d87g48df4g84df84g8df4g84df87g4"
      request.session.JWT_SECRET_KEY = JWT_SECRET_KEY
      const concatenatedString = `${username}${password}${JWT_SECRET_KEY}`
      const sha1Hash = crypto
        .createHash("sha1")
        .update(concatenatedString)
        .digest()
      const shastr = sha1Hash.toString("hex")
      request.session.token = shastr
      request.session.userobj = {
        username: username,
        password: password,
      }
      response.send(success(shastr))
    }
  } catch (error) {
    next(error)
  }
})

const useSql = {
  loginSql:
    "select username,password from user where username = ? and password = ?",
}
module.exports = router
