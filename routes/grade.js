const express = require("express")
const router = express.Router()
const DButils = require("../utils/DButils")
const { success, error } = require("../utils/msg")
// 查询班级
router.get("/", async function (request, response, next) {
  try {
    const data = await DButils.excute("select * from grade", [])

    response.send(success(data))
  } catch (error) {
    next(error)
  }
})

module.exports = router
