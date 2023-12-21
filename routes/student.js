const express = require("express")
const router = express.Router()
const DButils = require("../utils/DButils")
const { success } = require("../utils/msg")
// 查询学生
router.post("/", async function (request, response, next) {
  try {
    const data = await DButils.excute(studentSql.searchSql(request.query), [])
    response.send(success(data))
  } catch (error) {
    next(error)
  }
})
// 删除学生
router.delete("/delete", async function (request, response, next) {
  try {
    const data = await DButils.excute(studentSql.deleteSql, [
      request.query.stu_id,
    ])
    response.send(success(data))
  } catch (error) {
    next(error)
  }
})
// 编辑
router.post("/edit", async function (request, response, next) {
  try {
    if (
      (await DButils.excute(studentSql.searchExist, [request.query.stu_id])
        .length) === 0
    ) {
      await DButils.excute(studentSql.insertSql1(request.query), [])
      await DButils.excute(studentSql.insertSql2(request.query), [])
      response.send(success("添加成功"))
    } else {
      await DButils.excute(studentSql.edtiSql1(request.query), [])
      await DButils.excute(studentSql.editSql2(request.query), [])
      response.send(success("修改成功"))
    }
  } catch (error) {
    next(error)
  }
})

const studentSql = {
  searchSql: function (query) {
    let sql = "SELECT * FROM student stu"
    let str = ""
    if (query.stu_name) {
      str = `stu.stu_name LIKE '%${query.stu_name}%'`
    }
    if (query.stu_id) {
      if (str !== "") {
        str += " AND "
      }
      str += `stu.stu_id LIKE '%${query.stu_id}%'`
    }
    if (query.c_id || query.g_id) {
      sql =
        "SELECT * FROM student stu JOIN student_extra stus ON stus.stu_id = stu.stu_id"
      if (query.c_id) {
        if (str !== "") {
          str += " AND "
        }
        str += `stus.c_id = '${query.c_id}'`
      }
      if (query.g_id) {
        if (str !== "") {
          str += " AND "
        }
        str += `stus.g_id = '${query.g_id}'`
      }
    }
    if (str !== "") {
      sql += ` WHERE ${str}`
    }
    return sql
  },
  deleteSql: "select * from student where stu_id = ?",
  editSql1: function (query) {
    return `UPDATE student SET stu_name = '${query.stu_name}', stu_phone = '${query.stu_phone}', stu_address = '${query.stu_address}' WHERE stu_id = '${query.stu_id}'`
  },
  editSql2: function (query) {
    return `UPDATE student_extra SET c_id = '${query.c_id}', g_id = '${query.g_id}' WHERE stu_id = '${query.stu_id}'`
  },
  insertSql1: function (query) {
    return `INSERT INTO student (stu_id, stu_name, stu_phone, stu_address) VALUES ('${query.stu_id}', '${query.stu_name}', '${query.stu_phone}', '${query.stu_address}')`
  },
  insertSql2: function (query) {
    return `INSERT INTO student_extra (stu_id, c_id, g_id) VALUES ('${query.stu_id}', '${query.c_id}', '${query.g_id}')`
  },
  searchExist: "SELECT * FROM student WHERE stu_id = ?",
}

module.exports = router
