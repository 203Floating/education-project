const express = require("express")
const router = express.Router()
const DButils = require("../utils/DButils")
const { success } = require("../utils/msg")
// 查询教师
router.post("/", async function (request, response, next) {
  try {
    const data = await DButils.excute("select * from timetable", [])
    response.send(data)
  } catch (error) {
    next(error)
  }
})

module.exports = router
