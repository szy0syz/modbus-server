module.exports = exports = function lastModifiedPlugin(schema, options) {
    // schema.add({ meta: {} })
  
    schema.pre('save', function (next) {
      if (this.isNew) {
        this.meta = {} // 不能给访问undefined的属性, schema.add竟然不起作用!
        this.meta.createdAt = this.meta.updatedAt = Date.now()
      } else {
        this.meta.updatedAt = Date.now()
      }
  
      next()
    })
  }
  