const express = require("express")
const router = express.Router()
const DButils = require("../utils/DButils")
const { success, error } = require("../utils/msg")
// 查询选修课程
router.post("/", async function (request, response, next) {
  try {
    const data = await DButils.excute(assistClassSql.searchSql(request.query), [
      request.ac_id,
    ])
    response.send(success(data))
  } catch (error) {
    next(error)
  }
})
// 删除选修课程
router.delete("/delete", async function (request, response, next) {
  try {
    await DButils.excute(assistClassSql.deleteSql, [request.query.ac_id])
    response.send(success("删除成功"))
  } catch (error) {
    next(error)
  }
})
//添加选修课程
router.post("/add", async function (request, response, next) {
  try {
    await DButils.excute(assistClassSql.insertSql, [
      request.query.ac_id,
      request.query.ac_name,
      request.query.sub_year,
      request.query.g_id,
      request.query.ac_status,
    ])
    response.send(success("添加成功"))
  } catch (error) {
    next(error)
  }
})

const assistClassSql = {
  searchSql: (query) => {
    if (query.ac_id === undefined) return `SELECT * FROM assist_class`
    else return `SELECT * FROM assist_class WHERE ac_id = ${query.ac_id}`
  },
  deleteSql: `DELETE FROM assist_class WHERE ac_id = ?`,
  insertSql: `INSERT INTO assist_class (ac_id,ac_name,sub_year,g_id, ac_status) VALUES (?,?,?,?,?)`,
}

module.exports = router
