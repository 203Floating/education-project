class msg {
  error(error) {
    return {
      status: false,
      message: error,
    }
  }
  success(success) {
    if (success) {
      return {
        status: true,
        message: "成功",
        data: success,
      }
    } else {
      return {
        status: false,
        message: "失败",
      }
    }
  }
}

module.exports = new msg()
