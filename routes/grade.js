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
//删除年级主任

router.delete("/delete", async function (request, response, next) {
  try {
    const data = await DButils.excute(`update grade set g_headmaster= 0  WHERE g_id = '${request.query.g_id}'`, [])
    response.send(success(data))
  } catch (error) {
    next(error)
  }
})
//添加年级主任
router.post("/add", async function (request, response, next) {
  try {
    console.log(request.body);
    const data = await DButils.excute(`update grade set g_headmaster= '${request.body.g_headmaster}'  WHERE g_id = '${request.body.g_id}'`, [])
    response.send(success(data))
  } catch (error) {
    next(error)
  }
})
module.exports = router
