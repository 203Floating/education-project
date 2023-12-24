const router = require("express").Router()
const DButils = require("../utils/DButils")
const { success, error } = require("../utils/msg")
router.get("/", async function (request, response, next) {
  try {
    const data = await DButils.excute(schoolSql.getSql, [])
    response.send(success(data))
  } catch (error) {
    next(error)
  }
})
router.post("/edit", async function (request, response, next) {
  const {
    school_name,
    school_address,
    school_type,
    school_linkman,
    school_phone,
    school_id,
  } = request.body

  if (
    !(
      school_name &&
      school_address &&
      school_type &&
      school_linkman &&
      school_phone &&
      school_id
    )
  ) {
    response.send(error("编辑失败"))
  } else {
    try {
      const data = await DButils.excute(schoolSql.updatedSql, [
        school_name,
        school_address,
        school_type,
        school_linkman,
        school_phone,
        school_id,
      ])

      response.send(success(data))
    } catch (updateError) {
      next(updateError)
    }
  }
})

const schoolSql = {
  getSql: "select * from school ",
  updatedSql:
    "update school set school_name = ?,school_address = ?,school_type = ?,school_linkman = ?,school_phone = ? where school_id = ?",
}
module.exports = router
