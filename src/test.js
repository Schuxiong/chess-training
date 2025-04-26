/**
 * 国际象棋训练模型 - 测试脚本
 */
const fs = require('fs');
const path = require('path');
const brain = require('brain.js');
const Chess = require('chess.js');
const { boardToInput, evaluatePosition } = require('./model');

/**
 * 加载训练好的模型
 * @returns {brain.NeuralNetwork} - 加载的神经网络
 */
function loadModel() {
  const modelPath = path.join(__dirname, '../models/chess-model.json');
  
  if (!fs.existsSync(modelPath)) {
    throw new Error(`模型文件不存在: ${modelPath}`);
  }
  
  const modelData = JSON.parse(fs.readFileSync(modelPath, 'utf8'));
  const network = new brain.NeuralNetwork();
  network.fromJSON(modelData);
  
  return network;
}

/**
 * 测试模型在特定棋盘位置上的表现
 * @param {brain.NeuralNetwork} network - 训练好的神经网络
 */
function testPositions(network) {
  console.log('测试模型在不同棋盘位置的表现...');
  
  // 测试位置列表 [FEN字符串, 预期评估值, 描述]
  const testPositions = [
    ['rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', 0, '初始位置'],
    ['rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2', 0, 'e4 e5开局'],
    ['rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2', 0.1, '西西里防御'],
    ['r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4', 0.2, '意大利开局'],
    ['r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 6 5', 0, '西班牙开局'],
    ['r1bqkb1r/pppp1ppp/2n5/4p3/3Pn3/2P5/PP2PPPP/RNBQKBNR w KQkq - 1 4', -0.3, '苏格兰开局变例'],
    ['4k3/8/8/8/8/8/PPPP4/4K3 w - - 0 1', 0.7, '白方有明显优势的残局'],
    ['4k3/pppp4/8/8/8/8/8/4K3 w - - 0 1', -0.7, '黑方有明显优势的残局'],
  ];
  
  for (const [fen, expectedEval, description] of testPositions) {
    const chess = new Chess(fen);
    const evaluation = evaluatePosition(chess, network);
    
    console.log(`位置: ${description}`);
    console.log(`FEN: ${fen}`);
    console.log(`预期评估: ${expectedEval}`);
    console.log(`模型评估: ${evaluation.toFixed(3)}`);
    console.log(`误差: ${Math.abs(evaluation - expectedEval).toFixed(3)}`);
    console.log('-----------------------------------');
  }
}

/**
 * 运行测试
 */
async function runTests() {
  try {
    console.log('加载训练好的模型...');
    const network = loadModel();
    
    testPositions(network);
    
    console.log('测试完成！');
  } catch (error) {
    console.error('测试过程中出错:', error);
  }
}

// 如果直接运行此脚本，则执行测试
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = {
  loadModel,
  testPositions,
  runTests
};