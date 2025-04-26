/**
 * 国际象棋训练模型 - 训练脚本
 */
const fs = require('fs');
const path = require('path');
const Chess = require('chess.js');
const { boardToInput, createNetwork } = require('./model');

/**
 * 从FEN字符串生成训练数据
 * @param {string} fen - FEN字符串表示的棋盘状态
 * @param {number} evaluation - 该位置的评估分数
 * @returns {Object} - 训练数据对象
 */
function createTrainingData(fen, evaluation) {
  const chess = new Chess(fen);
  const input = boardToInput(chess);
  
  // 将评估分数归一化到0-1范围
  // 假设评估分数在-10到10之间
  const normalizedEval = (evaluation + 10) / 20;
  
  return {
    input,
    output: [normalizedEval]
  };
}

/**
 * 从PGN文件生成训练数据
 * @param {string} pgnFile - PGN文件路径
 * @returns {Array} - 训练数据数组
 */
function generateTrainingDataFromPGN(pgnFile) {
  // 这里简化处理，实际应用中需要解析PGN文件
  // 并提取每个位置的评估值（可能需要使用国际象棋引擎）
  console.log(`从${pgnFile}生成训练数据...`);
  
  // 示例训练数据
  return [
    // 初始位置，评估为0（均势）
    createTrainingData('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', 0),
    
    // 一些常见开局位置的示例
    createTrainingData('rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1', 0.2),
    createTrainingData('rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2', 0),
    createTrainingData('rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq d6 0 2', -0.1),
    
    // 一些中局位置
    createTrainingData('r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3', 0.1),
    createTrainingData('r1bqkb1r/pppp1ppp/2n2n2/4p3/4P3/2N2N2/PPPP1PPP/R1BQKB1R w KQkq - 4 4', 0),
    
    // 一些有明显优势的位置
    createTrainingData('rnbqkbnr/ppp2ppp/8/3pp3/4PP2/8/PPPP2PP/RNBQKBNR w KQkq d6 0 3', 0.5),
    createTrainingData('rnbqkbnr/pp3ppp/2p5/3pp3/4PP2/2PP4/PP4PP/RNBQKBNR b KQkq - 0 4', -0.6),
    
    // 残局位置
    createTrainingData('4k3/8/8/8/8/8/4P3/4K3 w - - 0 1', 0.3),
    createTrainingData('4k3/4p3/8/8/8/8/8/4K3 w - - 0 1', -0.3),
  ];
}

/**
 * 训练神经网络
 */
async function trainNetwork() {
  console.log('开始训练神经网络...');
  
  // 创建神经网络
  const network = createNetwork();
  
  // 生成训练数据
  // 实际应用中，应该使用大量真实对局数据
  const trainingData = generateTrainingDataFromPGN('example.pgn');
  
  console.log(`生成了${trainingData.length}条训练数据`);
  
  // 训练网络
  const trainingOptions = {
    iterations: 20000,    // 训练迭代次数
    errorThresh: 0.005,   // 错误阈值
    log: true,            // 是否记录训练过程
    logPeriod: 1000,      // 日志周期
  };
  
  console.log('训练中...');
  const results = await network.trainAsync(trainingData, trainingOptions);
  console.log('训练完成！', results);
  
  // 保存训练好的模型
  const modelData = network.toJSON();
  const modelDir = path.join(__dirname, '../models');
  
  // 确保模型目录存在
  if (!fs.existsSync(modelDir)) {
    fs.mkdirSync(modelDir, { recursive: true });
  }
  
  fs.writeFileSync(
    path.join(modelDir, 'chess-model.json'),
    JSON.stringify(modelData),
    'utf8'
  );
  
  console.log('模型已保存到', path.join(modelDir, 'chess-model.json'));
  
  return network;
}

// 如果直接运行此脚本，则执行训练
if (require.main === module) {
  trainNetwork().catch(console.error);
}

module.exports = {
  trainNetwork,
  createTrainingData,
  generateTrainingDataFromPGN
};