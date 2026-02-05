module.exports = {
  // 开发环境建议使用能平衡速度和质量的配置
  devtool: 'eval-cheap-module-source-map',
  cache: {
    type: 'filesystem',
    // 建议添加版本号，当配置大改时手动更新以清除旧的不良缓存
    version: '1.0', 
  }
  // 或者在生产环境使用生成独立 .map 文件的配置
  // devtool: 'source-map', 
}