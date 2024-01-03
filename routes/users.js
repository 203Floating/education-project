const express = require("express")
const router = express.Router()
const DButils = require("../utils/DButils")
const { success, error } = require("../utils/msg")
// const crypto = require("crypto")

const { jwtAuth, tokenStr } = require("../utils/JwtUtils")
router.post("/", async function (request, response, next) {
  console.log(request.body, "request")
  const { username, password } = request.body
  try {
    request
    if (username === undefined || password === undefined) {
      response.send(error("用户名或密码不能为空"))
      return
    }
    const data = await DButils.excute(useSql.loginSql, [username, password])
    if (data.length === 0) {
      response.send(error("用户名或密码错误"))
      return
    } else {
      const user = { usename: username, password: password }
      const token = tokenStr(user)

      // 将 token 发送给前端
      const msg = {
        data,
        token,
      }
      response.send(success(msg))
      // response.send(success(token, data))
    }
  } catch (error) {
    next(error)
  }
})

const useSql = {
  loginSql: "select * from user where username = ? and password = ?",
}
module.exports = router
