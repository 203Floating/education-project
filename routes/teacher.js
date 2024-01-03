const express = require("express")
const router = express.Router()
const DButils = require("../utils/DButils")
const { success } = require("../utils/msg")
// 查询教师
router.post("/", async function (request, response, next) {
  try {
    console.log(request.body)
    const res1 = await DButils.excute(
      teacherSql.searchSql(request.body, true),
      []
    )
    const res2 = await DButils.excute(teacherSql.searchSql(request.body), [])
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
// 删除教师
router.delete("/delete", async function (request, response, next) {
  try {
    console.log(request.query.t_id)
    await DButils.excute(teacherSql.deleteSql1(request.query))
    await DButils.excute(teacherSql.deleteSql2(request.query))
    response.send(success("删除成功"))
  } catch (error) {
    next(error)
  }
})
// 编辑教师
router.post("/edit", async function (request, response, next) {
  try {
    const res = await DButils.excute(
      `SELECT * FROM teacher WHERE t_id = '${request.body.t_id}'`,
      []
    )
    if (res.length === 0) {
      console.log("添加操作")
      await DButils.excute(teacherSql.insertSql1(request.body), [])
      if (request.body.sub_id) {
        await DButils.excute(teacherSql.insertSql2(request.body), [])
      }
      response.send(success("添加成功"))
    } else {
      await DButils.excute(teacherSql.editSql1(request.body), [])
      if (request.body.sub_id) {
        await DButils.excute(teacherSql.editSql2(request.body), [])
      }
      response.send(success("修改成功"))
    }
  } catch (error) {
    next(error)
  }
})

const teacherSql = {
  searchSql: function (body, total) {
    let sql = `select * from teacher t join teacher_subject  s on t.t_id = s.t_id `
    let str = ""
    let offset = 0
    if (body.sub_id) {
      str += ` s.sub_id = '${body.sub_id}'`
    }
    if (body.t_name) {
      if (str != "") str += "and"
      str += ` t.t_name like '%${body.t_name}%'`
    }
    if (body.t_IDnumber) {
      if (str != "") str += "and"
      str += ` t.t_IDnumber like '%${body.t_IDnumber}%'`
    }
    if (body.t_post) {
      if (str != "") str += "and"
      str += ` t.t_post = '${body.t_post}'`
    }
    if (body.t_status) {
      if (str != "") str += "and"
      str += ` t.t_status= '${body.t_status}'`
    }
    if (str != "") sql += `where ${str}`
    if (!total) {
      //归类
      sql += ` ORDER BY t.t_id ASC`
      // 添加分页
      if (body.offset) {
        offset = body.offset * 10
      }
      sql += ` LIMIT 10 OFFSET ${offset}`
    }

    return sql
  },
  deleteSql1: function (query) {
    return `DELETE FROM teacher WHERE t_id = '${query.t_id}'`
  },
  deleteSql2: function (query) {
    return `DELETE FROM teacher_subject WHERE t_id = '${query.t_id}'`
  },
  editSql1: function (body) {
    return `UPDATE teacher SET t_name = '${body.t_name}', t_status = '${body.t_status}', t_phone = '${body.t_phone}', t_address = '${body.t_address}', t_email='${body.t_email}', t_IDtype='${body.t_IDtype}', t_IDnumber='${body.t_IDnumber}', t_sex='${body.t_sex}' WHERE t_id = '${body.t_id}'`
  },
  editSql2: function (body) {
    return `UPDATE teacher_subject SET sub_id = '${body.sub_id}', g_id='${body.g_id}' WHERE t_id = '${body.t_id}'`
  },
  insertSql1: function (body) {
    return `INSERT INTO teacher (t_id, t_name, t_sex, t_status, t_phone, t_address, t_email, t_IDtype, t_IDnumber, t_date, t_m) VALUES ('${body.t_id}', '${body.t_name}', '${body.t_sex}', '${body.t_status}', '${body.t_phone}', '${body.t_address}', '${body.t_email}', '${body.t_IDtype}', '${body.t_IDnumber}', NOW(), '${body.t_m}')`
  },
  insertSql2: function (body) {
    return `INSERT INTO teacher_subject (t_id, sub_id, g_id) VALUES ('${body.t_id}', '${body.sub_id}', ${body.g_id})`
  },
}
module.exports = router
