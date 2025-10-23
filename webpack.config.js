import webpack from "webpack";
import path from "path";
import { fileURLToPath } from "url";
import TerserPlugin from "terser-webpack-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function (opts) {
  const { PROJECT_PATH, CMS_VERSION, debug, watch } = opts;

  if (!debug) {
    process.env.NODE_ENV = "production";
  }

  const baseConfig = {
    mode: debug ? "development" : "production",
    devtool: debug ? "cheap-module-source-map" : false,
    watch: !!watch,
    entry: {
      toolbar: `${PROJECT_PATH.js}/toolbar.js`,
      "admin.base": `${PROJECT_PATH.js}/admin.base.js`,
      "admin.pagetree": `${PROJECT_PATH.js}/admin.pagetree.js`,
      "admin.changeform": `${PROJECT_PATH.js}/admin.changeform.js`,
      "forms.pageselectwidget": `${PROJECT_PATH.js}/widgets/forms.pageselectwidget.js`,
      "forms.slugwidget": `${PROJECT_PATH.js}/widgets/forms.slugwidget.js`,
      "forms.pagesmartlinkwidget": `${PROJECT_PATH.js}/widgets/forms.pagesmartlinkwidget.js`,
      "forms.apphookselect": `${PROJECT_PATH.js}/widgets/forms.apphookselect.js`,
    },
    output: {
      path: `${PROJECT_PATH.js}/dist/${CMS_VERSION}/`,
      filename: "bundle.[name].min.js",
      chunkFilename: "bundle.[name].min.js",
      chunkLoadingGlobal: "cmsWebpackJsonp",
    },
    plugins: [
      new webpack.DefinePlugin({
        __DEV__: JSON.stringify(debug),
        __CMS_VERSION__: JSON.stringify(CMS_VERSION),
      }),
    ],
    optimization: {
      splitChunks: {
        cacheGroups: {
          adminBase: {
            name: "admin.base",
            chunks: (chunk) =>
              ["admin.pagetree", "admin.changeform"].includes(chunk.name),
            priority: 10,
            enforce: true,
          },
        },
      },
      minimize: !debug,
      ...(debug
        ? {}
        : {
            minimizer: [
              new TerserPlugin({
                terserOptions: {
                  format: {
                    comments: false,
                  },
                  compress: {
                    drop_console: true,
                  },
                },
                extractComments: false,
              }),
            ],
          }),
    },
    resolve: {
      alias: {
        jquery: `${PROJECT_PATH.js}/libs/jquery.min.js`,
        classjs: `${PROJECT_PATH.js}/libs/class.min.js`,
        jstree: `${PROJECT_PATH.js}/libs/jstree/jstree.min.js`,
      },
    },
    module: {
      rules: [
        // must be first
        {
          test: /\.js$/,
          use: [
            {
              loader: "babel-loader",
              options: {
                retainLines: true,
              },
            },
          ],
          exclude: /(node_modules|libs|addons\/jquery.*)/,
          include: path.join(__dirname, "cms"),
        },
        {
          test: /(modules\/jquery|libs\/pep|select2\/select2)/,
          use: [
            {
              loader: "imports-loader",
              options: {
                imports: {
                  moduleName: "jquery",
                  name: "jQuery",
                },
              },
            },
          ],
        },
        {
          test: /class\.min\.js$/,
          use: [
            {
              loader: "exports-loader",
              options: {
                exports: "default Class",
              },
            },
          ],
        },
        {
          test: /\.html$/,
          type: "asset/source",
        },
      ],
    },
    stats: "verbose",
  };

  return baseConfig;
}
