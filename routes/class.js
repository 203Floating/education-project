const express = require("express")
const router = express.Router()
const DButils = require("../utils/DButils")
const { success, error } = require("../utils/msg")

// 查询班级
router.post("/", async function (request, response, next) {
  try {
    const res1 = await DButils.excute(
      classSql.searchSql(request.body, true),
      []
    )
    const res2 = await DButils.excute(classSql.searchSql(request.body), [])
    const data = res2.map((item) => {
      return {
        ...item,
        total: res1.length,
      }
    })
    response.send(success(data))
  } catch (error) {
    next(error)
  }
})
// 删除班级
router.delete("/delete", async function (request, response, next) {
  try {
    const res = await DButils.excute(classSql.searchStuSql(request.query), [])
    if (res.length !== 0) {
      response.send(error("班级下存在学生，不能删除"))
    } else {
      await DButils.excute(classSql.deleteSql1, [request.query.c_id])
      await DButils.excute(classSql.deleteSql2, [request.query.c_id])
      response.send(success("删除成功"))
    }
  } catch (error) {
    next(error)
  }
})
// 编辑班级
router.post("/edit", async function (request, response, next) {
  try {
    console.log(request.body)

    const res = await DButils.excute("select * from class where c_id = ? ", [
      request.body.c_id,
    ])
    if (res.length === 0) {
      await DButils.excute(classSql.insertSql1(request.body), [])
      await DButils.excute(classSql.insertSql2(request.body), [])

      response.send(success("添加成功"))
    } else {
      await DButils.excute(classSql.updateSql1(request.body), [])
      await DButils.excute(classSql.updateSql2(request.body), [])

      response.send(success("修改成功"))
    }
  } catch (error) {
    next(error)
  }
})
const classSql = {
  searchSql: function (body, total) {
    let offset = 0
    let str = ""
    let sql = `SELECT * FROM class c JOIN class_extra ce ON c.c_id = ce.c_id`

    if (body.g_id && body.c_id) {
      str = `WHERE ce.g_id = '${body.g_id}' AND c.c_id='${body.c_id}' `
    } else if (body.g_id && !body.c_id) {
      str = `WHERE ce.g_id = '${body.g_id}'`
    } else if (!body.g_id && body.c_id) {
      str = `WHERE c.c_id = '${body.c_id}'`
    } else {
      str = ""
    }
    if (str !== "") sql += ` ${str}`

    if (!total) {
      // 归类
      sql += ` ORDER BY c.c_id ASC`
      // 添加分页
      if (body.offset) {
        offset = body.offset * 10
      }
      sql += ` LIMIT 10 OFFSET ${offset}`
    }

    return sql
  },

  // 更新班级数据
  updateSql1: function (body) {
    return `UPDATE class SET c_name = '${body.c_name}', c_headmaster = '${body.c_headmaster}', c_type = '${body.c_type}' WHERE c_id = '${body.c_id}'`
  },
  updateSql2: function (body) {
    return `UPDATE class_extra SET g_id = '${body.g_id}', t_id = '${body.t_id}' ,timetable_id = '${body.timetable_id}' WHERE c_id = '${body.c_id}'`
  },

  //添加班级
  insertSql1: function (body) {
    return `INSERT INTO class (c_name,c_headmaster,c_type,c_id) VALUES ('${body.c_name}','${body.c_headmaster}','${body.c_type}','${body.c_id}')`
  },
  insertSql2: function (body) {
    return `INSERT INTO class_extra (g_id,t_id,c_id,timetable_id) VALUES ('${body.g_id}','${body.t_id}','${body.c_id}','${body.timetable_id}')`
  },
  //删除班级
  deleteSql1: `DELETE FROM class WHERE c_id = ?`,
  deleteSql2: `DELETE FROM class_extra WHERE c_id = ?`,
  //搜索学生
  searchStuSql: function (query) {
    return `select * from student_extra where c_id='${query.c_id}'`
  },
}

module.exports = router
