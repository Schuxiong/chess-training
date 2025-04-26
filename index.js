/**
 * 国际象棋训练模型 - 主入口文件
 */
const Chess = require('chess.js');
const { trainNetwork } = require('./src/train');
const { loadModel, testPositions } = require('./src/test');
const { evaluatePosition } = require('./src/model');
const fs = require('fs');
const path = require('path');

/**
 * 显示帮助信息
 */
function showHelp() {
  console.log('国际象棋训练模型 - 使用Brain.js');
  console.log('使用方法:');
  console.log('  node index.js train        - 训练新模型');
  console.log('  node index.js test         - 测试现有模型');
  console.log('  node index.js evaluate [fen] - 评估指定的棋盘位置');
  console.log('  node index.js help         - 显示此帮助信息');
}

/**
 * 评估指定的FEN位置
 * @param {string} fen - FEN字符串表示的棋盘位置
 */
async function evaluatePositionFromFEN(fen) {
  try {
    // 验证FEN字符串
    const chess = new Chess(fen);
    
    // 加载模型
    const network = loadModel();
    
    // 评估位置
    const evaluation = evaluatePosition(chess, network);
    
    console.log('棋盘位置评估:');
    console.log(`FEN: ${fen}`);
    console.log(`评估分数: ${evaluation.toFixed(3)}`);
    console.log('(正值有利于白方，负值有利于黑方)');
    
    // 打印棋盘的ASCII表示
    console.log('\n棋盘:');
    console.log(chess.ascii());
    
  } catch (error) {
    console.error('评估位置时出错:', error.message);
  }
}

/**
 * 主函数
 */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'help';
  
  switch (command) {
    case 'train':
      console.log('开始训练新模型...');
      await trainNetwork();
      break;
      
    case 'test':
      try {
        const network = loadModel();
        testPositions(network);
      } catch (error) {
        console.error('测试失败:', error.message);
        console.log('请先使用 "node index.js train" 训练模型');
      }
      break;
      
    case 'evaluate':
      const fen = args[1] || 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
      await evaluatePositionFromFEN(fen);
      break;
      
    case 'help':
    default:
      showHelp();
      break;
  }
}

// 确保models目录存在
const modelsDir = path.join(__dirname, 'models');
if (!fs.existsSync(modelsDir)) {
  fs.mkdirSync(modelsDir, { recursive: true });
}

// 确保src目录存在
const srcDir = path.join(__dirname, 'src');
if (!fs.existsSync(srcDir)) {
  fs.mkdirSync(srcDir, { recursive: true });
}

// 运行主函数
main().catch(console.error);