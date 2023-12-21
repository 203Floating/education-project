const router = require("express").Router()
const DButils = require("../utils/DButils")
const { success } = require("../utils/msg")
router.get("/", async function (request, response, next) {
  try {
    const data = await DButils.excute(schoolSql.getSql, [])
    response.send(success(data))
  } catch (error) {
    next(error)
  }
})
router.post("/edit", async function (request, response, next) {
  try {
    const data = await DButils.excute(schoolSql.updatedSql, [
      request.body.school_name,
      request.body.school_address,
      request.body.school_type,
      request.body.school_linkman,
      request.body.school_phone,
      request.body.school_id,
    ])
    response.send(success(data))
  } catch (error) {
    next(error)
  }
})
const schoolSql = {
  getSql: "select * from school ",
  updatedSql:
    "update school set school_name = ?,school_address = ?,school_type = ?,school_linkman = ?,school_phone = ? where school_id = ?",
}
module.exports = router
