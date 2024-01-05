const express = require("express")
const router = express.Router()
const DButils = require("../utils/DButils")
const { success } = require("../utils/msg")
// 查询学生
router.post("/", async function (request, response, next) {
  try {
    const res1 = await DButils.excute(
      studentSql.searchSql(request.body, true),
      []
    )
    const res2 = await DButils.excute(studentSql.searchSql(request.body), [])
    const data = res2.map((item) => {
      return {
        ...item,
        total: res1.length,
      }
    })

    response.send(data)
  } catch (error) {
    next(error)
  }
})
//学生数据更新
router.post("/update", async function (request, response, next) {
  try {
    await DButils.excute(studentSql.updateSql(request.body), [])
    response.send(success("更新成功"))
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
    console.log(request.body, "request.body")
    const res = await DButils.excute(
      `SELECT * FROM student WHERE stu_id = '${request.body.stu_id}'`,
      []
    )
    console.log(res)
    if (!res.length) {
      await DButils.excute(studentSql.insertSql1(request.body), [])
      await DButils.excute(studentSql.insertSql2(request.body), [])
      response.send(success("添加成功"))
    } else {
      await DButils.excute(studentSql.editSql1(request.body), [])
      await DButils.excute(studentSql.editSql2(request.body), [])
      response.send(success("修改成功"))
    }
  } catch (error) {
    next(error)
  }
})
// 学生兴趣课程管理,兴趣课程更新
router.post("/updateSubs", async function (request, response, next) {
  try {
    const data = await DButils.excute(
      studentSql.updateSubsSql(request.body),
      []
    )
    response.send(data)
  } catch (error) {
    console.log(error)
  }
})
const studentSql = {
  searchSql: function (body, total) {
    let sql =
      "SELECT * FROM student stu JOIN student_extra stus ON stus.stu_id = stu.stu_id"
    let str = ""
    let offset = 0
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
    if (!total) {
      //归类
      sql += ` ORDER BY stu.stu_id ASC`
      // 添加分页
      if (body.offset) {
        offset = body.offset * 10
      }
      sql += ` LIMIT 10 OFFSET ${offset}`
    }

    return sql
  },
  deleteSql1: function (query) {
    return `delete from student where stu_id = '${query.stu_id}'`
  },
  deleteSql2: function (query) {
    return `delete from student_extra where stu_id = '${query.stu_id}'`
  },
  updateSql: function (body) {
    return `UPDATE student_extra SET task_id='${body.task_id}' WHERE stu_id = '${body.stu_id}'`
  },
  editSql1: function (body) {
    return `UPDATE student SET stu_name = '${body.stu_name}', stu_sex = '${body.stu_sex}',  stu_M='${body.stu_M}' ,stu_linkman='${body.stu_linkman}',stu_IDtype='${body.stu_IDtype}',stu_IDnumber='${body.stu_IDnumber}',stu_phone = '${body.stu_phone}', stu_address = '${body.stu_address}'WHERE stu_id = '${body.stu_id}'`
  },
  editSql2: function (body) {
    return `UPDATE student_extra SET c_id = '${body.c_id}', g_id = '${body.g_id}'  WHERE stu_id = '${body.stu_id}'`
  },
  insertSql1: function (body) {
    return `INSERT INTO student (stu_id, stu_name, stu_phone, stu_address,stu_sex,stu_M,stu_IDtype,stu_IDnumber,stu_linkman,stu_createDate
      ) VALUES ('${body.stu_id}', '${body.stu_name}', '${body.stu_phone}', '${body.stu_address}','${body.stu_sex}','${body.stu_M}','${body.stu_IDtype}','${body.stu_IDnumber}','${body.stu_linkman}',NOW())`
  },
  insertSql2: function (body) {
    return `INSERT INTO student_extra (stu_id, c_id, g_id,task_id) VALUES ('${body.stu_id}', '${body.c_id}', '${body.g_id}','-1')`
  },
  // searchExist: "SELECT * FROM student WHERE stu_id = ?",
  updateSubsSql: function (body) {
    return `UPDATE student_extra SET subs='${body.subs}' WHERE stu_id = '${body.stu_id}'`
  },
}

module.exports = router
