// webpack.config.mjs
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'vitasight.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'vitasight',
  },
  module: {
    rules: [
      {
        test: /\.js$/, // specifiy that rule is for .js files that are not node-modules
        exclude: /node_modules/,
        use: ['babel-loader']   //babel-loader runs and thereby transpile modules as webpack encounters them
      }
    ]
  }
};