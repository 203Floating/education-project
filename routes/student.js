const express = require("express")
const router = express.Router()
const DButils = require("../utils/DButils")
const { success } = require("../utils/msg")
// 查询学生
router.post("/", async function (request, response, next) {
  try {
    const data = await DButils.excute(studentSql.searchSql(request.body), [])
    response.send(success(data))
  } catch (error) {
    next(error)
  }
})
// 删除学生
router.delete("/delete", async function (request, response, next) {
  try {
    await DButils.excute(studentSql.deleteSql1(request.query), [])
    await DButils.excute(studentSql.deleteSql2(request.query), [])

    response.send("删除成功")
  } catch (error) {
    next(error)
  }
})
// 编辑
router.post("/edit", async function (request, response, next) {
  try {
    if (
      (await DButils.excute(studentSql.searchExist, [request.body.stu_id])
        .length) === 0
    ) {
      await DButils.excute(studentSql.insertSql1(request.body), [])
      await DButils.excute(studentSql.insertSql2(request.body), [])
      response.send(success("添加成功"))
    } else {
      await DButils.excute(studentSql.edtiSql1(request.body), [])
      await DButils.excute(studentSql.editSql2(request.body), [])
      response.send(success("修改成功"))
    }
  } catch (error) {
    next(error)
  }
})

const studentSql = {
  searchSql: function (body) {
    let sql =
      "SELECT * FROM student stu JOIN student_extra stus ON stus.stu_id = stu.stu_id"
    let str = ""
    if (body.stu_name) {
      str = `stu.stu_name LIKE '%${body.stu_name}%'`
    }
    if (body.stu_id) {
      if (str !== "") {
        str += " AND "
      }
      str += `stu.stu_id LIKE '%${body.stu_id}%'`
    }
    if (body.c_id) {
      if (str !== "") {
        str += " AND "
      }
      str += `stus.c_id = '${body.c_id}'`
    }
    if (body.g_id) {
      if (str !== "") {
        str += " AND "
      }
      str += `stus.g_id = '${body.g_id}'`
    }
    if (str !== "") {
      sql += ` WHERE ${str}`
    }
    return sql
  },
  deleteSql1: function (query) {
    return `delete from student where stu_id = '${query.stu_id}'`
  },
  deleteSql2: function (query) {
    return `delete from student_extra where stu_id = '${query.stu_id}'`
  },

  editSql1: function (body) {
    return `UPDATE student SET stu_name = '${body.stu_name}', stu_phone = '${body.stu_phone}', stu_address = '${body.stu_address}' WHERE stu_id = '${body.stu_id}'`
  },
  editSql2: function (body) {
    return `UPDATE student_extra SET c_id = '${body.c_id}', g_id = '${body.g_id}' WHERE stu_id = '${body.stu_id}'`
  },
  insertSql1: function (body) {
    return `INSERT INTO student (stu_id, stu_name, stu_phone, stu_address) VALUES ('${body.stu_id}', '${body.stu_name}', '${body.stu_phone}', '${body.stu_address}')`
  },
  insertSql2: function (body) {
    return `INSERT INTO student_extra (stu_id, c_id, g_id) VALUES ('${body.stu_id}', '${body.c_id}', '${body.g_id}')`
  },
  searchExist: "SELECT * FROM student WHERE stu_id = ?",
}

module.exports = router
