const express = require("express")
const router = express.Router()
const DButils = require("../utils/DButils")
const { success } = require("../utils/msg")
// 查询学生
router.get("/", async function (request, response, next) {
  try {
    const data1 = await DButils.excute(subSql.searchSql1, [])
    const data2 = await DButils.excute(subSql.searchSql2, [])

    response.send(success({ data1, data2 }))
  } catch (error) {
    next(error)
  }
})

const subSql = {
  searchSql1: "select * from main_class",
  searchSql2: "select * from assist_class",
}

module.exports = router
