module.exports = {
  target: 'serverless',
  webpack: (cfg) => {
    cfg.module.rules.push(
      {
        test: /\.md$/,
          loader: 'frontmatter-markdown-loader',
          options: { mode: ['react-component'], react: { root: 'article' } }
      }
    )
    return cfg;
  }
}
