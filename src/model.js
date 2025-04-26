/**
 * 国际象棋训练模型 - 使用Brain.js
 */
const brain = require('brain.js');
const Chess = require('chess.js');

/**
 * 棋盘状态转换为神经网络输入
 * @param {Chess} chess - chess.js实例
 * @returns {Array} - 神经网络输入数组
 */
function boardToInput(chess) {
  const board = chess.board();
  const input = [];
  
  // 遍历棋盘的每个位置
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const piece = board[i][j];
      
      // 如果该位置有棋子
      if (piece) {
        // 为每种棋子类型和颜色创建独热编码
        // 1代表白方，-1代表黑方
        const value = piece.color === 'w' ? 1 : -1;
        
        // 根据棋子类型设置不同的值
        switch (piece.type) {
          case 'p': // 兵
            input.push(value * 1);
            break;
          case 'n': // 马
            input.push(value * 3);
            break;
          case 'b': // 象
            input.push(value * 3);
            break;
          case 'r': // 车
            input.push(value * 5);
            break;
          case 'q': // 后
            input.push(value * 9);
            break;
          case 'k': // 王
            input.push(value * 100);
            break;
        }
      } else {
        // 空位置
        input.push(0);
      }
    }
  }
  
  // 添加额外特征：当前行动方 (1为白方，-1为黑方)
  input.push(chess.turn() === 'w' ? 1 : -1);
  
  // 添加城堡权限信息
  const castling = chess.fen().split(' ')[2];
  input.push(castling.includes('K') ? 1 : 0);
  input.push(castling.includes('Q') ? 1 : 0);
  input.push(castling.includes('k') ? 1 : 0);
  input.push(castling.includes('q') ? 1 : 0);
  
  return input;
}

/**
 * 创建并配置神经网络
 * @returns {brain.NeuralNetwork} - 配置好的神经网络实例
 */
function createNetwork() {
  return new brain.NeuralNetwork({
    hiddenLayers: [128, 64], // 两个隐藏层，分别有128和64个神经元
    activation: 'sigmoid',   // 激活函数
    learningRate: 0.1,       // 学习率
  });
}

/**
 * 评估棋盘位置
 * @param {Chess} chess - chess.js实例
 * @param {brain.NeuralNetwork} network - 训练好的神经网络
 * @returns {number} - 位置评分，正值有利于白方，负值有利于黑方
 */
function evaluatePosition(chess, network) {
  const input = boardToInput(chess);
  const output = network.run(input);
  
  // 输出是0到1之间的值，将其映射到-1到1之间
  return (output[0] * 2) - 1;
}

module.exports = {
  boardToInput,
  createNetwork,
  evaluatePosition
};