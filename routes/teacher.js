const express = require("express")
const router = express.Router()
const DButils = require("../utils/DButils")
const { success } = require("../utils/msg")

// 查询教师
router.post("/", async function (request, response, next) {
  try {
    const data = await DButils.excute(teacherSql.searchSql(request.query), [])
    response.send(data)
  } catch (error) {
    next(error)
  }
})
// 删除教师
router.delete("/delete", async function (request, response, next) {
  try {
    const data = await DButils.excute(teacherSql.deleteSql, [
      request.query.t_id,
    ])
    response.send(success(data))
  } catch (error) {
    next(error)
  }
})
// 编辑教师
router.post("/edit", async function (request, response, next) {
  try {
    if (
      (await DButils.excute(teacherSql.searchExist, [request.query.t_id])
        .length) === 0
    ) {
      await DButils.excute(teacherSql.insertSql1(request.query), [])
      if (request.query.sub_id) {
        await DButils.excute(teacherSql.insertSql2(request.query), [])
      }
      response.send(success("添加成功"))
    } else {
      await DButils.excute(teacherSql.editSql1(request.query), [])
      if (request.query.sub_id) {
        await DButils.excute(teacherSql.editSql2(request.query), [])
      }
      response.send(success("修改成功"))
    }
  } catch (error) {
    next(error)
  }
})

const teacherSql = {
  searchSql: function (query) {
    let sql = "select * from teacher"
    let str = ""
    if (query.sub_id) {
      sql = `select * from teacher t join teacher_subject  s on t.t_id = s.t_id `
      str += `s.sub_id = '${query.sub_id}'`
    }
    if (query.t_name) {
      if (str != "") str += "and"
      else str = `t.t_name like '%${query.t_name}%'`
    }
    if (query.t_IDnumber) {
      if (str != "") str += "and"
      else str = `t.t_IDnumber like '%${query.t_IDnumber}%'`
    }
    if (query.t_post) {
      if (str != "") str += "and"
      else str = `t.t_post = '${query.t_post}'`
    }
    if (query.t_status) {
      if (str != "") str += "and"
      else str = `t.t_status= '${query.t_status}'`
    }
    if (str != "") sql += `where ${str}`
    return sql
  },
  deleteSql: "select * from teacher where t_id = ?",
  editSql1: function (query) {
    return `UPDATE teacher SET t_name = '${query.t_name}', t_status = '${query.t_status}', t_phone = '${query.t_phone}', t_address = '${query.t_address}' WHERE t_id = '${query.t_id}'`
  },
  editSql2: function (query) {
    return `UPDATE teacher_subject SET sub_id = '${query.sub_id}' WHERE t_id = '${query.t_id}'`
  },
  insertSql1: function (query) {
    return `INSERT INTO teacher (t_id, t_name, t_status, t_phone, t_address) VALUES ('${query.t_id}', '${query.t_name}', '${query.t_status}', '${query.t_phone}', '${query.t_address}')`
  },
  insertSql2: function (query) {
    return `INSERT INTO teacher_subject (t_id, sub_id) VALUES ('${query.t_id}', '${query.sub_id}')`
  },
  searchExist: "select * from teacher where t_id = ?",
}
module.exports = router
